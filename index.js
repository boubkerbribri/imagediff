const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const reportPath = 'imagediff';
const reportPathDate = (new Date().toISOString().slice(0, 10));
const fullReportPath = `${reportPath}/${reportPathDate}`;
const firstReportPath = `${reportPath}/golden`;
const secondReportPath = `${reportPath}/${reportPathDate}/pass`;
const resultReportPath = `${reportPath}/${reportPathDate}/diff`;
const urlsList = require('./urls.js');

const currentPass = process.env.PASS || 'second';
const URL_FO = process.env.URL_FO || 'http://localhost/prestashop/';
const URL_BO = process.env.URL_BO || `${URL_FO}admin-dev/`;


let page = null;

/**
 * Create the different folders to store all the images
 * @returns {Promise<void>}
 */
const createFolders = async () => {
    if (!fs.existsSync(reportPath)) {
        await fs.mkdirSync(reportPath);
    }
    if (!fs.existsSync(fullReportPath)) {
        await fs.mkdirSync(fullReportPath);
        if (!fs.existsSync(firstReportPath)) await fs.mkdirSync(firstReportPath);
        if (!fs.existsSync(secondReportPath)) await fs.mkdirSync(secondReportPath);
        if (!fs.existsSync(resultReportPath)) await fs.mkdirSync(resultReportPath);
    }
};

createFolders();

describe('Main scenario', async () => {
    before(async function() {
        browser = await puppeteer.launch({
            headless: false,
            timeout: 0,
            slowMo: 5,
            args: ['--start-maximized', '--no-sandbox', '--lang=fr-FR'],
            defaultViewport: {
                width: 1680,
                height: 900,
            },
        });
        page = await browser.newPage();
        //await interceptRequestAndResponse(page);
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US',
        });

        await Promise.all([
            page.goto(URL_BO),
            page.waitForNavigation({waitUntil: 'networkidle0'})
        ]);
        await page.type('#email', 'demo@prestashop.com');
        await page.type('#passwd', 'prestashop_demo');
        await page.click('#submit_login');
        await page.waitForNavigation({waitUntil: 'networkidle0'});

        if (await isElementVisible(page, 'button.onboarding-button-shut-down')) {
            //close the welcome modal
            await page.click('button.onboarding-button-shut-down');
            await page.waitForSelector('a.onboarding-button-stop', {visible: true});
            await page.click('a.onboarding-button-stop');
        }
    });

    describe('Crawl BO pages', async function() {
        BOPages = urlsList.BO;
        BOPages.forEach(function(BOPage) {
            it(`BO_${BOPage.name}`, async function () {
                await Promise.all([
                    page.goto(URL_BO+BOPage.url),
                    page.waitForNavigation({waitUntil: 'networkidle0'})
                ]);
                if (typeof(BOPage.customMethod) !== 'undefined') {
                    await BOPage.customMethod({page});
                }
                await takeAndCompareScreenshot(page, this.test.title);
            });
        });

    });


    await after(async () => {
        await browser.close();
    });
});

/**
 * Intercepts all requests to block gamification stuff and addons ads
 * @param page
 * @returns {Promise<void>}
 */
const interceptRequestAndResponse = async (page) => {
    await page.setRequestInterception(true);
    await page.on('request', (request) => {
        const url = request.url();
        const filters = [
            'gamification.prestashop',
        ];
        const shouldAbort = filters.some((urlPart) => url.includes(urlPart));
        if (shouldAbort) {
            request.abort();
        } else request.continue();
    });
};

/**
 * Take a screenshot of a page and ask for comparison if it's the second pass
 * @param page
 * @param fileName
 * @returns {Promise<unknown>}
 */
async function takeAndCompareScreenshot(page, fileName) {
    let path = (currentPass === 'first' ? firstReportPath : secondReportPath);
    await page.screenshot({path: `${path}/${fileName}.png`});

    if (currentPass !== 'first') {
        return await compareScreenshots(fileName);
    }
}

/**
 * Compare 2 screenshots and expect them to be less than 1% difference
 * @param fileName
 * @returns {Promise<unknown>}
 */
async function compareScreenshots(fileName) {
    return new Promise((resolve, reject) => {
        const img1 = fs.createReadStream(`${firstReportPath}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
        const img2 = fs.createReadStream(`${secondReportPath}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);

        let filesRead = 0;
        function doneReading() {
            // Wait until both files are read.
            if (++filesRead < 2) return;

            // The files should be the same size.
            try {
                expect(img1.width, 'image widths are the same').equal(img2.width);
                expect(img1.height, 'image heights are the same').equal(img2.height);

                // Do the visual diff.
                const diff = new PNG({width: img1.width, height: img2.height});
                const numDiffPixels = pixelmatch(
                    img1.data, img2.data, diff.data, img1.width, img1.height,
                    {threshold: 0.1});

                const percentage = Math.round((numDiffPixels*10000) / (img1.width*img1.height))/100;
                if (percentage > 0.5) {
                    fs.writeFileSync(`${resultReportPath}/diff_${fileName}.png`, PNG.sync.write(diff));
                }
                expect(percentage, 'Expected pixel percentage difference to be 0').equal(0);
                resolve();
            } catch (error) {
                reject(error);
            }
        }
    });
}

/**
 * Check if an element is visible
 * @param page
 * @param selector
 * @param timeout
 * @returns {Promise<boolean>}
 */
async function isElementVisible(page, selector, timeout = 10) {
    try {
        await page.waitForSelector(selector, {visible: true, timeout});
        return true;
    } catch (error) {
        return false;
    }
}
