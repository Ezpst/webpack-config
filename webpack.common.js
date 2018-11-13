// webpack.common.js
const path = require('path');  // 路径处理模块
const webpack = require('webpack');  // 这个插件不需要安装，是基于webpack的，需要引入webpack模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入HtmlWebpackPlugin插件
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')

module.exports = {
    entry: {
        './assets/js/index': path.resolve(__dirname, './src/assets/js/index.js'),
        './assets/js/two': path.resolve(__dirname, './src/assets/js/two.js'),
    }, 
    output: {
        path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
        filename: "[name].[hash:20].js" //打包后输出文件的文件名
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'   // 给背景图片设置一个公共路径
                        }
                    },
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[hash:20].[ext]',
                            limit: 10000,  // 限制只有小于10kb的图片才转为base64
                            outputPath: './assets/images'  // 设置打包后图片存放的文件夹名称
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
                    name: '[name].[hash:20].[ext]',
                    limit: 10000,
                    outputPath: './download'
                }
            },
            {
                test: /\.(scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {  // jsx配置
                test: /\.(jsx|js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/   // 排除匹配node_modules模块
            },
        ]
    },
    plugins: [
        // new webpack.BannerPlugin('版权所有，翻版必究'), 
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/src/index.html"), 
            minify: {
                removeComments: true,       // 移除注释
                collapseWhitespace: true    // 移除空格
            },
            // excludeChunks: ['./assets/js/two.js']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: './assets/css/index.[contenthash:20].css',
            chunkFilename: './assets/css/index.[contenthash:20].css'
        })
    ]
}