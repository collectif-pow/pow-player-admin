const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [new HtmlWebpackPlugin({ template: './src/index.html' })];

console.log(__dirname);

module.exports = {
	entry: ['babel-polyfill', './src/main.js'],
	output: {
		path: __dirname + '/public',
	},
	module: {
		rules: [
			// js
			{
				test: /\.js$/,
				use: ['babel-loader'],
				include: [path.resolve(__dirname, 'src')],
			},
			// css
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
		],
	},
	plugins,
	devServer: {
		host: '0.0.0.0',
		historyApiFallback: true,
	},
};
