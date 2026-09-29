import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function testRiverFlowRefinement() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Normal camera: Player walks to bridge overlooking the river
  await page.keyboard.down('KeyS');
  await new Promise(r => setTimeout(r, 2600));
  await page.keyboard.up('KeyS');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'tests/screenshots/river_refine_normal.png' });
  console.log('Saved river_refine_normal.png');

  // 2. Close-up view: Move mouse to canvas center and zoom in close
  await page.mouse.move(640, 360);
  for (let i = 0; i < 18; i++) {
    await page.mouse.wheel({ deltaY: -60 });
    await new Promise(r => setTimeout(r, 40));
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'tests/screenshots/river_refine_close.png' });
  console.log('Saved river_refine_close.png (zoomed in)');

  // 3. Time series sequence at close-up to check peaceful slow drift speed (T=0, T=1.5s, T=3.0s)
  await page.screenshot({ path: 'tests/screenshots/river_drift_t0.png' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'tests/screenshots/river_drift_t15.png' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'tests/screenshots/river_drift_t30.png' });
  console.log('Saved drift sequence screenshots (t0, t15, t30)');

  // 4. Far distance view: Zoom out wide
  for (let i = 0; i < 28; i++) {
    await page.mouse.wheel({ deltaY: 60 });
    await new Promise(r => setTimeout(r, 30));
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'tests/screenshots/river_refine_far.png' });
  console.log('Saved river_refine_far.png (zoomed out)');

  // Reset to medium zoom
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel({ deltaY: -60 });
    await new Promise(r => setTimeout(r, 30));
  }
  await new Promise(r => setTimeout(r, 400));
  
  // Drag mouse to orbit camera slightly
  const rect = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const b = canvas.getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  });

  await page.mouse.move(rect.x, rect.y);
  await page.mouse.down({ button: 'right' });
  await page.mouse.move(rect.x + 180, rect.y - 40, { steps: 10 });
  await page.mouse.up({ button: 'right' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'tests/screenshots/river_refine_glancing.png' });
  console.log('Saved river_refine_glancing.png');

  // 6. Test movement along riverbank: Player walks westward along river
  await page.keyboard.down('KeyA');
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'tests/screenshots/river_refine_moving.png' });
  await page.keyboard.up('KeyA');
  console.log('Saved river_refine_moving.png');

  // 7. Measure 1-second FPS
  const perf = await page.evaluate(async () => {
    return new Promise(resolve => {
      let count = 0;
      const start = performance.now();
      function tick() {
        count++;
        if (performance.now() - start < 1000) {
          requestAnimationFrame(tick);
        } else {
          resolve({
            fps: Math.round(count / ((performance.now() - start) / 1000)),
            frameCount: count
          });
        }
      }
      requestAnimationFrame(tick);
    });
  });

  console.log('FPS result:', perf);
  console.log('Console/WebGL errors:', errors.length, errors);

  await browser.close();
}

testRiverFlowRefinement().catch(err => {
  console.error(err);
  process.exit(1);
});
