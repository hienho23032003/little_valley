import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function diagnose() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  // Wait a few seconds for Three scene to initialize
  await page.waitForFunction(() => !!window.__THREE_SCENE__);

  const overlapInfo = await page.evaluate(() => {
    const scene = window.__THREE_SCENE__;
    if (!scene) return { error: 'Scene not found' };

    const groundMeshes = [];

    scene.traverse((obj) => {
      if (obj.isMesh) {
        // compute world bounding box
        if (!obj.geometry.boundingBox) {
          obj.geometry.computeBoundingBox();
        }
        obj.updateWorldMatrix(true, false);
        const box = obj.geometry.boundingBox.clone().applyMatrix4(obj.matrixWorld);

        // Ground meshes: top Y is between -1.0 and 1.5, and size in X or Z is at least 2
        const sizeX = box.max.x - box.min.x;
        const sizeY = box.max.y - box.min.y;
        const sizeZ = box.max.z - box.min.z;

        if (box.max.y >= -0.5 && box.min.y <= 1.0 && (sizeX > 1.5 || sizeZ > 1.5)) {
          groundMeshes.push({
            name: obj.name || obj.parent?.name || 'unnamed',
            parentName: obj.parent?.name || '',
            materialType: obj.material?.type || (Array.isArray(obj.material) ? 'multi' : 'none'),
            materialColor: obj.material?.color ? obj.material.color.getHexString() : null,
            polygonOffset: obj.material?.polygonOffset || false,
            depthWrite: obj.material?.depthWrite,
            depthTest: obj.material?.depthTest,
            minX: Math.round(box.min.x * 100) / 100,
            maxX: Math.round(box.max.x * 100) / 100,
            minY: Math.round(box.min.y * 1000) / 1000,
            maxY: Math.round(box.max.y * 1000) / 1000,
            minZ: Math.round(box.min.z * 100) / 100,
            maxZ: Math.round(box.max.z * 100) / 100,
            sizeX: Math.round(sizeX * 100) / 100,
            sizeY: Math.round(sizeY * 1000) / 1000,
            sizeZ: Math.round(sizeZ * 100) / 100,
          });
        }
      }
    });

    // Now check for overlapping bounding boxes in X and Z where Y diff is < 0.05
    const overlaps = [];
    for (let i = 0; i < groundMeshes.length; i++) {
      for (let j = i + 1; j < groundMeshes.length; j++) {
        const a = groundMeshes[i];
        const b = groundMeshes[j];

        const overlapX = Math.max(0, Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX));
        const overlapZ = Math.max(0, Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ));

        if (overlapX > 0.5 && overlapZ > 0.5) {
          const yDiff = Math.abs(a.maxY - b.maxY);
          overlaps.push({
            meshA: a,
            meshB: b,
            overlapAreaXZ: Math.round(overlapX * overlapZ * 100) / 100,
            yDiff: Math.round(yDiff * 1000) / 1000
          });
        }
      }
    }

    return { totalGroundMeshes: groundMeshes.length, groundMeshes, overlaps };
  });

  console.log(JSON.stringify(overlapInfo, null, 2));
  await browser.close();
}

diagnose().catch(err => {
  console.error(err);
  process.exit(1);
});
