// https://github.com/shelljs/shelljs
require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var path = require('path')
var chalk = require('chalk')
var shell = require('shelljs')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
shell.rm('-rf', assetsPath)
shell.mkdir('-p', assetsPath)
shell.config.silent = true
shell.cp('-R', 'static/*', assetsPath)
shell.config.silent = false

var express = require('express')
var app = express()
var appData = require('../data.json')
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings
var apiRoutes = express.Router()
apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  });
})
apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})
apiRoutes.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
})
app.use('/api', apiRoutes)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
})
