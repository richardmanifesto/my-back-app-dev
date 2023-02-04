const fs               = require("fs")
const { createServer } = require('https')
const { parse }        = require('url')
const next             = require('next')
const dev              = process.env.NODE_ENV !== 'production'
const hostname         = 'localhost'
const port             = 3000

const httpsOptions = {
  key : fs.readFileSync("./certs/RootCA.key"),
  cert: fs.readFileSync("./certs/RootCA.crt")
}

// when using middleware `hostname` and `port` must be provided below
const app    = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)

    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})