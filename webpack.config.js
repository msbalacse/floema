const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");


const IS_DEVELOPMENT = process.env.IS_DEVELOPMENT === 'dev';

const dirSrc = path.join(__dirname, 'src');
const dirStyles = path.join(__dirname, 'styles');
const dirShared = path.join(__dirname, 'shared');
const dirNode =  'node_modules';


module.exports = {
    entry: [
        path.join(dirSrc,'index.js'),
        path.join(dirStyles,'index.scss'),
    ],

    resolve:{
        modules:[
            dirSrc,
            dirStyles,
            dirShared,
            dirNode
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT
        }),

        new CopyWebpackPlugin({
            patterns:[
                {
                    from: './shared',
                    to:''
                }
            ]
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify,
              options: {
                plugins: [
                  "imagemin-gifsicle",
                  "imagemin-mozjpeg",
                  "imagemin-pngquant",
                  "imagemin-svgo",
                ],
              },
            },
            generator: [
              {
                type: "asset",
                implementation: ImageMinimizerPlugin.imageminGenerate,
                options: {
                  plugins: ["imagemin-webp"],
                },
              },
            ],
          }),   

          new CleanWebpackPlugin(),
    
    ],

    module : {
        rules: [
            {
                test: /\.js$/,
                use:{
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader : MiniCssExtractPlugin.loader,
                        options : {
                            publicPath:''
                        }
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    },
                ]
            },
            {
                test: /\.(jpe?g|svg|png|gif|woff2?|fnt|webp)$/,
                loader: 'file-loader',
                options: {
                    name(file){
                        return '[hash].[ext]'
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                use: [
                  {
                    loader: ImageMinimizerPlugin.loader,
                  }
                ],
            },
            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'raw-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'glslify-loader',
                exclude: /node_modules/,
            },
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
}