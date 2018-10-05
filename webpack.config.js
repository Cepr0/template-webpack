const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('node-sass');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		extensions: ['.js', '.html']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						skipIntroByDefault: true,
						nestedTransitions: true,
						emitCss: true,
						hotReload: true,
            style: ({content, attributes}) => {
              if (attributes.type !== 'text/scss') return;

              return new Promise((fulfil, reject) => {
                sass.render({
                  data: content,
                  includePaths: ['src'],
                  sourceMap: true,
                  outFile: 'x' // this is necessary, but is ignored
                }, (err, result) => {
                  if (err) return reject(err);

                  fulfil({
                    code: result.css.toString(),
                    map: result.map.toString()
                  });
                });
              });
            }
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
	],
	devtool: prod ? false: 'source-map'
};
