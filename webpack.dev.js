// webpack.dev.js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');
const portfinder = require('portfinder');

/**
 * 动态设置端口号
 * 若8080端口被占用，8081可用，则用8081，依此类推
 */
let ports = fs.readFileSync('./port.json', 'utf8');
ports = JSON.parse(ports);
portfinder.basePort = '8080';   // 将默认的端口设置成8080，默认配置是8000
portfinder.getPort((err, port) => {
  ports.data.port = port;
  ports = JSON.stringify(ports, null, 4);
  fs.writeFileSync('./port.json', ports);
})

module.exports = merge(common, {   // 将webpack.common.js合并到当前文件
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    contentBase: "./dist",   // 本地服务器所加载文件的目录
    host: 'localhost',
    port: ports.data.port,  // 设置端口号
    inline: true,  // 文件修改后实时刷新
    overlay: true,  //出现错误之后会在页面中出现遮罩层提示
    historyApiFallback: true, //不跳转
    open:true   //运行之后自动打开本地浏览器
  }
})