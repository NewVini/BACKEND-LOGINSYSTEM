const puppeteer = require('puppeteer')

module.exports = (app) => {
  return {
    async sendMessage(req, res) {
      try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(`https://web.whatsapp.com/send?phone=${req.body.phone}&text=${req.body.message}`);

        const frame = page.mainFrame()

        const btnSend = await frame.waitForSelector('._2Ujuu')
        await btnSend.click()

        await app.utils.utils.sleep(500)
        await browser.close();

        res.send('ok')
      } catch (error) {
        console.log(error)
        res.status(500).json(error)
      }
    }
  }
}