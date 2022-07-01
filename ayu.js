const { createCursor } = require('ghost-cursor-playwright')
const cluster = require('cluster')
const axios = require('axios')
const crypto = require('crypto')
const colors = require('colors')
const { firefox } = require('playwright')
const prompt = require('prompt-sync')({ sigint: true })
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });  
fs = require('fs');

var intro = 
`

░██████╗░███████╗███╗░░██╗  ██╗░░░██╗██████╗░
██╔════╝░██╔════╝████╗░██║  ██║░░░██║╚════██╗
██║░░██╗░█████╗░░██╔██╗██║  ╚██╗░██╔╝░░███╔═╝
██║░░╚██╗██╔══╝░░██║╚████║  ░╚████╔╝░██╔══╝░░
╚██████╔╝███████╗██║░╚███║  ░░╚██╔╝░░███████╗
░╚═════╝░╚══════╝╚═╝░░╚══╝  ░░░╚═╝░░░╚══════╝ 
                                                
`

var generated = 0
var failed = 0

var accounts = fs.createWriteStream('accounts.txt', {
    flags: 'a'
  })

function get_title() {
    return `Ayu | Generated: ${generated} | Failed: ${failed}`
}

;(async () => {
    if(cluster.isMaster) {
        process.title = get_title()
        console.clear()
        console.log(intro.brightBlue)
        console.log('\n\n                                                      ~ '.brightBlue + 'discord.gg/ro-mart'.brightRed + '\n')
        var threads = parseInt(prompt('                                                      ~ '.brightBlue + '> Threads -> '.brightRed))
        console.clear()
        console.log(intro.brightGreen)
        console.log('\n')
        for (var i = 0; i < threads; i++) {
            cluster.fork()
        }
    } else {
        await generate()
    }

})()

async function generate() {
    const browser = await firefox.launch({ headless: false })
    var page1 = await browser.newPage()
    const cursor = await createCursor(page1)

    var username = crypto.randomBytes(2).toString('hex') + 'Ayuskid'
    var password = '@Ayuiscute2000@'
    var email = crypto.randomBytes(4).toString('hex') + '@gmail.com'

    await page1.goto('https://www.twitch.tv/de');
    await page1.click('button:has-text("Sign Up")');
    await page1.fill('[aria-label="Create a username"]', username);
    console.log('                                                      ~ '.brightBlue + 'Username > ' + username)
    await page1.fill('[aria-label="Create a secure password"]', password);
    await page1.fill('[aria-label="Confirm your password"]', password);
    console.log('                                                      ~ '.brightBlue + 'Password > ' + password)
    await page1.selectOption('[aria-label="Select your birthday month"]', '1');
    await page1.fill('[placeholder="Day"]', '1');
    await page1.fill('[placeholder="Year"]', '1990');
    console.log('                                                      ~ '.brightBlue + 'Birthday Set > ' + '1.1.1990')
    await page1.click('button:has-text("Use email instead")');
    await page1.fill('[aria-label="Enter your email address"]', email);  
    await page1.click('form button:has-text("Sign Up")');
    await page1.click('button:has-text("Remind me later")');
    console.log('                                                      ~ '.brightBlue + 'Captcha Solved!')   
    await page1.click('button:has-text("Skip")');
    console.log('                                                      ~ '.brightBlue + 'Created > ' + email + ':' + password + ':' + username)
    accounts.write(email + ':' + password + ':' + username + '\n')
    generated++
    process.title = get_title()
    await browser.close()
    await generate()
}
