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
  module: {
    rules: [
      {
        test: /\.css$/,
        // 使用哪些loader
        use: [
          // use 数组中loader 执行顺序, 从右到左,从下到上一次执行
          'style-loader', // 创建style标签, 将js的模式资源插入进行,添加到head 中生效
          'css-loader' // 将css文件变成commonjs 模块加载到模块中,里面内容是字符串
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // 将less文件编译成css 文件
          'less-loader'
        ]
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