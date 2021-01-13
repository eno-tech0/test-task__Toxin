const path = require('path'),
	webpack = require('webpack');

const HTMLWebpackPlugin = require('html-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	CopyPlugin = require("copy-webpack-plugin"),
	{CleanWebpackPlugin} = require('clean-webpack-plugin');

const PATHS = {
	src: path.resolve(__dirname, './src'),
	dist: path.resolve(__dirname, './dist'),
	assets: '/assets'
};

module.exports = {
	context: PATHS.src,
	entry: {
		'./index': './index.js',
		'./pages/color-type/index': './pages/color-type/index.js',
		'./pages/cards/index': './pages/cards/index.js',
		'./pages/headers-footers/index': './pages/headers-footers/index.js',
		'./pages/form-elements/index': './pages/form-elements/index.js'
	},
	output: {
		filename: '[name].js',
		path: PATHS.dist,
	},
	devServer: {
		historyApiFallback: true,
		contentBase: PATHS.dist,
		open: true,
		compress: true,
		hot: true,
		port: 8080,
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: './index.pug',
			filename: 'index.html',
			inject: false
		}),
		new HTMLWebpackPlugin({
			template: './pages/color-type/index.pug',
			filename: './pages/color-type/index.html',
			inject: false
		}),
		new HTMLWebpackPlugin({
			template: './pages/cards/index.pug',
			filename: './pages/cards/index.html',
			inject: false
		}),
		new HTMLWebpackPlugin({
			template: './pages/headers-footers/index.pug',
			filename: './pages/headers-footers/index.html',
			inject: false
		}),
		new HTMLWebpackPlugin({
			template: './pages/form-elements/index.pug',
			filename: './pages/form-elements/index.html',
			inject: false
		}),
		new MiniCssExtractPlugin(),
		new CleanWebpackPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new CopyPlugin({
			patterns: [
				{from: PATHS.src + PATHS.assets, to: PATHS.dist + PATHS.assets}
			]
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/, 
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.scss$/, 
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.pug$/,
				loader: 'pug-loader'
			},
			{
				test: /\.js$/, 
				use: 'babel-loader',
				exclude: [/node_modules/]
			},
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset/resource',
			}
		]
	}
}