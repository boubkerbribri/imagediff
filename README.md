# Image diffing for PrestaShop

## How to install your environment

```bash
git clone https://github.com/SimonGrn/imagediff.git
npm i
```

## How it works
You first need to make a *golden pass* by launching the script with the `RUN=golden` parameter (see below).

These will be your references screenshots. You can always remake them when you need it by relaunching the script.

After that you just need to launch the script, it will crawl every URL, take a screenshot and compare it with 
your golden ones. Since this script uses `mocha` you'll get a resume of what went wrong (if any) as a test result 
for every URL. You'll also get every diff image in the `date/diff` folder, if there was more difference than the threshold. 

## URLs
The `urls.js` file contains the list of URL to crawl and capture. You can edit it at your convenience.

The structure is pretty clear, the `customMethod` lets you inject code before taking a screenshot (to remove
some random elements for example).

## Threshold
By default, the script raises an error if there is more than 0 pixels of difference. You can change that by adding the 
`THRESHOLD` parameter, and putting an integer value, ex : `THRESHOLD=50`.

### Available command line parameters

| Parameter           | Description      |
|---------------------|----------------- |
| URL_FO              | URL of your PrestaShop website Front Office (default to `http://localhost/prestashop`) |
| URL_BO              | URL of your PrestaShop website Back Office (default to `${URL_FO}/admin-dev`) |
| LOGIN               | LOGIN of your PrestaShop website (default to `demo@prestashop.com`) |
| PASSWD              | PASSWD of your PrestaShop website (default to `prestashop_demo`) |
| THRESHOLD           | Max number of pixels difference (default to `0`) |
| RUN                 | Enforce this to `golden` to create golden screenshots (default to `run`) |
