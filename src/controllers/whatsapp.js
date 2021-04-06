'use strict'

const puppeteer = require('puppeteer')
const { v4: uuid } = require('uuid')

const { WhatsappTokens } = require('./../models')
const csv = require('./../utils/csv')

module.exports = {
  async sendMessage(req, res) {
    const { message, phones } = req.body
    const tokens = await WhatsappTokens.findOne({
      where: {
        user_id: req.headers.user.id
      }
    })
    try {
      const browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage()
      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      await page.goto('https://web.whatsapp.com')
      await page.evaluate((tokens) => {
        localStorage.clear();
        localStorage.setItem('WAToken1', JSON.stringify(tokens.wa_token1))
        localStorage.setItem('WAToken2', JSON.stringify(tokens.wa_token2))
        localStorage.setItem('WABrowserId', JSON.stringify(tokens.wa_browser_id))
        localStorage.setItem('WASecretBundle', JSON.stringify({
          key: tokens.key,
          encKey: tokens.enc_key,
          macKey: tokens.mac_key
        }))
      }, tokens)

      const counter = {
        sucess: [],
        fails: []
      }

      for (const phone of phones) {
        try {
          console.log(message)
          await page.goto(`https://web.whatsapp.com/send?phone=${phone}&text=${message}`);
          await page.waitForSelector("div#startup", { hidden: true, timeout: 60000 });
          const btnSend = await page.waitForSelector('._1E0Oz', { timeout: 5000 })
          await btnSend.click()
          await page.waitForTimeout(1350)
          counter.sucess.push(phone)
        } catch (error) {
          counter.fails.push(phone)
          console.log(error)
        }
      }

      await browser.close()
      return res.json(counter)
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
      const number = JSON.parse(localStorage.getItem('last-wid'))
      const WAToken1 = JSON.parse(localStorage.getItem('WAToken1'))
      const WAToken2 = JSON.parse(localStorage.getItem('WAToken2'))
      const WABrowserId = JSON.parse(localStorage.getItem('WABrowserId'))
      const WASecretBundle = JSON.parse(localStorage.getItem('WASecretBundle'))

      return {
        number,
        WAToken1,
        WAToken2,
        WABrowserId,
        WASecretBundle,
      }
    })

    await browser.close()

    await WhatsappTokens.create({
      id: uuid(),
      number: tokens.number,
      wa_token1: tokens.WAToken1,
      wa_token2: tokens.WAToken2,
      wa_browser_id: tokens.WABrowserId,
      key: tokens.WASecretBundle.key,
      enc_key: tokens.WASecretBundle.encKey,
      mac_key: tokens.WASecretBundle.macKey,
      user_id: req.headers.user.id,
    })

    return
  },

  async csvMessages(req, res) {
    const csvNumbers = await csv.parse(req.body.spreadsheet, req.body.separator)

    req.body.numbers = csvNumbers
    for (const number of csvNumbers) {
      this.sendMessage()
    }
  }
}