module.exports = (app) => {
  return {
    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
