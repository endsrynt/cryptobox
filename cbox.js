const puppeteer = require('puppeteer');
const chalk = require('chalk');
const moment = require('moment');
const readline = require("readline-sync");
const fs = require('fs-extra');
const delay = require('delay');
const { exit } = require('process');


(async () => {
    var listaddress = readline.question(chalk.yellow('[?] List Address (ex: link): '))
    console.log('\n');
    var reff = readline.question(chalk.yellow('[?] Refferal Code (ex: link): '))
    console.log('\n');
    const read = fs.readFileSync(listaddress, 'UTF-8');
    const list = read.split(/\r?\n/);
    for (var i = 0; i < list.length; i++) {
        var address = list[i];


    console.log(chalk.yellow(`[${(moment().format('HH:mm:ss'))}] Account => ${i}`))       
    console.log(chalk.yellow(`[${(moment().format('HH:mm:ss'))}] Token => ${address}`))

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        ignoreHTTPSErrors: true
    });

    const optionlink = {
        waitUntil : 'load',
        setTimeout : 6000000,
    };
    const optionbtn = {
        visible:true,
        timeout:60000
    };   
    const page = await browser.newPage();
    console.log(chalk.yellow(`[${(moment().format('HH:mm:ss'))}] Wait for reffering`))

    await page.goto(`https://cryptobox.game/${reff}`,optionlink);
    await delay(2000)
    await page.click("#home > div > div > div > div.content-col.col-12.text-center > div.hero-btns.position-static.btns-action.anim-3.mt-4 > a > span",optionbtn)
    
    await delay(2000)
    await page.waitForSelector("#airdrop-form > div.input-group.mb-3 > input")
    await page.click("#airdrop-form > div.input-group.mb-3 > input",optionbtn)
    await page.type("#airdrop-form > div.input-group.mb-3 > input",address)
    await delay(500)
    await page.click("#airdrop-form > div.input-group.justify-content-center > button")

    await page.waitForSelector('#airdrop-block > div > div.row.mt-4.text-center.justify-content-between > div:nth-child(1) > div.heading-h5 > span');
    const balance = await page.$eval('#airdrop-block > div > div.row.mt-4.text-center.justify-content-between > div:nth-child(1) > div.heading-h5 > span',(el) => el.innerText);

    if (balance == "10"){
        console.log(chalk.green(`[${(moment().format('HH:mm:ss'))}] Reffering Success => ${balance} CBOX`))
        await browser.close()
        var files = fs.readFileSync(`./${listaddress}`, 'utf-8');
        var lines = files.split('\n')
        lines.splice(0,1)
        await fs.writeFileSync(`${listaddress}`, lines.join('\n'))
    }else{
        console.log(chalk.red(`[${(moment().format('HH:mm:ss'))}] Reffering Failed`))
        await browser.close()
    }
    if(i == 2 ){
        exit;
    }
} 
})();