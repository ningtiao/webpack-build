### webpck.config.js webpack配置文件
作用: 指示webpack 干哪些活(当你运行webpack 指令时, 会加载里面的配置)
所有构建工具都是基于node.js平台运行的-模块化默认采用common.js

### 基础配置
```javascript
const { resolve } =  require('path')

module.exports = {
  // webpack配置
  // 入口起点
  entry: './src/index.js',
  // 输出
  output: {
    filename: 'bundle.js', // 输出文件名
    // __dirname是node.js的变量,代表当前文件目录绝对路径
    path: resolve(__dirname, 'build') // 输出路径
  },
  module: {
    rules: [

    ]
  },
  // plugins的配置
  plugins: [],
  // 模式
  mode: 'development', // 开发模式
  // mode: 'production',
}

```

### 处理css 文件
- yarn add webpack webpack-cli --dev
- yarn add style-loader --dev
- yarn add css-loader --dev
use 数组中loader 执行顺序, 从右到左,从下到上一次执行

```javascipt
-- src
  --- index.css
      body,html{
        background: darkkhaki;
        font-size: 20px;
        text-align: center;
      }
  --- index.js
      import './index.css'
      import './index.less'
      let element = document.createElement('h1')
      element.textContent = 'Hello Webpack'
      element.className = 'title'
      document.body.append(element)
```
yarn webpack

之后我们就可以得到一个经过打包后的文件bundle.js文件
```
build
--bundle.js
我们在build 下新建一个index.html  将bundle.js 引入 是不是发现页面变化了, 这就是loader的作用
```
### 处理 less scss 处理不同资源 配置不同loader
在webpack.config module中配置处理less的loader
- 在src文件下创建index.less 文件
```
.title{
  color: #ffffff;
}

```
- yarn add less-loader less --dev
```
{
  test: /\.less$/,
  use: [
    'style-loader',
    'css-loader',
    // 将less文件编译成css 文件
    'less-loader'
  ]
}

```
- 好啦,配置完成后我们执行yarn webpack 然后打开build文件下的index.html, 我们写的样式是不是有了变化, 开心！原来这么简单

### 打包html资源
- 在src 文件中创建index.html
- yarn add html-webpack-plugin --dev
我们需要导入 html-webpack-plugin,同时需要在plugin 配置HtmlWebpackPlugin 
- 功能默认会创建一个空的HTML, 自动引入打包输入的所有资源
```
// 需要有解构的html结构
new HtmlWebpackPlugin({
  template: './src/index.html'
})

```
- 继续执行打包命令 yarn webpack,这个时候build中的index.html会自动将js引入,直接打开html 看效果就可以啦!

### 图片资源打包
- yarn add url-loader file-loader html-loader --dev
- 这里我在image 文件夹中放入一张图片
```javascript
{
  // 处理图片
  test: /\.(jpg|png|gif)$/,
  loader: 'url-loader',
  options: {
    // 图片大小小于8kb,就会被base64处理
    // 优点: 减少请求数量(减轻服务器压力)
    // 缺点: 图片体积会更大(文件请求速度更慢)
    limit: 10 * 1024
  }
},
{
  test: /\.html$/,
  // 处理html文件img图片
  loader: 'html-loader'
}
```
- 因为url-loader默认是使用es6模块化解析的,而html-loader引入图片是commonjs,解析会出现问题: [object Module],使用commonjs解析
- 关闭url-loader的es6 module esModule: false
```

{
  // 处理图片
  test: /\.(jpg|png|gif)$/,
  loader: 'url-loader',
  options: {
    // 图片大小小于8kb,就会被base64处理
    // 优点: 减少请求数量(减轻服务器压力)
    // 缺点: 图片体积会更大(文件请求速度更慢)
    limit: 10 * 1024,
    esModule: false,
    // 给图片进行命名
    // [hash:10] 取图片前10位
    // ext取原来的扩展名
    name: '[hash:10].[ext]'
  }
},
```
- 执行yarn webpack 就可看到刚刚处理的图片资源了

### 打包其他资源
这里在阿里Iconfont上下载了几个图标来进行打包
- 在src 下建立font 文件 将图标所需文件拷贝进去
- 在index.js 引入 iconfont.css
- 在webpack.config.js配置
```
// 打包其他资源font
{
  exclude: /\.(css|js|html|less|png)$/,
  loader: 'file-loader'
}
```
### webpack devServer 开发服务器 自动打包
- yarn add webpack-dev-server --dev
- yarn webpack-dev-server
```javascript
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true, // 启动gzip压缩
    port: '3000', //端口号,
    // proxy: { // 代理
    //   '/api': {
    //     // http://localhost:8080/api/users -> https: //api.github.com/api/users
    //     target: 'https: //api.github.com',
    //     // 代理路径从写
    //     pathRewrite: {
    //       '^/api': ''
    //     },
    //     changeOrigin: true
    //   }
    // }
  },

```
这个时候我们在修改页面的内容时就会自动打包自动编译了,是不是轻松多了?非常好的开发体验

### webpack 开发环境配置
```javascript
const { resolve } =  require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // webpack配置
  // 入口起点
  entry: './src/index.js',
  // 输出
  output: {
    filename: 'bundle.js', // 输出文件名
    // __dirname是node.js的变量,代表当前文件目录绝对路径
    path: resolve(__dirname, 'build') // 输出路径
  },
  // 开发服务器 devServer: 用来自动化 自动编译,自动打开浏览器,自动刷新浏览器
  // 特点: 只会在内存中编译打包,不会有任何输出
  // 启动devServer 指令位yarn webpack-dev-server
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true, // 启动gzip压缩
    port: '3000', //端口号,
    open: true, // 自动打开浏览器
    // proxy: {
    //   '/api': {
    //     // http://localhost:8080/api/users -> https: //api.github.com/api/users
    //     target: 'https: //api.github.com',
    //     // 代理路径从写
    //     pathRewrite: {
    //       '^/api': ''
    //     },
    //     changeOrigin: true
    //   }
    // }
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        // 使用哪些loader
        use: [
          // use 数组中loader 执行顺序, 从右到左,从下到上一次执行
          'style-loader', // 创建style标签, 将js的模式资源插入进行,添加到head 中生效
          'css-loader', // 将css文件变成commonjs 模块加载到模块中,里面内容是字符串
          'less-loader'  // 将less文件编译成css 文件
        ]
      },
      {
        // 处理图片
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb,就会被base64处理
          // 优点: 减少请求数量(减轻服务器压力)
          // 缺点: 图片体积会更大(文件请求速度更慢)
          limit: 10 * 1024,
          esModule: false,
          // 给图片进行命名
          // [hash:10] 取图片前10位
          name: '[hash:10].[ext]'
        }
      },
      {
        test: /\.html$/,
        // 处理html文件img图片
        loader: 'html-loader'
      },
      // 打包其他资源font
      {
        exclude: /\.(css|js|html|less|png)$/,
        loader: 'file-loader',
        options: {
          // [hash:10] 取图片前10位
          name: '[hash:10].[ext]'
        }
      }
    ]
  },
  // plugins的配置
  plugins: [
    // 功能默认会创建一个空的HTML, 自动引入打包输入的所有资源
    // 需要有解构的html结构
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  // 模式
  mode: 'development', // 开发模式
  // mode: 'production',
}

```

### 如何让打包文件和目录文件一致
- 其实只要在每个use 下面的options配置outputPath就行了
```
options: {
  outputPath: 'image'
}

```