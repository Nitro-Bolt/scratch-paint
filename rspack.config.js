const path = require('node:path');
const {HtmlRspackPlugin} = require('@rspack/core');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const postcssVars = require('postcss-simple-vars');

const common = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'cheap-module-source-map',
    resolve: {extensions: ['.js', '.jsx']},
    module: {
        rules: [{
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'src'),
            loader: 'builtin:swc-loader',
            options: {
                env: {targets: ['last 3 versions', 'Safari >= 8', 'iOS >= 8']},
                jsc: {
                    parser: {jsx: true, syntax: 'ecmascript'},
                    transform: {react: {runtime: 'classic'}}
                }
            },
            type: 'javascript/auto'
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        esModule: false,
                        importLoaders: 1,
                        modules: {
                            exportLocalsConvention: 'camel-case-only',
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            namedExport: false
                        }
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [postcssImport(), postcssVars(), autoprefixer()]
                        }
                    }
                }
            ]
        }, {
            test: /\.svg$/i,
            oneOf: [{
                resourceQuery: /recolor/,
                loader: path.resolve(__dirname, 'src/tw-recolor/build.js'),
                type: 'javascript/auto'
            }, {
                type: 'asset/inline'
            }]
        }, {
            test: /\.png$/i,
            type: 'asset/inline'
        }]
    }
};

module.exports = [{
    ...common,
    name: 'playground',
    devServer: {
        host: '0.0.0.0',
        port: process.env.PORT || 8078,
        static: {directory: path.resolve(__dirname, 'playground')}
    },
    entry: {playground: './src/playground/playground.jsx'},
    output: {
        clean: true,
        path: path.resolve(__dirname, 'playground'),
        filename: '[name].js'
    },
    plugins: [new HtmlRspackPlugin({
        template: 'src/playground/index.ejs',
        title: 'Scratch 3.0 Paint Editor Playground'
    })]
}, {
    ...common,
    name: 'library',
    externals: {
        'prop-types': 'prop-types',
        'react': 'react',
        'react-dom': 'react-dom',
        'react-intl': 'react-intl',
        'react-intl-redux': 'react-intl-redux',
        'react-popover': 'react-popover',
        'react-redux': 'react-redux',
        'react-responsive': 'react-responsive',
        'react-style-proptype': 'react-style-proptype',
        'react-tooltip': 'react-tooltip',
        'redux': 'redux'
    },
    entry: {'scratch-paint': './src/index.js'},
    output: {
        clean: true,
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: {type: 'commonjs2'}
    }
}];
