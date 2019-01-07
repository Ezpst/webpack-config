// webpack.common.js
const webpack = require('webpack');
const path = require('path'); // 路径处理模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入HtmlWebpackPlugin插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');  // 打包css插件(webpack4.x)

/**
 * HtmlWebpackPlugin封装
 * @param {*} packageNameAndPath   指定要打包的html路径和文件名
 * @param {*} outputNameAndPath    指定输出路径和文件名
 * @param {Array} scriptNameList   排除没有用到的script文件
 */
const getHtmlConfig = (packageNameAndPath, outputNameAndPath, scriptNameList) => {
  return {
    template: path.join(__dirname, packageNameAndPath),
    filename: path.join(__dirname, outputNameAndPath),
    minify: {
      removeComments: true, // 移除注释
      collapseWhitespace: true // 移除空格
    },
    excludeChunks: scriptNameList   //排除没有用到的script文件，其他的都引进来，比chunks更好匹配
  }
}

module.exports = {
  entry: {
    'assets/js/vendor': ['jquery', 'bootstrap'],
    'assets/js/index': path.resolve(__dirname, './src/assets/js/index.js'),
    'assets/js/two': path.resolve(__dirname, './src/assets/js/two.js')
  },
  output: {
    path: path.join(__dirname, "/dist"), //打包后的文件存放的地方
    filename: "[name].[hash:20].js" //打包后输出文件的文件名
  },
  plugins: [
    new HtmlWebpackPlugin(getHtmlConfig("/src/index.html", "/dist/index.html", ['assets/js/two'])),
    new HtmlWebpackPlugin(getHtmlConfig("/src/pages/home.html", "/dist/pages/home.html", ['assets/js/index'])),

    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[contenthash:20].css',
      chunkFilename: 'assets/css/[contenthash:20].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../' // 给背景图片设置一个公共路径
            }
          },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
      },
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/     // 排除匹配node_modules模块
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              limit: 10000, // 限制只有小于10kb的图片才转为base64
              outputPath: './assets/images',  // 设置打包后图片存放的文件夹名称
              publicPath: '../assets/images'  // 静态资源 (图片等) 的发布地址
            }
          },
          { //压缩图片要在file-loader之后使用
            loader: 'image-webpack-loader'
          }
        ]
      },
        {
          test: /\.pdf$/,
          loader: 'url-loader',
          options: {
            name: '[name].[hash:8].[ext]',
            limit: 10000,
            outputPath: './download',
            publicPath: '../download'
          }
        },
        { // bootstrap font-awesome
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          query: {
            limit: 10000,
            mimetype: 'application/font-woff',
            name: 'font/bootstrap/[name]_[hash:20].[ext]'   // 字体文件放置目录
          }
        },
        { // bootstrap
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          query: {
            limit: 10000,
            mimetype: 'application/octet-stream',
            name: 'font/bootstrap/[name]_[hash:20].[ext]'
          }
        },
        { // bootstrap
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'font/bootstrap/[name]_[hash:20].[ext]'
          }
        },
        { // bootstrap
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          query: {
            limit: 10000,
            mimetype: 'application/image/svg+xml',
            name: 'font/bootstrap/[name]_[hash:20].[ext]'
          }
        },
        { // font-awesome
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader",
          query: {
            limit: 10000,
            name: 'font/bootstrap/[name]_[hash:20].[ext]'
          }
        }
    ]
  }
}