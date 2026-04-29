const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  try {
    // 1. Home page
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'public/docs/home.png' });
    console.log('Took home.png');

    // 2. Local Setup page
    const localBtn = await page.getByText('Local Multiplayer');
    if (localBtn) {
        await localBtn.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'public/docs/local_setup.png' });
        console.log('Took local_setup.png');
        
        // 3. Main Game / Draft Screen
        const startDraftBtn = await page.getByText('Start Draft');
        if (startDraftBtn) {
           await startDraftBtn.click();
           await page.waitForTimeout(2000);
           await page.screenshot({ path: 'public/docs/draft_screen.png' });
           console.log('Took draft_screen.png');
        }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
