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