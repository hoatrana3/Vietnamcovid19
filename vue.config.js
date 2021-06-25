const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  pages: {
    index: {
      title: 'Vietnamcovid19.info | Trung tâm thông tin Covid-19 Việt Nam',
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  devServer: {
    // clientLogLevel: 'warning',
    hot: true,
    port: 3000,
    contentBase: 'dist',
    compress: true,
    open: true,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    quiet: true,
    watchOptions: {
      poll: false,
      ignored: /node_modules/
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options
      })
  },
  productionSourceMap: false,
  assetsDir: './assets/',
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        { from: 'src/assets/img', to: 'assets/img' }
        // { from: 'src/assets/fonts', to: 'assets/fonts' }
      ])
    ]
  },

  pluginOptions: {
    i18n: {
      locale: 'vi',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
};
