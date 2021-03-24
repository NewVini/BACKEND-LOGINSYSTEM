'use strict'

const fs = require('fs')
const tokens = require('../../auth.json')
const puppeteer = require('puppeteer')
module.exports = {
  async sendMessage(req, res) {
    try {
      const browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage()
      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      await page.goto('https://web.whatsapp.com')
      await page.evaluate((tokens) => {
        localStorage.clear();
        localStorage.setItem('WAToken1', JSON.stringify(tokens.WAToken1))
        localStorage.setItem('WAToken2', JSON.stringify(tokens.WAToken2))
        localStorage.setItem('WABrowserId', JSON.stringify(tokens.WABrowserId))
        localStorage.setItem('WASecretBundle', JSON.stringify({
          key: tokens.WASecretBundle.key,
          encKey: tokens.WASecretBundle.encKey,
          macKey: tokens.WASecretBundle.macKey
        }))
      }, tokens)

      const { phones } = req.body

      const counter = {
        sucess: [],
        fails: []
      }

      for (const phone of phones) {
        try {
          await page.goto(`https://web.whatsapp.com/send?phone=${phone}&text=${req.body.message}`);
          await page.waitForSelector("div#startup", { hidden: true, timeout: 60000 });
          const btnSend = await page.waitForSelector('._1E0Oz')
          await btnSend.click()
          await page.waitForTimeout(500)
          counter.sucess.push(phone)
        } catch (error) {
          counter.fails.push(phone)
          console.log(error)
        }
      }

      res.send(counter)
      await browser.close()
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  },

  async connect(req, res) {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://web.whatsapp.com')
    await page.waitForSelector('div[data-ref]', { timeout: 60000 });
    const qrcodeData = await page.evaluate(() => {
      let qrcodeDiv = document.querySelector("div[data-ref]");
      return qrcodeDiv.getAttribute("data-ref");
    });

    res.send(qrcodeData)

    await page.waitForSelector('.two')
    const tokens = await page.evaluate(() => {
      const WAToken1 = JSON.parse(localStorage.getItem('WAToken1'))
      const WAToken2 = JSON.parse(localStorage.getItem('WAToken2'))
      const WABrowserId = JSON.parse(localStorage.getItem('WABrowserId'))
      const WASecretBundle = JSON.parse(localStorage.getItem('WASecretBundle'))

      return {
        WAToken1,
        WAToken2,
        WABrowserId,
        WASecretBundle
      }
    })

    fs.writeFileSync('auth.json', JSON.stringify(tokens))
  }
}