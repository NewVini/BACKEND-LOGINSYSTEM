const puppeteer = require('puppeteer')
const util = require('../utils/utils')
const fs = require('fs')

module.exports = {
  async sendMessage(req, res) {
    try {
      const browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage()

      const { phones } = req.body

      for (const phone of phones) {

        await page.goto(`https://web.whatsapp.com/send?phone=${phone}&text=${req.body.message}`);

        const frame = page.mainFrame()

        const btnSend = await frame.waitForSelector('._2Ujuu')
        await btnSend.click()
        await util.sleep(2000)
      }

      res.send('ok')
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
      const WAToken1 = localStorage.getItem('WAToken1')
      const WAToken2 = localStorage.getItem('WAToken2')
      const WABrowserId = localStorage.getItem('WABrowserId')
      const WASecretBundle = localStorage.getItem('WASecretBundle')

      return {
        WAToken1,
        WAToken2,
        WABrowserId,
        WASecretBundle
      }
    })

    console.log(typeof JSON.stringify(tokens))
    fs.writeFileSync('./../auth.json', JSON.stringify(tokens))
  }
}