const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');   //打包html插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");   //打包css的插件
const CleanWebpackPlugin = require('clean-webpack-plugin'); //引入清除文件插件

module.exports = {
  entry: {
    index: './src/scripts/index.js'
  },
  output: {
    path: path.resolve(__dirname,'./dist'),
    // 在打包文件后面加上hash值，解决因浏览器缓存而不能及时体现新的功能
    filename: 'scripts/[name][chunkHash:5].js',    //数字5代表后面hash值长度
    publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,   //script标签的放置，为true默认放在body里
      hash: true,
      minify: {                     //html压缩
        removeComments: true,      //移除注释
        collapseWhitespace: true  //移除空格
      },
      //chunks: ['main','aaa'],      //生成html页面后的script文件的引入
      excludeChunks: []   //排除没有用到的script文件，其他的都引进来，比chunks更好匹配
    }),

    new ExtractTextPlugin({
      filename: 'styles/[name][chunkHash:5].css'
    }),

    new CleanWebpackPlugin(['dist'])   //实例化，参数为目录
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '/src'),
        exclude: path.resolve(__dirname, '/node_modules')
      },
      {
        test: /\.(sc|le|c)ss$/,
        // 在webpack4.0中使用“extract-text-webpack-plugin”之后，生产环境下报错，输入以下命令解决版本问题冲突
        // npm install extract-text-webpack-plugin@next
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          publicPath: '../',   //解决css背景图路径问题
          use: [
            {
              loader: 'css-loader',
              options: {
                // modules: true, // 为true会将类名打包成hash值
                importLoaders: 1  // 前面有几个loader 值就是多少
              }
            },
            { 
              loader: 'postcss-loader', //利用postcss-loader自动添加css前缀
              options: {
                plugins: function() {
                  return [
                    require('postcss-import') //可以在css文件使用@import引用其他css
                  ]
                }
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              //limit表示小于10k的图片编译为base64，大于10k的图片使用file-loader
              // name表示输出的文件名规则，如果不添加这个参数，输出的就是默认值：文件哈希。加上[path]表示输出文件的相对路径与当前文件相对路径相同，加上[name].[ext]则表示输出文件的名字和扩展名与当前相同。加上[path]这个参数后，打包后文件中引用文件的路径也会加上这个相对路径。
              // outputPath表示输出文件路径前缀。图片经过url-loader打包都会打包到指定的输出文件夹下。但是我们可以指定图片在输出文件夹下的路径。比如outputPath=img/，图片被打包时，就会在输出文件夹下新建（如果没有）一个名为img的文件夹，把图片放到里面。
              // publicPath表示打包文件中引用文件的路径前缀，如果你的图片存放在CDN上，那么你上线时可以加上这个参数，值为CDN地址，这样就可以让项目上线后的资源引用路径指向CDN了
              name: '[name][hash:5].[ext]',
              limit: '10000',
              outputPath: 'images/'
            }
          },
          { //压缩图片要在file-loader之后使用
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              webp: { //将JPG和PNG图像压缩为WEBP
                quality: 75
              }
            }
          }
        ],
      },
      { // html-withimg-loader打包html文件中的图片
        test: /\.html$/,
        loader: 'html-withimg-loader',
      }
    ]
  }
}