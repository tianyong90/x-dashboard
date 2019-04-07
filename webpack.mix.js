const mix = require('laravel-mix')

const WebpackBar = require('webpackbar')
const yargs = require('yargs')

const argv = yargs.argv

mix.webpackConfig(webpack => {
  let plugins = [
    new WebpackBar(),
  ]

  if (mix.inProduction()) {
    // 生产环境中打包时先清理旧的打包文件
    const CleanWebpackPlugin = require('clean-webpack-plugin')
    plugins.push(new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(__dirname, 'public/js'),
      ],
      // exclude:  ['shared.js'],
      verbose: true,
      dry: false,
    }))
  }

  return {
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: path.resolve(__dirname, 'resources/js'),
          exclude: /(node_modules)/,
          options: {
            formatter: require('eslint-friendly-formatter'),
            emitWarning: false,
          },
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: path.resolve(
                  './node_modules/.cache/babel-loader'),
              },
            },
            'thread-loader',
            'babel-loader',
          ],
          include: path.resolve(__dirname, 'resources/js'),
        },
      ],
    },
    stats: 'errors-only',
    plugins: plugins,
  }
})

mix.js('resources/js/index.js', 'js')

mix.sass('resources/sass/app.scss', 'css')

// 用了 extract 后 hmr 无法正常使用，所以只要不使用 hmr 的时候使用 extract
if (!Mix.isUsing('hmr')) {
  // extract vendor
  mix.extract(['vue', 'axios', 'jquery'])
}

// versioning
if (mix.inProduction()) {
  // 使用 --source-maps 选项来决定是否构建 source-maps
  if (argv['source-maps']) {
    mix.sourceMaps()
  }
}

Mix.listen('configReady', (webpackConfig) => {
  if (Mix.isUsing('hmr')) {
    // Remove leading '/' from entry keys
    webpackConfig.entry = Object.keys(webpackConfig.entry).
      reduce((entries, entry) => {
        entries[entry.replace(/^\//, '')] = webpackConfig.entry[entry]
        return entries
      }, {})

    // Remove leading '/' from ExtractTextPlugin instances
    webpackConfig.plugins.forEach((plugin) => {
      if (plugin.constructor.name === 'ExtractTextPlugin') {
        plugin.filename = plugin.filename.replace(/^\//, '')
      }
    })
  }
})

// 加 --bs 选项使用 browser-sync
// 例如： yarn run watch-poll --bs
if (argv.bs) {
  mix.browserSync({
    proxy: 'gh-dashboard.test/',
    startPath: '',
    open: false,
    reloadOnRestart: true,
    watchOptions: {
      usePolling: true,
    },
  })
}
