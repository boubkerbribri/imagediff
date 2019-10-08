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

const loginInfos = {
    user : {
        login: process.env.CLIENT_LOGIN || 'pub@prestashop.com',
        password : process.env.CLIENT_PASSWD || '123456789'
    },
    admin: {
        login: process.env.LOGIN || 'demo@prestashop.com',
        password : process.env.PASSWD || 'prestashop_demo',
    }
}
const THRESHOLD = parseInt(process.env.THRESHOLD) || 0;
const HEADLESS = process.env.HEADLESS || true;

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

let currentAction = (CURRENTRUN === 'golden') ? 'Crawl URLS and make golden reference screenshots' : 'Crawl URLs and compare screenshots with golden reference';

describe(currentAction, async () => {
    before(async function() {
        browser = await puppeteer.launch({
            headless: JSON.parse(HEADLESS),
            timeout: 0,
            slowMo: 5,
            args: ['--start-maximized', '--no-sandbox', '--lang=en-GB'],
            defaultViewport: {
                width: 1680,
                height: 900,
            },
        });

        page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'fr-FR',
        });
    });

    after(async () => {
        await browser.close();
        // Create report file
        if (CURRENTRUN !== 'golden') {
            fs.writeFile(`${fullReportPath}/report.json`, JSON.stringify(output), (err) => {
                if (err) {
                    return console.error(err);
                }
                return console.log(`File ${fullReportPath}/report.json saved!`);
            });
        }
    });

    urlsList.forEach(function(section) {
        describe(section.name + ' - ' + section.description, async function() {
            //crawl every page
            pagesToCrawl = section.urls;
            let count = 1;
            pagesToCrawl.forEach(function (pageToCrawl) {
                pageToCrawl.urlPrefix = section.urlPrefix.replace('URL_BO', URL_BO).replace('URL_FO', URL_FO);
                pageToCrawl.sectionName = section.name;
                pageToCrawl.sectionDescription = section.description;
                it(`Crawling ${pageToCrawl.name} (${count}/${pagesToCrawl.length})`, async function () {
                    await Promise.all([
                        page.goto(`${pageToCrawl.urlPrefix}${pageToCrawl.url}`),
                        page.waitForNavigation({waitUntil: 'networkidle0'})
                    ]);
                    await page.waitFor(500);
                    await page.evaluate(async () => {
                        const block = await document.querySelector('#ajax_running');
                        if (block) block.remove();
                    });
                    //await page.waitForSelector('#ajax_running[style="display: none;"]');
                    if (typeof(pageToCrawl.customAction) !== 'undefined') {
                        await pageToCrawl.customAction({page, loginInfos});
                    }
                    await takeAndCompareScreenshot(pageToCrawl, page);
                });
                count += 1;
            });
        });
    });
});

/**
 * Take a screenshot of a page and ask for comparison if it's the second run
 * @param currentPage
 * @param page
 * @returns {Promise<unknown>}
 */
async function takeAndCompareScreenshot(currentPage, page) {
    let path = (CURRENTRUN === 'golden' ? goldenReportPath : runReportPath);
    await page.screenshot({path: `${path}/${currentPage.name}.png`, fullPage: true });

    if (CURRENTRUN !== 'golden') {
        return await compareScreenshots(currentPage);
    }
}

/**
 * Compare 2 screenshots and expect them to be less than XX pixels difference
 * @param fileName
 * @param office
 * @returns {Promise<unknown>}
 */
async function compareScreenshots(currentPage) {
    return new Promise((resolve, reject) => {
        const goldImgPath = `${goldenReportPath}/${currentPage.name}.png`;
        const runImgPath = `${runReportPath}/${currentPage.name}.png`;
        const diffImgPath = `${resultReportPath}/${currentPage.name}.png`;

        let outputEntry = {
            name : currentPage.name,
            url : currentPage.urlPrefix+currentPage.url,
            status : 'error',
            goldenPath : goldImgPath,
            runPath : runImgPath
        };
        //check if entry for this section has been made
        if (typeof(output[currentPage.sectionName]) === 'undefined') {
            output[currentPage.sectionName] = {
                section: currentPage.sectionName,
                description: currentPage.sectionDescription,
                results : []
            };
        }
        let goldenExists = false;
        let fileExists = false;
        //check if golden image exists
        try {
            if (fs.existsSync(goldImgPath)) {
                goldenExists = true;
            }
        } catch(err) {}
        //check if current run image exists (should be...)
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
            output[currentPage.sectionName]['results'].push(outputEntry);
            return;
        }
        if (!goldenExists) {
            outputEntry.status = 'golden file not found';
            output[currentPage.sectionName]['results'].push(outputEntry);
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

                if (goldenImg.width !== runImg.width) {
                    outputEntry.status = 'different_widths';
                }
                if (goldenImg.height !== runImg.height) {
                    outputEntry.status = 'different_heights';
                }

                // Do the visual diff.
                const diff = new PNG({width: goldenImg.width, height: goldenImg.height});
                const numDiffPixels = pixelmatch(
                    goldenImg.data, runImg.data, diff.data, goldenImg.width, goldenImg.height,
                    {threshold: 0.1});

                outputEntry.diff = numDiffPixels;

                if (parseInt(numDiffPixels) > THRESHOLD) {
                    outputEntry.status = 'fail';
                    outputEntry.diffPath = diffImgPath;
                    fs.writeFileSync(diffImgPath, PNG.sync.write(diff));
                } else {
                    outputEntry.status = 'success';
                }
                output[currentPage.sectionName]['results'].push(outputEntry);
                expect(numDiffPixels, `Expected pixel difference (${numDiffPixels}) to be at most ${THRESHOLD}`).to.be.at.most(THRESHOLD);
                resolve();
            } catch (error) {
                reject(error);
            }
        }
    });
}
