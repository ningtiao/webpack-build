const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// 设置nodejs环境变量
// process.env.NODE_ENv = 'development'

module.exports = {
  // webpack配置
  // 入口起点
  entry: './src/index.js',
  // 输出
  output: {
    filename: 'bundle.js', // 输出文件名
    // __dirname是node.js的变量,代表当前文件目录绝对路径
    path: resolve(__dirname, 'dist') // 输出路径
  },
  // 开发服务器 devServer: 用来自动化 自动编译,自动打开浏览器,自动刷新浏览器
  // 特点: 只会在内存中编译打包,不会有任何输出
  // 启动devServer 指令位yarn webpack-dev-server
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    compress: true, // 启动gzip压缩
    port: '3000', //端口号,
    open: true, // 自动打开浏览器
  },
  module: {
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
          'less-loader',  // 将less文件编译成css 文件
          // 帮postcss找到
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')()
              ]
            }
          }
        ]
      },
      {

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
  // 告诉webpack需要新增一些什么样的功能
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/view/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      // 对输出文件进行重命名
      filename: 'css/[name].css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'production',
}