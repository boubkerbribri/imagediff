const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const reportPath = 'imagediff';
const reportPathDate = (new Date().toISOString().slice(0, 10));
const fullReportPath = `${reportPath}/${reportPathDate}`;
const goldenReportPath = `${reportPath}/golden`;
const runReportPath = `${reportPath}/${reportPathDate}/run`;
const resultReportPath = `${reportPath}/${reportPathDate}/diff`;
const urlsList = require('./urls.js');

const CURRENTRUN = process.env.RUN || 'run';
const URL_FO = process.env.URL_FO || 'http://localhost/prestashop/';
const URL_BO = process.env.URL_BO || `${URL_FO}admin-dev/`;
const LOGIN = process.env.LOGIN || 'demo@prestashop.com';
const PASSWD = process.env.PASSWD || 'prestashop_demo';
const THRESHOLD = process.env.THRESHOLD || 0;

let output = {
    date : reportPathDate,
    threshold : THRESHOLD,
    BO : [],
    FO : []
};
let page = null;

/**
 * Create the different folders to store all the images
 * @returns {Promise<void>}
 */
const createFolders = async () => {
    if (!fs.existsSync(reportPath)) await fs.mkdirSync(reportPath);
    if (CURRENTRUN !== 'golden') {
        if (!fs.existsSync(fullReportPath)) await fs.mkdirSync(fullReportPath);
        if (!fs.existsSync(runReportPath)) await fs.mkdirSync(runReportPath);
        if (!fs.existsSync(resultReportPath)) await fs.mkdirSync(resultReportPath);
    } else {
        if (!fs.existsSync(goldenReportPath)) await fs.mkdirSync(goldenReportPath);
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
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US',
        });

        await Promise.all([
            page.goto(URL_BO),
            page.waitForNavigation({waitUntil: 'networkidle0'})
        ]);
        await page.type('#email', LOGIN);
        await page.type('#passwd', PASSWD);
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
        // Create report file
        fs.writeFile(`${fullReportPath}/report.json`, JSON.stringify(output), (err) => {
            if (err) {
                return console.error(err);
            }
            return console.log(`File ${fullReportPath}/report.json saved!`);
        });
    });

});

/**
 * Take a screenshot of a page and ask for comparison if it's the second run
 * @param page
 * @param fileName
 * @param office
 * @returns {Promise<unknown>}
 */
async function takeAndCompareScreenshot(page, fileName, office = 'BO') {
    let path = (CURRENTRUN === 'golden' ? goldenReportPath : runReportPath);
    await page.screenshot({path: `${path}/${fileName}.png`});

    if (CURRENTRUN !== 'golden') {
        return await compareScreenshots(fileName, office);
    }
}

/**
 * Compare 2 screenshots and expect them to be less than XX pixels difference
 * @param fileName
 * @param office
 * @returns {Promise<unknown>}
 */
async function compareScreenshots(fileName, office) {
    return new Promise((resolve, reject) => {
        const goldImgPath = `${goldenReportPath}/${fileName}.png`;
        const runImgPath = `${runReportPath}/${fileName}.png`;
        const diffImgPath = `${resultReportPath}/${fileName}.png`;

        let outputEntry = {
            name : fileName,
            status : 'error',
            goldenPath : goldImgPath,
            runPath : runImgPath
        };

        let goldenExists = false;
        let fileExists = false;
        //check if golden image exists
        try {
            if (fs.existsSync(goldImgPath)) {
                goldenExists = true;
            }
        } catch(err) {}
        //check if image exists (should be...)
        try {
            if (fs.existsSync(runImgPath)) {
                fileExists = true;
            }
        } catch(err) {}

        //we expect both files to exist, or we just exit
        expect(goldenExists).to.be.true;
        expect(fileExists).to.be.true;
        if (!fileExists) {
            outputEntry.status = 'run file not found';
            output[office].push(outputEntry);
            return;
        }
        if (!goldenExists) {
            outputEntry.status = 'golden file not found';
            output[office].push(outputEntry);
            return;
        }
        const goldenImg = fs.createReadStream(goldImgPath).pipe(new PNG()).on('parsed', doneReading);
        const runImg = fs.createReadStream(runImgPath).pipe(new PNG()).on('parsed', doneReading);

        let filesRead = 0;
        function doneReading() {
            // Wait until both files are read.
            if (++filesRead < 2) return;

            // The files should be the same size.
            try {
                expect(goldenImg.width, 'image widths are the same').equal(runImg.width);
                expect(goldenImg.height, 'image heights are the same').equal(runImg.height);

                // Do the visual diff.
                const diff = new PNG({width: goldenImg.width, height: runImg.height});
                const numDiffPixels = pixelmatch(
                    goldenImg.data, runImg.data, diff.data, goldenImg.width, goldenImg.height,
                    {threshold: 0.1});

                outputEntry.status = 'fail';
                outputEntry.diff = numDiffPixels;

                if (numDiffPixels >= THRESHOLD) {
                    outputEntry.status = 'fail';
                    outputEntry.diffPath = diffImgPath;
                    fs.writeFileSync(diffImgPath, PNG.sync.write(diff));
                } else {
                    outputEntry.status = 'success';
                }
                output[office].push(outputEntry);
                expect(numDiffPixels, `Expected pixel difference (${numDiffPixels}) to be below ${THRESHOLD}`).to.be.at.most(THRESHOLD);
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
