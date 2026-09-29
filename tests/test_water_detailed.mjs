import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function testWaterDetailed() {
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

  // 1. Walk onto the bridge overlooking the river
  await page.keyboard.down('KeyS');
  await new Promise(r => setTimeout(r, 2600));
  await page.keyboard.up('KeyS');
  await page.screenshot({ path: 'tests/screenshots/water_bridge_river.png' });
  console.log('Saved tests/screenshots/water_bridge_river.png');

  // 2. Zoom in closer to the river water
  await page.mouse.wheel({ deltaY: -500 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'tests/screenshots/water_river_zoom.png' });
  console.log('Saved tests/screenshots/water_river_zoom.png');

  // 3. Zoom back out
  await page.mouse.wheel({ deltaY: 500 });
  await new Promise(r => setTimeout(r, 600));

  // 4. Walk eastward to Azure Lake and onto the Fishing Pier
  await page.keyboard.down('KeyS');
  await new Promise(r => setTimeout(r, 1200));
  await page.keyboard.up('KeyS');

  await page.keyboard.down('KeyD');
  await new Promise(r => setTimeout(r, 2800));
  await page.keyboard.up('KeyD');

  await page.keyboard.down('KeyW');
  await new Promise(r => setTimeout(r, 700));
  await page.keyboard.up('KeyW');

  await page.screenshot({ path: 'tests/screenshots/water_lake_pier.png' });
  console.log('Saved tests/screenshots/water_lake_pier.png');

  // 5. Zoom into the lake ripples and rowboat
  await page.mouse.wheel({ deltaY: -600 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'tests/screenshots/water_lake_zoom.png' });
  console.log('Saved tests/screenshots/water_lake_zoom.png');

  // 6. Test FPS across 100 frames
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

  console.log('Performance test:', perf);
  console.log('Console/WebGL errors:', errors.length, errors);

  await browser.close();
}

testWaterDetailed().catch(err => {
  console.error(err);
  process.exit(1);
});
