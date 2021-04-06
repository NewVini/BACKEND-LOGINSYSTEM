const csv = require('csv-parser')
const stream = require('stream')

module.exports = {
  async parse(spreadsheet, separator) {
    const bufferStream = new stream.PassThrough()
    spreadsheet = spreadsheet.split(',').reverse()[0]
    spreadsheet = Buffer.from(spreadsheet, 'base64').toString('utf-8')
    if (spreadsheet.charCodeAt(0) === 0xFEFF) {
      spreadsheet = spreadsheet.substr(1)
    }
    bufferStream.end(spreadsheet)
    let rows = await new Promise((resolve, reject) => {
      const results = []
      bufferStream
        .pipe(csv({ separator }))
        .on('data', (data) => results.push(data))
        .on('error', reject)
        .on('end', () => {
          resolve(results)
        })
    })

    rows = rows.filter((row) => Object.keys(row).length !== 0)

    return rows
  }
}