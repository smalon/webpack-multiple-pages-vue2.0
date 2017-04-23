const {
  resolve
} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('glob')
const url = require('url')
const publicPath = '/'
const entries = {}
const chunks = []
const nocommChunks = [];



module.exports = function (options = {}){
  Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
    this.splice(index, 1);
    }
  };
  var chunkssss = new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest']
  })
  console.log(chunkssss);
  // const extractTextPlugin =
  const plugins = [
      //这个插件用来打包公共的组件
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      //这个插件用来抽离css文件
       new ExtractTextPlugin(options.dev?"style.css":"public/css/[name]-[hash].css")
  ];

  //此处用于找到所有pages下的入口js，并写入webpack的entry配置中
  glob.sync('./src/pages/**/*.js').forEach(path => {
      const chunk = path.split('./src/pages/')[1].split('.js')[0]
      if(chunk.split('/').length <=2){
        // console.log(chunk);

      }else{
        nocommChunks.push(chunk);
      }

      entries[chunk] = path
      chunks.push(chunk)
  })
  //此处用于找到所有pages下的html模板，并采用htmlWebpackPlugin进行加载
  //生产环境下 打包生成的html会放在 /dist/view/模块名 文件夹中
  glob.sync('./src/pages/**/*.html').forEach(path => {
      // console.log(path);
      const allPath = path.split('./src/pages/')[1].split('.html')[0];
    const modulename = path.split('./src/pages/')[1].split('.html')[0].split('/')[0];
    const pagename = path.split('./src/pages/')[1].split('.html')[0].split('/')[1];
    const filename = '/view/' + modulename + '/' + pagename + '.html'
    // const chunk =  path.split('./src/pages/')[1].split('.html')[0]
    let tempChunks = nocommChunks.slice(0);
    tempChunks.remove(allPath);

    const htmlConf = {
      filename: filename,
      template: path,
      excludeChunks:tempChunks
    }
    if(options.dev){
      delete htmlConf.filename;
    }
   const newHtmlPlugin = new HtmlWebpackPlugin(htmlConf)
    plugins.push(newHtmlPlugin)
  });


  const config =  {
    entry: entries,
    output: {
      path: resolve(__dirname, 'dist'),
      filename: options.dev ? '[name].js' : 'public/js/[name].js?[chunkhash]',
      chunkFilename: '[id].js?[chunkhash]',
      publicPath: options.dev ? '/assets/' : publicPath
    },
    module: {
      rules: [{
          test: /\.vue$/,
          use: ['vue-loader']
        },
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              root: resolve(__dirname, 'src'),
              attrs: ['img:src', 'link:href']
            }
          }]
        },
        {
          test: /\.css$/,
          //这是一个坑，网上很多教程写的是ExtractTextPlugin.extract(["style-loader","css-loader"])
          //实际上这种写法已经被抛弃，会导致webpack报错
          //应采用以下这种写法
          use: ExtractTextPlugin.extract({
            fallback:"style-loader",
            use : "css-loader"
          }),

        },
        {
          test: /favicon\.png$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: options.dev?'[name].[ext]?[hash]':'public/img/[name].[ext]?[hash]'
            }
          }]
        },
        {
          test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
          exclude: /favicon\.png$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: options.dev?'[name].[ext]':'public/font/[name].[ext]'
            }
          }]
        },
        {
          test: /\.(png|jpg|jpeg)(\?.+)?$/,
          exclude: /favicon\.png$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: options.dev?'[name]-[hash].[ext]':'public/img/[name]-[hash].[ext]'
            }
          }]
        }
      ]
    },
    plugins: plugins,
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src')
      }
    },
    devServer: {
      //本地服务器设置 npm run dev后直接访问这个地址就可以看到demo
      host: '127.0.0.1',
      port: 8010,
      proxy: {
        //代理设置
        //127.0.0.1/api 的请求会转发到 http://192.168.9.155:7001 并重写url为 / (即去除/api)
        '/api': {
          target: 'http://192.168.9.155:7001',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      },
      //后退按钮
      historyApiFallback: {
        index: url.parse(options.dev ? '/assets/' : publicPath).pathname
      }
    },
    devtool: options.dev ? '#eval-source-map' : '#source-map'
  }
  return  config;
}
