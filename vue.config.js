let proxyObj = {}

proxyObj['/'] = {
    // websocket
    ws: false,
    // 代理目标地址
    target: 'http://localhost:8081',
    // 发送请求头 host 会被设置 target
    changeOrigin: true,
    // 不重写请求地址
    pathRewrite: {
        '^/': '/'
    }
}

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj // 代理
    }
}