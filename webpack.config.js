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
        loader: 'file-loader'
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