var webpack = require("webpack");
var path = require("path");

module.exports = {
	entry: {
		bundle: "./src/main.ts"
	},
	output: {
		path: path.resolve(__dirname, "script"),
		filename: "[name].js",
		libraryTarget: "umd"
	},
	plugins: [
		new webpack.optimize.DedupePlugin(),
	],
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		loaders: [
			{ test: /\.ts$/, loader: "ts-loader" }
		]
	}
};
