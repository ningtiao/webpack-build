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
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'production'
}