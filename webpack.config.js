const path = require('path'),
	webpack = require('webpack');

const HTMLWebpackPlugin = require('html-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	CopyPlugin = require("copy-webpack-plugin"),
	{ CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATHS = {
	src: path.resolve(__dirname, './src'),
	dist: path.resolve(__dirname, './dist'),
	assets: '/assets'
};

module.exports = {
	context: PATHS.src,
	entry: {
		index: './index.js'
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
			inject: true
		}),
		new HTMLWebpackPlugin({
			template: './pages/color-type/index.pug',
			filename: './pages/color-type/index.html',
			inject: true
		}),
		new HTMLWebpackPlugin({
			template: './pages/cards/index.pug',
			filename: './pages/cards/index.html',
			inject: true
		}),
		new HTMLWebpackPlugin({
			template: './pages/headers-footers/index.pug',
			filename: './pages/headers-footers/index.html',
			inject: true
		}),
		new HTMLWebpackPlugin({
			template: './pages/form-elements/index.pug',
			filename: './pages/form-elements/index.html',
			inject: true
		}),
		new MiniCssExtractPlugin(),
		new CleanWebpackPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new CopyPlugin({
			patterns: [
				{ from: PATHS.src + PATHS.assets, to: PATHS.dist + PATHS.assets }
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
				test: /\.(woff|woff2|ttf|eot|svg)$/,
				type: 'asset/inline'
			},
			{
				test: /\.(png|jpg|jpeg|svg|gif)$/,
				exclude: [
					PATHS.src + PATHS.assets + '/fonts'
				],
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'assets/images',
					},
				},
			}
		]
	}
}