# Image diffing for PrestaShop

## How to install your environment

```bash
git clone https://github.com/SimonGrn/imagediff.git
npm i
```

## How it works
You first need to make a *golden pass* by launching the script with the `pass=golden` parameter (see below).

These will be your references screenshots. You can always remake them when you need it by relaunching the script.

After that you just need to launch the script, it will crawl every URL, take a screenshot and compare it with 
your golden ones. Since this script uses `mocha` you'll get a resume of what went wrong (if any) as a test result 
for every URL. You'll also get every diff image in the `date/diff` folder, if there was more difference than the threshold. 

## URLs
The `urls.js` file contains the list of URL to crawl and capture. You can edit it at your convenience.

The structure is pretty clear, the `customMethod` lets you inject code before taking a screenshot to remove
some elements for example.

## Threshold
By default, the script raises an error if there is more than 50 pixels of difference. You can change that by adding the 
`threshold` parameter, and putting an integer value (ex : `threshold=0` if you don't want any difference in your 
screenshots) that will be interpreted as an absolute value (i.e. number of pixels difference).