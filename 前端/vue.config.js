const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // devServer: {
  //   host: '0.0.0.0',
  //   port: 8081,
  //   client: {
  //     webSocketURL: 'ws://192.168.31.68:8081/ws',
  //   },
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //   }
  // }

  devServer: {
    hot:true,
    open:true,
    port:8081,
    proxy: {
      '/api': {
        target: 'http://192.168.31.68:8081',
        changeOrigin: true,
        ['/api/']:'',
        ws: true,  // 这一行很关键  表示是否开启  websocket
        secure: true,

        // pathRewrite: {
        //   '^/api': '/',
        // },
      },
    },
  },
})