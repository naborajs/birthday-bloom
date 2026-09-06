import { spawn } from 'child_process';
import http from 'http';
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.resolve(__dirname, '../docs/screenshots');

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode === 200) resolve(true);
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on('error', reject);
        req.setTimeout(1000, () => req.destroy());
      });
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 400));
    }
  }
  throw new Error(`Timeout waiting for server at ${url}`);
}

async function scrollToSection(page, sectionIndex, block = 'center') {
  await page.evaluate(({ idx, b }) => {
    const list = Array.from(document.querySelectorAll('header, section, footer')).filter(el => el.getBoundingClientRect().height > 50);
    if (list[idx]) {
      list[idx].scrollIntoView({ behavior: 'instant', block: b });
    }
  }, { idx: sectionIndex, b: block });
  await page.waitForTimeout(1200);
}

async function run() {
  console.log('=== Starting Ultra-Precise Birthday Bloom Screenshot Suite ===');
  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? 'npx.cmd' : 'npx';
  const server = spawn(cmd, ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore',
    shell: true
  });

  try {
    await waitForServer(BASE_URL);
    console.log('✓ Vite preview server is up at ' + BASE_URL);

    const browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const contextDesktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2
    });

    // 1. Splash Screen
    console.log('1/23: 01-splash-screen.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=splash`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '01-splash-screen.png') });
      await page.close();
    }

    // 2. Password Unlock Screen
    console.log('2/23: 02-password-unlock.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=unlock&password=0714&hint=Birthday%20Date%20(0714)`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      // Ensure the unlock card is fully centered
      await page.screenshot({ path: path.join(OUTPUT_DIR, '02-password-unlock.png') });
      await page.close();
    }

    // 3. Cinematic Intro
    console.log('3/23: 03-cinematic-intro.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=intro`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '03-cinematic-intro.png') });
      await page.close();
    }

    // 4. Hero Celebration
    console.log('4/23: 04-hero-celebration.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '04-hero-celebration.png') });
      await page.close();
    }

    // 5. Photo Gallery (Section index 1)
    console.log('5/23: 05-photo-gallery.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      const photoSection = page.locator('section').filter({ hasText: 'MEMORIES' }).first();
      await photoSection.evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '05-photo-gallery.png') });
      await page.close();
    }

    // 6. Balloon Pop Game (Section index 2)
    console.log('6/23: 06-balloon-pop-game.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await scrollToSection(page, 2, 'center');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '06-balloon-pop-game.png') });
      await page.close();
    }

    // 7. Cake Cutting - Flavor Picker (Section index 3)
    console.log('7/23: 07-cake-cutting.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await scrollToSection(page, 3, 'center');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '07-cake-cutting.png') });

      // 8. Cake Cutting - 3D Cake with Candle & Blow interaction
      console.log('8/23: 08-cake-cutting-sliced.png');
      const startCutBtn = await page.$('button:has-text("Start Cutting")');
      if (startCutBtn) {
        await startCutBtn.click();
        await page.waitForTimeout(3800);
        await page.screenshot({ path: path.join(OUTPUT_DIR, '08-cake-cutting-sliced.png') });
      }
      await page.close();
    }

    // 9. Envelope Letter Scene - Closed (Section index 4)
    console.log('9/23: 09-envelope-letter-closed.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await scrollToSection(page, 4, 'center');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '09-envelope-letter-closed.png') });

      // 10. Envelope Letter Opened
      console.log('10/23: 10-envelope-letter-opened.png');
      const envSection = page.locator('section').filter({ hasText: 'Meanwhile the surprise' });
      await envSection.locator('.cursor-pointer').first().click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '10-envelope-letter-opened.png') });
      await page.close();
    }

    // 11. Birthday Quiz (Section index 5)
    console.log('11/23: 11-birthday-quiz.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await scrollToSection(page, 5, 'center');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '11-birthday-quiz.png') });
      await page.close();
    }

    // 12. Wishes Deck (Section index 6)
    console.log('12/23: 12-wishes-deck.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await scrollToSection(page, 6, 'center');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '12-wishes-deck.png') });
      await page.close();
    }

    // 13. Mystery Gift Box (Section index 7)
    console.log('13/23: 13-mystery-gift-box.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await scrollToSection(page, 7, 'center');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '13-mystery-gift-box.png') });

      // 14. Mystery Gift Modal (Opened)
      console.log('14/23: 14-mystery-gift-modal.png');
      const giftBtn = page.locator('button').filter({ hasText: 'Hidden Gift Code' }).first();
      await giftBtn.click();
      // Wait for party teaser (2000ms) + reveal animation
      await page.waitForTimeout(3800);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '14-mystery-gift-modal.png') });
      await page.close();
    }

    // 15. Celebration Action Buttons (Section index 8)
    console.log('15/23: 15-celebration-buttons.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await scrollToSection(page, 8, 'center');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '15-celebration-buttons.png') });
      await page.close();
    }

    // 16. Video Gallery (Section index 9)
    console.log('16/23: 16-video-gallery.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      await scrollToSection(page, 9, 'center');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '16-video-gallery.png') });
      await page.close();
    }

    // 17. Share Modal
    console.log('17/23: 17-share-modal.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      // Click the Share! button in celebration actions
      const shareBtn = page.locator('button').filter({ hasText: 'Share!' }).first();
      await shareBtn.scrollIntoViewIfNeeded();
      await shareBtn.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '17-share-modal.png') });
      await page.close();
    }

    // 18. Bengali Language Preset
    console.log('18/23: 18-bengali-preset.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main&lang=bn&name=%E0%A6%B8%E0%A7%8C%E0%A6%B0%E0%A6%AD&age=25&rel=friend`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(OUTPUT_DIR, '18-bengali-preset.png') });
      await page.close();
    }

    // 19. Hindi Language Preset
    console.log('19/23: 19-hindi-preset.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main&lang=hi&name=%E0%A4%B0%E0%A4%BE%E0%A4%B9%E0%A5%81%E0%A4%B2&age=24&rel=partner`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(OUTPUT_DIR, '19-hindi-preset.png') });
      await page.close();
    }

    // 20. French Language Preset
    console.log('20/23: 20-french-preset.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/?phase=main&lang=fr&name=Camille&age=21&rel=partner`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(OUTPUT_DIR, '20-french-preset.png') });
      await page.close();
    }

    // Mobile Viewports (21 & 22)
    console.log('21/23 & 22/23: Mobile Viewports');
    const contextMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true
    });
    {
      const page = await contextMobile.newPage();
      await page.goto(`${BASE_URL}/?phase=main`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(OUTPUT_DIR, '21-mobile-hero.png') });

      await scrollToSection(page, 3, 'center');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '22-mobile-cake-cutting.png') });
      await page.close();
    }

    // 23. Custom 404 Page
    console.log('23/23: 23-not-found-404.png');
    {
      const page = await contextDesktop.newPage();
      await page.goto(`${BASE_URL}/nonexistent-page-demo`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, '23-not-found-404.png') });
      await page.close();
    }

    await browser.close();
    console.log('=== SUCCESS: All 23 high-resolution screenshots generated! ===');
  } finally {
    console.log('Shutting down preview server...');
    if (isWindows) {
      spawn('taskkill', ['/pid', String(server.pid), '/f', '/t']);
    } else {
      server.kill('SIGTERM');
    }
  }
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
