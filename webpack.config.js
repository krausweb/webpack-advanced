'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const rimfaf = require('rimraf');
const path = require('path');


module.exports = {
  context: __dirname + "/src",
  entry: {
    home: './home',
    index: './index',
    // into common.js add welcome.js functionality (methods, vars and etc)
    // export only last file as a output.library
    common: ['./welcome', './common'],
    app: './app',
    //styles: './styles.sass' // create style.css and style.js via webpack.config.js
  },
  output: {
    // path to JS dist|output files and the WDS and HMR services
    path: path.resolve(__dirname, "dist"),
    // root of server for Browser
    publicPath: '/',
    // [name] is different for different 'entry.key'
    // chunkhash - only hash current file // [...:6] - only 6 symbols of hash
    filename: envParams('[name].js?hash=[hash:6]', '[name].[chunkhash:6].js'),
    // it is created in the process of require.ensure... | import().then.catch (0.234jlkj.js)
    chunkFilename: envParams('[id].js?hash=[hash:6]', '[id].[chunkhash:6].js'),
    // create the global var with name of file
    library: '[name]',
  },
  // only for dev environment
  watch: NODE_ENV === 'development',
  watchOptions: {
    aggregateTimeout: 100 // 300 by default
  },
  devtool: envParams('cheap-module-source-map', false),
  module: {
    rules: [
      // raw-loader is excluding work for node_modules work
      { test: /\.txt$/, exclude: /\/node_modules\//, use: 'raw-loader' },
      // apply jade-loader only for our dir - include: path.resolve(__dirname, "dist"),
      { test: /\.jade$/, use: 'jade-loader' },
      { test: /\.css$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader',
            // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            options: { importLoaders: 2 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      { test: /\.sass$/,
        use: ExtractTextPlugin.extract({
          use: [
            // translates CSS into CommonJS
            { loader: 'css-loader', options: { sourceMap: true, importLoaders: 2 } },
            // indentedSyntax: true - is .sass style support
            { loader: 'postcss-loader',
              options: {
                sourceMap: true, indentedSyntax: true, ident: 'postcss',
                plugins: (loader) => [
                  require('postcss-import')({ root: loader.resourcePath }),
                  require('postcss-cssnext')(),
                  // require('autoprefixer')(), // already included in 'postcss-cssnext'
                  require('cssnano')(),
                  /*require('doiuse')({
                    // also see package.json browserlist
                    browsers:['> 1%', 'last 2 versions', 'ie >= 9'],
                    // ignore: ['fr'], // an optional array of features to ignore
                    ignoreFiles: ['**!/normalize.css'], // an optional array of file globs to match against original source file path, to ignore
                    onFeatureUsage: function(usageInfo) {
                      //console.log('Doiuse info: ' + usageInfo.message);
                    }
                  })*/
                ]
              }
            },
            // fix sass style url content path -> dist path
            { loader: 'resolve-url-loader' },
            // compiles Sass to CSS // use sass for .sass files
            { loader: "sass-loader", options: { sourceMap: true } }
          ],
          // creates style nodes from JS strings
          fallback: 'style-loader' // only for production version NODE_ENV via ExtractTextPlugin config
        })
      },
      { test: /\.(png|jpg|gif|svg|ttf|oet|woff|woff2)$/, use: [
          {
            loader: 'file-loader',
            options: { name: envParams('[path][name].[ext]?hash=[hash:6]', '[path][name].[hash:6].[ext]') }
          }
        ]},
      { test: /old\.js$/, use: "imports-loader?myVar=>{value:'test'}"}
      // export var|object
      // { test: /old\.js/, use: "exports-loader?myData=>$"}
    ],
    // don't parse require and import in node_modules folder
    noParse: /jQuery/
  },
  plugins: [
    { // always at startup webpack, deletes the output folder from module.exports.output.path, example /dist
      apply: (compiler) => {
        rimfaf.sync(compiler.options.output.path);
      }
    },

    // create all .entry styles [name] (home.css|index.css) + all ensure + import() styles (allChunks: true)
    new ExtractTextPlugin({
      filename: envParams('[name].css?hash=[contenthash:6]', '[name].[contenthash:6].css'),
      allChunks: true,
      // turn off ExtractTextPlugin|not create .css for the Production
      disable: process.env.NODE_ENV === "development"
    }),

    // get and write to global var some JS Framework
    new webpack.ProvidePlugin({
      Vue: ['vue/dist/vue.esm.js', 'default']
    }),

    new HtmlWebpackPlugin({
      filename : './index.html',
      chunks: ['common', 'index'],
      //chunks: ['styles', 'common', 'index'],
      // allowed of template: jade/pug ejs underscore handlebars html-loader
      // https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md
      // setting a loader using the module.loaders syntax
      template: path.resolve(__dirname, 'src/index.jade')
    }),
    new HtmlWebpackPlugin({
      filename : './about.html',
      chunks: ['common', 'app'],
      template: path.resolve(__dirname, 'src/about.jade')
    }),
    new HtmlWebpackPlugin({
      filename : './home.html',
      chunks: ['common', 'home'],
      template: path.resolve(__dirname, 'src/home.jade')
    }),
    //new HtmlWebpackPlugin({template: '/dist/index.html'})

    // group common script|function|styles in common .js|.css files
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2, //make a common code, which is used in at least 2 files
      //chunks: ['index', 'home'] // additional list of only common files
    }),

    // remove everything files of module, except the ru and en-gb files, ang get into JS environmental
    new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /ru|en-gb/),

    // define global vars the NODE_ENV and LANG
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      LANG: JSON.stringify('ru') // or '"ru"'
    }),
    // just if exist global variable
    // new webpack.EnvironmentPlugin('NODE_ENV', 'USER'),

    // don't create dist/* files if they have any JS errors
    new webpack.NoEmitOnErrorsPlugin(),

    // group all info of .js|.css file in one .json file for BE server
    new AssetsPlugin({
      filename: 'manifest.json',
      path: path.resolve(__dirname, "dist")
    }),

    // create Favicons for all devices, 37 icons
    //new FaviconsWebpackPlugin(path.resolve(__dirname, "src/assets/favicon-original.png"))
  ],
  externals: {
    jquery: 'jQuery'
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      "node_modules",
      path.resolve(__dirname, "vendor")
    ],
    alias: {
      // a list of module name aliases
      "myOldFiles": path.resolve(__dirname, "vendor/my/old/files/old.js")
      // alias "module" -> "new-module" and "module/path/file" -> "new-module/path/file"
    }
  },
  // only for Webpack Dev Server (WDS) and Hot Module Replacement (HMR) !!!
  devServer: {
    // path to the all of output files // by default, server looked where started server in CLI
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    proxy: {
      // all(*) that not found pull into localhost:3000
      '*': 'http://localhost:3000'
    }
  }
};


if (NODE_ENV === 'production') {
  module.exports.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          ecma: 6,  // support ES2016
          warnings: false, // don't show warning
          drop_console: true, // drop console messages
          unsafe: true // use unsafe JS methods
        }
      }
    })
  );
}

/**
 * Check the NODE_ENV (DefinePlugin()) and return dev or prod environment
 * @param dev [string]
 * @param prod [string]
 * @returns {string}
 */
function envParams (dev, prod) {
  return (NODE_ENV === 'development') ? dev : prod;
}