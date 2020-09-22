const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');

// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';


module.exports = {
    context: __dirname,
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        // Needed to compile multiline strings in Cesium
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty'
    },
    resolve: {
        alias: {
            // CesiumJS module name
            cesium: path.resolve(__dirname, cesiumSource)
        }
    },
    // development server options
    devServer: {
        contentBase: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader',
                options: {
                    plugins: [],
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false
                            }
                        ],
                        '@babel/preset-react'
                    ],
                    sourceMap: true
                },
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }, 
            {
                test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
                use: [ 'url-loader' ]
            }, 
            {
                test: /\.(bmp)$/,
                loader: 'file-loader',
                options: {
                    esModule: false,
                    name:'[name].[ext]',
                    outputPath: 'Assets/myApp/Images/',
                    // 配置静态资源的引用路径。publicPath是打包后的 css 引用打包后的 图片的路径 /fonts/是绝对路径  fonts/是相对路径
                    publicPath:'Assets/myApp/Images/',
                },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
         // Copy Cesium Assets, Widgets, and Workers to a static directory
         new CopywebpackPlugin({ 
            patterns: [
                { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
                { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
                { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
            ]
        }),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
        })
    ]
};