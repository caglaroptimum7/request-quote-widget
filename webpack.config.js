const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
module.exports = {

    entry: [
        './src/index.jsx',
    ],
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false
                        }
                    },
                    'sass-loader'
                ]
            }

        ],

    },
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            test: /\.js(\?.*)?$/i,
        })],
    },
    output: {
        filename: 'raq-widget.js',
        path: path.resolve(__dirname, '../test-project-bigcommerce/assets/js/theme/request-quote-widget/'), // dist folder will be changed.

    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    performance: {hints: false},
    plugins: [
        new WebpackAutoInject({
            // specify the name of the tag in the outputed files eg
            // bundle.js: [SHORT]  Version: 0.13.36 ...
            SHORT: 'React Standalone APP',
            SILENT: true,
            PACKAGE_JSON_PATH: './package.json',
            PACKAGE_JSON_INDENT: 4,
            components: {
                AutoIncreaseVersion: true,
                InjectAsComment: true,
                InjectByTag: true
            },
            componentsOptions: {
                AutoIncreaseVersion: {
                    runInWatchMode: false // it will increase version with every single build!
                },
                InjectAsComment: {
                    tag: 'Version: {version} - {date}',
                    dateFormat: 'h:MM:ss TT', // change timezone: `UTC:h:MM:ss` or `GMT:h:MM:ss`
                    multiLineCommentType: false, // use `/** */` instead of `//` as comment block
                },
                InjectByTag: {
                    fileRegex: /\.+/,
                    // regexp to find [AIV] tag inside html, if you tag contains unallowed characters you can adjust the regex
                    // but also you can change [AIV] tag to anything you want
                    AIVTagRegexp: /(\[AIV])(([a-zA-Z{} ,:;!()_@\-"'\\\/])+)(\[\/AIV])/g,
                    dateFormat: 'h:MM:ss TT'
                }
            },
            LOGS_TEXT: {
                AIS_START: 'React Standalone App Build is started.'
            }
        })
    ]


};
