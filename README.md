
# 安装依赖
```
npm install
```

# 项目运行

```
npm run dev
```

# 项目打包
```
npm run build
```


# 项目目录

 - `/dist` 打包后文件所在目录
 
 - `/public` 静态资源文件

 - `/src` 项目所在文件
 
      |_ `/assets` js、css、图片等文件

      |_ `/common` 公共的html文件

      |_ `/views` 页面文件

 

`注意：`

 1. 由于文件结构与打包后的结构不一致，因此在设置页面跳转路径时使用绝对路径，例如：`/views/home.html`
 2. 每个页面文件夹必须有`.js`文件，否则打包不会生成对应页面文件

``` 
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
```




