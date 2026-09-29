import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function testWater() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Initial view: spawn looking south toward river
  await page.screenshot({ path: 'tests/screenshots/water_1_spawn.png' });
  console.log('Captured tests/screenshots/water_1_spawn.png');

  // 2. Walk to the Wooden Arched Bridge overlooking Clearwater River
  await page.keyboard.down('KeyS');
  await new Promise(r => setTimeout(r, 2800));
  await page.keyboard.up('KeyS');
  await page.screenshot({ path: 'tests/screenshots/water_2_bridge.png' });
  console.log('Captured tests/screenshots/water_2_bridge.png');

  // 3. Walk along the riverbank westward
  await page.keyboard.down('KeyA');
  await new Promise(r => setTimeout(r, 2500));
  await page.keyboard.up('KeyA');
  await page.screenshot({ path: 'tests/screenshots/water_3_river_west.png' });
  console.log('Captured tests/screenshots/water_3_river_west.png');

  // 4. Walk eastward to the Wooden Fishing Pier over Azure Lake
  await page.keyboard.down('KeyD');
  await new Promise(r => setTimeout(r, 6000));
  await page.keyboard.up('KeyD');
  await page.screenshot({ path: 'tests/screenshots/water_4_fishing_pier.png' });
  console.log('Captured tests/screenshots/water_4_fishing_pier.png');

  // 5. Orbit camera around fishing pier
  await page.evaluate(() => {
    window.__STORES__.gameStore.getState().setCameraAngle(Math.PI / 3);
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'tests/screenshots/water_5_pier_orbit.png' });
  console.log('Captured tests/screenshots/water_5_pier_orbit.png');

  // 6. Measure 60fps frame rate
  const fpsResult = await page.evaluate(async () => {
    return new Promise(resolve => {
      let frameCount = 0;
      let start = performance.now();
      function loop() {
        frameCount++;
        if (performance.now() - start < 1000) {
          requestAnimationFrame(loop);
        } else {
          const elapsed = (performance.now() - start) / 1000;
          resolve({
            fps: Math.round(frameCount / elapsed),
            frames: frameCount,
            elapsed
          });
        }
      }
      requestAnimationFrame(loop);
    });
  });

  console.log('Measured FPS with active water shader:', fpsResult);
  console.log('Console errors encountered:', consoleErrors.length, consoleErrors);

  await browser.close();
}

testWater().catch(err => {
  console.error(err);
  process.exit(1);
});
