---
title: webpack打包项目
tags: webpack,模板,打包
grammar_cjkRuby: true
---

### 项目文件夹


----------

![enter description here][1]



### 流程步骤


----------


 1. 建立项目名

	`mkdir 项目名`
    
 

 2. 进入项目文件里面

     `cd 项目名`
     

 3. 生成package.json文件

      `npm init`
      

 4. 安装webpack( 我装的是webpack4.0 )

      `npm install webpack --save-dev`
      

 5. 生成node_modules目录

      `npm install`
      
      

 6. 建立src文件夹，src文件下建scripts和styles文件，并在scripts下建立出口文件index.js

     ` mkdir src`
     
     

 7. 在scripts下创建a.js和b.js 

      *在a.js和b.js中分别添加*
      
  ``` javascript
      export default function a() {
        console.log('module a');
      }
  ```
 
  
``` javascript
    export default function b() {
    	console.log('module b');
    }
```
     

 8. 根目录下创建index.html，并引入出口文件index.js，并在index.js文件中引入a.js和b.js


``` javascript
    import a from './a';
	import b from './b';
    
    a();
	b();
```


 9. 根目录下创建webpack.config.js，定义进出口文件对应的目录及entry文件的内容

  
``` javascript
    module.exports = {
    	entry: {
          index: './src/scripts/index.js'
        },
        output: {
          path: path.resolve(__dirname,'./dist'),
          // 在打包文件后面加上hash值，解决因浏览器缓存而不能及时体现新的功能
          filename: './scripts/[name][chunkHash:5].js'    //数字5代表后面hash值长度
        },
    }
```

 10. 执行打包命令`webpack`，可在dist文件下看到打包好的js文件，通常我们在vue-cli中执行打包的命令是`npm run build`，我们也可以在`package.json`中配置下

``` javascript
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "build": "webpack"		// 接下来输入 npm run build 便可打包
    },
```

 11. 生成页面中的html，安装html-webpack-plugin插件

``` javascript
	npm  install html-webpack-plugin --save-dev
```

``` javascript
	const HtmlWebpackPlugin = require('html-webpack-plugin');   //打包html插件
    
	module.exports = {
    	plugins: [
          new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body',   //script标签的放置
            minify: {                     //html压缩
              removeComments: true,      //移除注释
              collapseWhitespace: true  //移除空格
            },
            excludeChunks: []
          }),
        ],
    }
```

 12. js的loader安装

		
``` javascript
	npm install babel-preset-latest  --save-dev
    npm install babel loader babel-core babel-plugin-transform-runtime babel-preset-es2015  babel-runtime --save-dev
```

```javascript
	module: {
    	rules: [
        	{
              test: /\.js$/,
              loader: 'babel-loader',
              include: path.resolve(__dirname, '/src'),
              exclude: path.resolve(__dirname, '/node_modules')
            }
        ]
    }
```

 13. css的loader安装，先下载打包css的插件`extract-text-webpack-plugin`（*在webpack4.0中使用“extract-text-webpack-plugin”之后，生产环境下报错，输入以下命令解决版本冲突问题`npm install extract-text-webpack-plugin@next`）

``` javascript
	npm install extract-text-webpack-plugin --save-dev
    npm install style-loader css-loader --save-dev
    
    //css3前缀补全:
    npm install postcss-loader --save-dev
    npm install autoprefixer --save-dev
```
``` javascript
	  // postcss-loader的配置信息需要单独在根路径下写配置文件才可以使用，在根路径下新建postcss.config.js文件，文件里的内容：
    module.exports = {
     plugins: [
        require('autoprefixer')({
          "browsers": [
          "defaults",
          "not ie < 11",
          "last 2 versions",
          "> 1%",
          "iOS 7",
          "last 3 iOS versions"
          ]
        })
      ]
     };
```

``` javascript
	const ExtractTextPlugin = require("extract-text-webpack-plugin");   //打包css的插件
    
	{
        test: /\.css$/,
        // 在webpack4.0中使用“extract-text-webpack-plugin”之后，生产环境下报错，输入以下命令解决版本问题冲突
        // npm install extract-text-webpack-plugin@next
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', 
          use: [
            {
              loader: 'css-loader',
              options: {
                // modules: true, // 为true会将类名打包成hash值
                importLoaders: 1  // 前面有几个loader 值就是多少
              }
            },
            { loader: 'postcss-loader' }
          ]
        })
      },
```

 14. 图片的loader

``` javascript
	npm install file-loader --save-dev
    npm install url-loader --save-dev
    
    //图片压缩
    npm install image-webpack-loader --save-dev
    //打包html文件中的图片
    npm install html-withimg-loader --save-dev
```

```javascript
	{
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              //limit表示小于10k的图片编译为base64，大于10k的图片使用file-loader
              // name表示输出的文件名规则，如果不添加这个参数，输出的就是默认值：文件哈希。加上[path]表示输出文				件的相对路径与当前文件相对路径相同，加上[name].[ext]则表示输出文件的名字和扩展名与当前相同。加上				[path]这个参数后，打包后文件中引用文件的路径也会加上这个相对路径。
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
```
同时还要在`output`里添加`publicPath: './'`指明相对路径，在 `ExtractTextPlugin.extract`中添加`publicPath: '../'`，解决css背景图路径问题


### 最终配置如下


----------


``` javascript
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');   //打包html插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");   //打包css的插件

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
      minify: {                     //html压缩
        removeComments: true,      //移除注释
        collapseWhitespace: true  //移除空格
      },
      //chunks: ['main','aaa'],      //生成html页面后的script文件的引入
      excludeChunks: []   //排除没有用到的script文件，其他的都引进来，比chunks更好匹配
    }),

    new ExtractTextPlugin({
      filename: 'styles/[name][chunkHash:5].css'
    })
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
```


  [1]: ./images/file-directory.png "file-directory.png"