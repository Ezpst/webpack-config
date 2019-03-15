// webpack.common.js
const webpack = require('webpack');
const glob = require('glob');
const path = require('path'); // 路径处理模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入HtmlWebpackPlugin插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');  // 打包css插件(webpack4.x)
const isProd = process.env.NODE_ENV === 'production';

// 获取html-webpack-plugin参数的方法
const getHtmlConfig = function (name, chunks) {
  return {
    template: `./src/views/${name}/index.html`,   // 指定要打包的html路径和文件名
    filename: `${name == 'index' ? `${name}.html` : `./views/${name}.html`}`,   // 指定输出路径和文件名
    inject: true,
    chunks: chunks,
    minify: process.env.NODE_ENV === "development" ? false : {
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: true, //折叠空白区域 也就是压缩代码
      removeAttributeQuotes: true, //去除属性引用
    },
  };
};

function getEntry() {
  let entry = {};
  //读取src目录所有page入口
  glob.sync('./src/views/**/*.js')
  .forEach(function (name) {
    let start = name.indexOf('src/') + 4,
        end = name.length - 3;
    let eArr = [];
    let n = name.slice(start, end);
    n = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口 
    n = n.split('/')[1];
    eArr.push(name);
    entry[n] = eArr;
  });
  return entry;
};

// 引入第三方文件
const vendorEntry = {
  'vendor': ['jquery', 'bootstrap'],
  'common': path.resolve(__dirname, './src/assets/js/common.js')
}

module.exports = {
  entry: {...vendorEntry, ...getEntry()},
  output: {
    path: path.join(__dirname, "/dist"), //打包后的文件存放的地方
    filename: "./assets/js/[name].[hash:20].js" //打包后输出文件的文件名
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[contenthash:20].css',
      chunkFilename: 'assets/css/[contenthash:20].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: ["popper.js", "default"]
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
              publicPath: '../../assets/images'  // 静态资源 (图片等) 的发布地址
            }
          },
          { //压缩图片要在file-loader之后使用
            loader: 'image-webpack-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        use: ['html-withimg-loader']
      },
      { // bootstrap font-awesome
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: 'public/fonts/[name]_[hash:20].[ext]'   // 字体文件放置目录
        }
      },
      { // bootstrap
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'application/octet-stream',
          name: 'public/fonts/[name]_[hash:20].[ext]'
        }
      },
      { // bootstrap
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'public/fonts/[name]_[hash:20].[ext]'
        }
      },
      { // bootstrap
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'application/image/svg+xml',
          name: 'public/fonts/[name]_[hash:20].[ext]'
        }
      },
      { // font-awesome
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          name: 'public/fonts/[name]_[hash:20].[ext]'
        }
      }
    ]
  }
}

//配置页面
let entryObj = getEntry();
let htmlArray = [];
Object.keys(entryObj).forEach(element => {
  htmlArray.push({
    _html: element,
    title: '',
    chunks: ['vendor','common', element]
  })
})

// //自动生成html模板
htmlArray.forEach((element) => {
  module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})