const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: '[name].js?[contenthash]',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.json$/,
                loader: 'file-loader',
                type: 'javascript/auto',
                options: {
                    name: '[name].[ext]?[contenthash]',
                },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Eco production calculator',
            inject: true
        }),
        new HtmlWebpackRootPlugin(),
    ]
};