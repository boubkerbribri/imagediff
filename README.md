# Image diffing for PrestaShop

## How to install your environment
Clone the repository in your local environment :
```bash
git clone https://github.com/SimonGrn/imagediff.git
npm i
```

You **MUST** disable the token security in the BO before launching the script, or it will fail !
Add this in your `.htaccess` file:
```bash
SetEnv _TOKEN_ disabled
```

## How it works
You first need to make a *golden pass* by launching the script with the `RUN=golden` parameter (see below).

These will be your reference screenshots. You can always remake them when you need it by relaunching the script.

After that you just need to launch the script without the `RUN=golden` parameter, it will crawl every URL, take a screenshot and compare it with 
your golden ones. Since this script uses `mocha` you'll get a resume of what went wrong (if any) as a test result 
for every URL. You'll also get every diff image in the `date/diff` folder, if there was more difference than the threshold.

The script also generates a JSON file with every information you might need (date, threshold, every URL and its result).

Everything is accessible in a folder named after the current date (ex : `imagediff/2019-09-30`). 

## URLs
The `urls.js` file contains the list of URL to crawl and capture. You can edit it at your convenience.

The structure is pretty clear, the `customMethod` lets you inject code before taking a screenshot (to remove
some random elements for example).

## Threshold
By default, the script raises an error if there is more than 0 pixels of difference. You can change that by adding the 
`THRESHOLD` parameter, and putting an integer value, ex : `THRESHOLD=50`.

### Available command line parameters

| Parameter           | Values          | Description      |
|---------------------|-----------------|-----------------|
| URL_FO              | String          | URL of your PrestaShop website Front Office (default to `http://localhost/prestashop`) |
| URL_BO              | String          | URL of your PrestaShop website Back Office (default to `${URL_FO}/admin-dev`) |
| LOGIN               | String          | LOGIN of your PrestaShop admin (default to `demo@prestashop.com`) |
| PASSWD              | String          | PASSWD of your PrestaShop admin (default to `prestashop_demo`) |
| CLIENT_LOGIN        | String          | Client LOGIN of your PrestaShop Front-Office (default to `pub@prestashop.com`) |
| CLIENT_PASSWD       | String          | Client PASSWD of your PrestaShop Front-Office (default to `123456789`) |
| THRESHOLD           | Integer >= 0    | Max number of pixels difference (default to `0`) |
| HEADLESS            | true/false      | Launch Chrome in headless mode (default to `true`) |
| RUN                 | 'golden' / empty| Enforce this to `golden` to create golden screenshots (default to `run`) |
