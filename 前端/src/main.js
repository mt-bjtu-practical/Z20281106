import Vue from 'vue'
import VueSocketIo from 'vue-socket.io'

// import myRegister from './myRegister.vue'
// import myLogin from './myLogin.vue'
// import myUser from './myUser.vue'
// import chatRoom from './chatRoom.vue'
import app from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);


Vue.use(
  new VueSocketIo({
    debug: true,
    connection: 'localhost:8081', 
  })
)


Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
  render: function(h){
    return h('div',[
      // h(myRegister),
      // h(myLogin),
      // h(myUser),
      // h(chatRoom)
      h(app)
    ])
  }
  // render: h => h(myRegister),
}).$mount('#app')
