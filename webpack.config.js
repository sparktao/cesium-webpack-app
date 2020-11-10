const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');

// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
// const cesiumSource = './public/static/Cesium';
// const cesiumWorkers = '/Workers';



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
        contentBase: path.join(__dirname, "dist"),
        port: 5001
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader',
                options: {
                    plugins: ['@babel/plugin-proposal-class-properties'],
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
                test: /\.(png|gif|svg|xml|json)$/,
                use: [ 'url-loader' ]
            }, 
            {
                test: /\.(bmp|jpg|jpeg)$/,
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
        new webpack.ProvidePlugin({            
            Cesium: 'cesium/Cesium',
            'window.Cesium': 'cesium/Cesium',
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico'
        }),
         // Copy Cesium Assets, Widgets, and Workers to a static directory 拷贝Assets, Widgets, Workers到static文件夹
         new CopywebpackPlugin({ 
            patterns: [
                // { from: cesiumSource, to: 'static/Cesium' },
                { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
                { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
                { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
                { from: 'src/Assets/myApp/data', to: 'Assets/myApp/data' },
            ]
        }),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
        })
    ]
};