// webpack.prod.js
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');  //压缩css插件
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {   // 将webpack.common.js合并到当前文件
  devtool: '#source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
  plugins: [
    new CleanWebpackPlugin(['dist']),  // 所要清理的文件夹名称
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: { 
        discardComments: { removeAll: true } 
      },
      canPrint: true //是否将插件信息打印到控制台
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "./public"),
        to: path.resolve(__dirname, './dist/public'),
        ignore: ['.*']
      }
    ])
  ]
})