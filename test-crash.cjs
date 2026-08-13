const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Capture page errors
    page.on('pageerror', err => {
        console.log('PAGE ERROR:', err.toString());
        console.log('STACK:', err.stack);
    });
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('CONSOLE ERROR:', msg.text());
        }
    });

    console.log("Navigating...");
    await page.goto('http://localhost:5001', { waitUntil: 'networkidle2' });
    
    console.log("Clicking 'Tap anywhere to begin'...");
    // The splash screen says "Tap anywhere to begin" or similar.
    await page.click('body');
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Skipping intro...");
    // Find the skip button
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const skip = buttons.find(b => b.textContent.toLowerCase().includes('skip'));
        if (skip) skip.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Clicking cake...");
    // Find the chocolate dream cake
    await page.evaluate(() => {
        const cake = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CHOCOLATE DREAM'));
        if (cake) cake.click();
        else console.log("Cake button not found!");
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if error boundary rendered
    const errorText = await page.evaluate(() => {
        const el = document.querySelector('.bg-black\\/50.text-red-400');
        return el ? el.innerText : 'No error boundary text found on screen.';
    });
    console.log('SCREEN TEXT:', errorText);
    
    await browser.close();
    console.log("Done.");
})();
