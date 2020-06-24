### webpck.config.js webpack配置文件
作用: 指示webpack 干哪些活(当你运行webpack 指令时, 会加载里面的配置)
所有构建工具都是基于node.js平台运行的-模块化默认采用common.js

### 基础配置
```javascript
const { resolve } =  require('path')
// resolve用来拼接绝对路径的方法
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
  // 详细loader配置
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
// 匹配哪些文件
{
  test: /\.css$/,
  use: [
    // 创建style标签,将js中的样式资源插入进行
    'style-loader',
    'css-loader'
  ]
}

{
  test: /\.less$/,
  use: [
    // 创建style标签,将js中的样式资源插入进行
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
        test: /\.(less)$/,
        // 使用哪些loader
        use: [
          // use 数组中loader 执行顺序, 从右到左,从下到上一次执行
          'style-loader', // 创建style标签, 将js的模式资源插入进行,添加到head 中生效
          'css-loader', // 将css文件变成commonjs 模块加载到模块中,里面内容是字符串
          'less-loader'  // 将less文件编译成css 文件
        ]
      },
      {
        test: /\.(css)$/,
        // 使用哪些loader
        use: [
          // use 数组中loader 执行顺序, 从右到左,从下到上一次执行
          'style-loader', // 创建style标签, 将js的模式资源插入进行,添加到head 中生效
          'css-loader', // 将css文件变成commonjs 模块加载到模块中,里面内容是字符串
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
          outputPath: 'imgs'
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
### 生产环境构建
- css 代码压缩打包优化兼容

### 如何让打包文件和目录文件一致
- 其实只要在每个use 下面的options配置outputPath就行了
```
options: {
  outputPath: 'image'
}

```

### 构建生产环境
- css 处理整合在js中, 导致js文件体积变大, 同时因为是先加载js,才能通过style标签插入到页面中,会出现闪屏现象。所以我们需要优化css 从js 提取出来,还要对代码同意压缩
- 样式部分js 代码兼容问题
- 当然还有很多问题要优化
- 第一能让我们的代码更好更快更强的运行, 性能更好。 各个浏览器平稳运行不会出现问题。
- 事情多,需要在生产环境进行构建

#### 第一步 提取css 成单独文件
yarn add mini-css-extract-plugin --dev

<!-- "scripts": {
  "start": "webpack-dev-server --open --config webpack.config.js",
  "build": "webpack webpack.prod.js"
}, -->
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 我们需要将style-loader 替换成 MiniCssExtractPlugin.loader
rules: [
  {
    test: /\.(less|css)$/,
    // 使用哪些loader
    use: [
      // use 数组中loader 执行顺序, 从右到左,从下到上一次执行
      // MiniCssExtractPlugin取代style.loader
      // 提取js中的单css 成单独文件
      {
        loader: MiniCssExtractPlugin.loader
      },
      'css-loader', // 将css文件变成commonjs 模块加载到模块中,里面内容是字符串
      'less-loader'  // 将less文件编译成css 文件
  }
]

plugins: [
  new MiniCssExtractPlugin({
    filename: 'css/common.css'
  })
]

```
### 兼容性处理
- css 兼容性处理: postcss ---> yarn add postcss-loader postcss-preset-env --dev
- 使用loader 默认配置
- postcss-loader
- 修改loader 配置
- 帮postcss找到package.json 中的browserslist里面的配置,通过配置兼容指定的css 兼容性样式
```javascript
// package.json 添加
// >0.2%  大于99.8
// 开发环境 设置node环境变量 process.env.NODE_ENv = development
// development开发
// prodection生产

"borwserslist": {
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ],
  "prodection": [
    ">0.2%",
    "not dead",
    "not op_min all"
  ]
},

// 修改css loader的配置

{
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: () => [
      require('postcss-preset-env')()
    ]
  }
}
// 执行yarn build:prod
// 兼容样式之后的代码 会默认添加-weblit-前缀
.wrapper {
  width: 100px;
  height: 100px;
  background-color: darkseagreen;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
```
### 压缩CSS
- yarn add optimize-css-assets-webpack-plugin --dev
```javascript
const  OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

plugins: [
  // 压缩css
  new OptimizeCssAssetsWebpackPlugin()
]
```
- 执行命令 yarn build:prod 就可以看到压缩后的css代码啦

### js语法检查eslint
- 语法检查 eslint-loader eslint
- 只检查自己写的源代码,第三方库不检查
- 设置检查规则
- package.json 中eslintConfig中设置

- airbnb -> eslint-config-airbnb-base eslint eslint-plugin-import --dev
- 下一行eslint 所有规则都失效
- eslint-disable-next-line
```
{
  test: /\.js$/,
  exclude: /node_module/,
  loader: 'eslint-loader',
  options: {
    // 自动修复
    fix: true
  }
}
"eslintConfig": {
  extends: "airbnb-base"
}

```

### 压缩HTML和js
- 生产环境下会自动压缩代码

### html压缩
```
new HtmlWebpackPlugin({
  template: './src/view/index.html',
  minify: {
    // 移除空格
    collapseWhitespace: true,
    removeComments: true // 移除注释
  }
}),

```

### 生产环境配置
```javascript
- 一个loader 只能被一个loader 处理
- 先执行eslint 在执行babel
const { resolve } = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// 定义环境变量
process.env.NODE_ENV = 'production'
// 复用loader

const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader', // 兼容css
    options: {
      ident: 'postcss',
      plugins: () => [require('postcss-preset-env')()]
    }
  }
];
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/bundle.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [...commonCssLoader]
      },
      {
        test: /.less$/,
        use: [
          ...commonCssLoader,
          'less-loader'
        ]
      },
      {
        // eslint
        // 在package.js eslintConfig
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        // eslint
        // 在package.js eslintConfig
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: { version: 3 },
                target: {
                  chorme: '60',
                  firefox: '50'
                }
              }
            ]
          ]
        }
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
          name: '[hash:10].[ext]',
          outputPath: 'image'
        }
      },
      {
        test: /\.html$/,
        // 处理html文件img图片
        loader: 'html-loader',
      },
      // 打包其他资源font
      {
        exclude: /\.(css|js|html|less|png)$/,
        loader: 'file-loader',
        options: {
          // [hash:10] 取图片前10位
          name: '[hash:10].[ext]',
          outputPath: 'font'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/view/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        removeComments: true // 移除注释
      }
    })
  ],
  mode: 'production'
}


```

### 性能优化
- 开发环境性能优化
- 生产环境性能优化

## 开发环境性能优化
- 优化打包构建速度
- 优化代码运行的性能

### webpack HMR

### 热模块替换 极大的提升构建速度

- 样式文件: 可以开启HMR,在style-loader内部实现了
- js文件: 默认不能使用HMR功能
- html文件: 默认不能使用HMR功能,同时会导致问题,html文件不能更新了
- 解决: 修改entry入口,将html文件引入
```
entry: ['./src/js/index.js', './src/index.html']

devServer: {
  hot: true
  // 开启HMR功能
  // 当修改了webpack 配置,新配置要想生效,必须重新启动
}

// js
if (module.hot) {
  // 一旦module.hot 为true 说明开启了HMR功能
  // 让HMR功能代码生效
  mudule.hot.accept('./print, function() {
    // 方法监听print.js文件的变化,一旦发生变化,其他默认不会重新打包
    print()
  })
}
```

### source map
- 开发环境
- source map 是一种提供源代码到构建后代码映射技术 如果后代码出错了,构建后和源代码千差万别,找代码出错位置难, 构建后代码出错了可以追踪源代码的错误,利于我们调试找出出错的原因
```
devtool: 'source-map'

- inline-source-map
- hidden
- eval
- 
内联和外部的区别
1. 外部生成了文件,内联没有
```