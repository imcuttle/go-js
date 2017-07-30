/**
 * Created by moyu on 2017/7/31.
 */
module.exports = [
    {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
            // root
        ],
        query: {
            cacheDirectory: true,
            presets: ['es2015', 'react', 'stage-0'],
            plugins: [
                'react-hot-loader/babel',
                'transform-decorators-legacy'
            ]
        },
        happy: {id: 'js'}
    },

    {
        test: /\.css$/,
        loaders: [
            'style-loader',
            'css-loader?localIdentName=[path][name]__[local]___[hash:base64:5]',
            'autoprefixer?browsers=last 2 version&remove=false'
        ],
        happy: {id: 'css'}
    },

    {
        test: /\.less$/,
        loaders: [
            'style-loader',
            'css-loader?localIdentName=[path][name]__[local]___[hash:base64:5]',
            'autoprefixer?browsers=last 2 version&remove=false',
            'less-loader'
        ],
        happy: {id: 'less'}
    },

    // 其他资源
    {
        test: /\.(jpeg|jpg|png|gif)$/,
        loader: 'url-loader?limit=10240'
    },
    {
        test: /\.html$/,
        loader: 'html-loader'
    },
    {
        test: /\.json$/, loader: 'json-loader'
    },
    {
        test: /\.woff(\?.+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'
    },
    {
        test: /\.woff2(\?.+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'
    },
    {
        test: /\.ttf(\?.+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'
    },
    {
        test: /\.eot(\?.+)?$/, loader: 'file'
    },
    {
        test: /\.svg(\?.+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'
    },
    {
        test: /\.tag$/,
        loaders: ['babel-loader']
    }
]