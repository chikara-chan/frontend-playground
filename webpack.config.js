const path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    autoprefixer = require('autoprefixer'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
        'canvas-playground/viscosity/bundle': './docs/canvas-playground/viscosity',
        'canvas-playground/snowflake/bundle': './docs/canvas-playground/snowflake',
        'canvas-playground/chainball/bundle': './docs/canvas-playground/chainball',
        'css-playground/lovely-dog/bundle': './docs/css-playground/lovely-dog',
        'css-playground/rotate-cube/bundle': './docs/css-playground/rotate-cube',
        'css-playground/rotate-shadow/bundle': './docs/css-playground/rotate-shadow',
        'css-playground/transform-text/bundle': './docs/css-playground/transform-text',
        'threejs-playground/particle/bundle': './docs/threejs-playground/particle'
    },
    output: {
        path: './docs',
        filename: '[name].js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-0'],
                plugins: ['transform-runtime', 'add-module-exports']
            }
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
        }, {
            test: /\.(jpg|png|gif|webp)$/,
            loader: 'url?limit=8000'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    },
    postcss: [autoprefixer({browsers: ['> 5%']})],
    resolve: {extensions: ['', '.js', '.json', '.scss']},
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin('[name].css')
    ]
}
