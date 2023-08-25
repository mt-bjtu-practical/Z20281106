<template>
  <div>
    <transition name="fade">
      <div class="main-box" v-show="showboxlr">
        <div :class="['container', 'container-login', { 'is-txl is-z200': isLogin }, {'is-hidden': isRegiste}]">
          <form>
            <h2 class="title">登录聊天室</h2>
            <span class="text">使用您的用户名和密码</span>
            <input class="form__input" @keyup.enter="loginEvent" v-model="loginForm.username" type="text" placeholder="用户名" />
            <input class="form__input" @keyup.enter="loginEvent" v-model="loginForm.password" type="password" placeholder="密码" />
            <div class="primary-btn" @click="loginEvent">立即登录</div>
          </form>
        </div>
        <div :class="['container', 'container-register', { 'is-txl': isLogin }, {'is-hidden': isLogin}]">
          <form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <h2 class="title">创建您的账户</h2>
            <span class="text">运用用户名和密码</span>
            <input class="form__input" v-model="ruleForm.username" type="text" placeholder="用户名" />
            <input class="form__input" v-model="ruleForm.pass" type="text" placeholder="密码" />
            <input class="form__input" v-model="ruleForm.checkPass" type="password" placeholder="确认密码" />
            <div class="primary-btn" @click="submitForm">立即注册</div>
          </form>
        </div>
        <div :class="['switch', { login: isLogin }]" v-show="showboxlr">
          <div class="switch__circle"></div>
          <div class="switch__circle switch__circle_top"></div>
          <div class="switch__container">
            <h2>{{ isRegiste ? '你好，欢迎使用 !' : '欢迎回来 !' }}</h2>
            <p>
              {{
                isRegiste
                  ? '使用您的个人信息以创建您的个人聊天账户'
                  : '每天聊一聊，生活更美妙'
              }}
            </p>
            <div class="primary-btn" @click="isLogin = !isLogin,isRegiste=!isRegiste">
              {{ isLogin ? '立即注册' : '立即登录' }}
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="container"  v-show="showboxchat">
        <div class="box verboxleft">
          <div class="avatar-container">
            <!-- CCC 个人头像 -->
            <img :src="getImageUrl(myAvatar)" alt="Avatar" class="avatar" @click="showInfoDialog = true">
            <el-dialog :visible.sync="showInfoDialog" width="20%" :top="'55px'" :before-close="handleClose" custom-class="userinfo-dialog">
              <div class="image-text">  
                <!-- CCC 个人信息小框 -->

                <div>
                  <!-- 头像 -->
                  <input type="file" accept="image/jpeg" ref="fileInput" class="image-dialog" @change="changeAvatarRequest" style="display: none" />
                  <img :src="getImageUrl(myAvatar)" alt="Avatar" class="image-dialog" @click="openFilePicker" style="cursor: pointer" />
                  <!-- <img src="./images/avatar02.jpg" alt="tupian" class="image-dialog" @click="changeAvatarEvent"> -->
                </div>
     
                <div class="text-dialog" style="font-size:20px;">
                  {{ (Nickname !== null) ? Nickname : "默认用户昵称" }}
                  <!-- <button class="btn0" style="margin-right: 10px;border-radius: 4px; border:none; padding:5px 40px; background-color: #25c672; color: #ffffff;font-size: 20px;" @click="receiveallmsg">收消息</button> -->
                  <button class="btn0 btn-dialog" type="text" style="font-size: 10px; border-radius: 4px;" @click="showInputDialog = true">修改昵称</button>
                  <el-dialog :visible.sync="showInputDialog" width="20%" :top="'55px'" :before-close="handleClose" custom-class="userinfo-dialog">
                    <div class="image-input"> 
                      <input type="text" v-model="changeNickname" class="search-input" placeholder="输入昵称"> 
                      <el-button @click="changeNick">提交</el-button>
                    </div>
                    <!-- <span slot="footer" class="dialog-footer">
                    <el-button @click="showInputDialog = false">取 消</el-button>
                    <el-button type="primary" @click="showInputDialog = false">确 定</el-button>
                    </span> -->
                  </el-dialog>
                </div>
                  <div class="text-dialog">{{ loginForm.username }}</div>
                  <div style="clear: both;"></div>
                </div>
                <div class="btn-dialog">
                  <!-- <button class="btn0" style="margin-right: 10px;border-radius: 4px; border:none; padding:5px 40px; background-color: #25c672; color: #ffffff;font-size: 20px;" @click="receiveallmsg">收消息</button> -->
                  <el-button class="btn0" type="text" icon="el-icon-delete" style="font-size: 20px;" @click="deleteEvent"></el-button>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="showInfoDialog = false">取 消</el-button>
                <el-button type="primary" @click="showInfoDialog = false">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <!-- <div class="btn-container">
            <el-button class="btn" type="text" icon="el-icon-chat-round" style="width:0px;height: 0px; font-size: 0px; color: #25c672;"></el-button>
            <el-button class="btn" type="text" icon="el-icon-chat-round" style="font-size: 30px; color: #25c672;"></el-button>
            <el-button class="btn" type="text" icon="el-icon-user" style="font-size: 30px; color: #25c672;"></el-button>
            <el-button class="btn" type="text" icon="el-icon-setting" style="font-size: 30px; color: #25c672;"></el-button>
          </div> -->
        </div>
        <div class="box verboxmid">
          <div class="verboxmidtop">
            <!-- CCC1 搜索好友 -->
            <input type="text" v-model="searchInput" class="search-input" @keyup.enter="applyFriend" placeholder="搜索">
            <i class="el-icon-circle-plus-outline" style="margin-top: 10px; margin-right: 3px;" @click="applyFriend"></i>
            <i class="el-icon-user" style="margin-top: 10px; margin-right: 5px;" @click="addFriendDialog = true"></i>
              <el-dialog :visible.sync="addFriendDialog" width="20%" :top="'55px'" :before-close="handleClose" custom-class="userinfo-dialog">
                <div style="height: 350px; overflow: auto;">
                  <div v-for="appmsg in appmsgsdata" :key="appmsg.message_id" style="display: flex; align-items: center; flex-wrap: wrap; line-height: 30px;">
                    <!-- 有可能接受方是自己，在这里还是显示另一方的名字 -->
                      <span>
                        {{ getApplyUser(appmsg) }}
                        {{ getApplyTime(appmsg) }}
                        <!-- 这里的application_state仅用于调试，做前端时需根据状态调整界面显示 -->
                        {{ getApplyState(appmsg) }}
                      </span>
                    <!-- 这里需要处理，当appmsg == 0时，表示该消息没有被处理，显示操作按钮，当appmsg为1时，表示已同意，为-1时，表示已拒绝 -->
                    <div v-if="appmsg.application_state === 0 && appmsg.sender_id !== loginForm.username" style="width: 100%;">
                        <button class="btn3" style="color: #25c672;font-size: 16px;" @click="appAccept(appmsg)">接受</button>
                        <button class="btn3" style="color: #c6254b;font-size: 16px;" @click="appReject(appmsg)">拒绝</button>
                      </div>
                      <div v-else-if="appmsg.application_state === 1" style="width: 100%;">已接受</div>
                      <div v-else-if="appmsg.application_state === -1" style="width: 100%;">已拒绝</div>
                    <!-- <div v-if="!acceptedStatus[appmsg.message_id]" style="width: 100%;">
                        <button class="btn3" style="color: #25c672;font-size: 16px;" @click="appAccept(appmsg,'已接受')">接受</button>
                        <button class="btn3" style="color: #c6254b;font-size: 16px;" @click="appReject(appmsg,'已拒绝')">拒绝</button>
                      </div>
                      <div v-else-if="acceptedStatus[appmsg.message_id] === '已接受'" style="width: 100%;">已接受</div>
                      <div v-else-if="acceptedStatus[appmsg.message_id] === '已拒绝'" style="width: 100%;">已拒绝</div> -->
                    <div v-if="index !== appmsgsdata.length - 1" class="divider"></div>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="addFriendDialog = false">取 消</el-button>
                  <el-button type="primary" @click="addFriendDialog = false">确 定</el-button>
                </span>
              </el-dialog>
          </div>
          <div class="verboxmidbottom">
            <div class="scroll-content">
              <!-- CCC 在好友列表中显示头像 -->
              <!-- CCC1 删除好友 -->
              <div v-for="friend in contactsdata" :key="friend.friend_id" style="display: flex; align-items: center; line-height: 30px;" @click="receivemsg(friend)" @contextmenu.prevent="deleteFriend(friend)">
                <img :src="getImageUrl(friend.avatar)" alt="Avatar" style="display:inline-block; vertical-align: middle; margin-top: 8px; margin-left:8px; margin-right: 8px; margin-bottom: 0px; width: 50px; height: 50px;"/>
                <div style="flex-grow: 1;">
                  <span style="display: inline-block; margin-top: 20px; font-size: 20px;">{{ friend.friend_id }}</span>
                  <span style="float: right; margin-top: 20px; margin-right: 2px; font-size: 8px;">{{ getLastMsgTime(friend) }}</span>
                  <div style="color:#8b8a89; margin-bottom: 10px; margin-left: 0px; font-size: 12px;">{{ getLastMsg(friend) }}</div>
                  <div v-if="index !== contactsdata.length - 1" class="divider"></div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <div class="box verboxright">
          <div v-if="msgOfChat!==-1" class="verboxrighttop" style="font-size: 20px;">
            {{ chatfriend.friend_id }}
          </div>
          <div class="verboxrightmid">
            <div v-if="chatfriend" class="scroll-content">
              <div class="msg-container">
              <div v-for="msg in msgsdata" :key="msg.message_content" :class="getClass(msg)">
                <div v-if="getClass(msg) === 'left'" class="message-left">
                  <img :src="getImageUrl(msgAvatar)" alt="friendimage" style="width: 30px; height: 30px;">
                </div>
                {{ msg.message_content }}
                <div v-if="getClass(msg) === 'right'" class="message-right">
                  <img :src="getImageUrl(myAvatar)" alt="myimage" style="width: 30px; height: 30px;">
                </div>
                <!-- <div v-if="index !== contactsdata.length - 1" class="divider"></div> -->
              </div>
            </div>
            </div>
          </div>
          <div class="verboxrightbottom">
            <div class="btn-group">
              <!-- <el-button class="btn2" type="text" icon="el-icon-orange" style="font-size: 25px; color: #25c672;"></el-button>
              <el-button class="btn2" type="text" icon="el-icon-folder-opened" style="font-size: 25px; color: #25c672;"></el-button>
              <el-button class="btn2" type="text" icon="el-icon-picture-outline" style="font-size: 25px; color: #25c672;"></el-button>
              <el-button class="btn2" type="text" icon="el-icon-mic" style="font-size: 25px; color: #25c672;"></el-button> -->
            </div>
            <input type="text" v-model="msgtext" @keyup.enter="sendMsg" class="text-input">
            <div class="send-btn">
              <button class="btn3" style="color: #25c672;font-size: 16px;" @click="sendMsg">发送(Enter)</button>
            </div>
          </div>  
        </div>
      </div>
    </transition>
  </div>
</template>
  
  <script>
  export default {

    // name: 'LoginBox',
    data() {
      var checkName = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('用户名不能为空'));
          }
          setTimeout(() => {
            if (value.length > 8) {
              callback(new Error('用户名不能超过8个字符'));
            } 
            else{callback();}
          }, 1000);
        };
  
      var validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.ruleForm.checkPass !== '') {
              this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
          }
        };
  
      var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.pass) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
      return {
        showInfoDialog: false,
        showInputDialog: false,
        addFriendDialog: false,

        isLogin: false,
        isRegiste: true,
        isChat: true,
        isConnected: false,
        acceptedStatus: {},

        showboxlr: true,
        showboxchat: false,

        contactsdata: '',
        // friend_id: res[0][i].friend_id,
        // avatar: null,
        // remark: res[0][i].remark,
        // chat_id: res[0][i].chat_id,
        // 聊天室id
        chatsdata: '',
        // chat_with_id: res[i].chat_with_id,
        // remark: res[i].remark,
        // chat_id: res[i].chat_id,
        // last_msg_time: res[i].last_msg_time,
        // last_msg: res[i].last_msg,
        // 消息id
        msgsdata:'',
        receivemsgdata:'',
        chatfriend: '',
        msgtext: '',

        loginForm: {
          username: '',
          password: '',
        },
        ruleForm: {
          username: '',
          pass: '',
          checkPass: '',
        },
        rules: {
            username: [
              { validator: checkName, trigger: 'blur' }
            ],
            pass: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validatePass2, trigger: 'blur' }
            ]
          },
        // CCC 头像url
        myAvatar: '',
        msgAvatar: '',
        msgOfChat: -1,
        // CCC1 搜索输入
        searchInput: '',
        changeNickname: '',
        Nickname: '',
        // CCC2 好友申请消息
        appmsgsdata:'',
      };
    },

  // 在页面刷新前执行断开连接操作
  beforeCreate() {
    window.addEventListener('beforeunload', this.disconnect); 
  },

  created() {
    console.log("myLogin.vue is running!")
    if (!this.isConnected) {
      // 打开 WebSocket 连接
      this.$socket.open();
      // 设置连接状态
      this.isConnected = true; 
      
    }

  },

  mounted(){
    console.log("mounted is running!")

    const dialog = document.querySelector('.el-dialog');

    if (dialog) {
        dialog.style.left = '-195px';
      }
  },

    methods: {
      disconnect() {
      // 关闭WebSocket连接
      this.$socket.close(); 
      // 移除监听事件
      window.removeEventListener('beforeunload', this.disconnect); 
    },

    // CCC 返回好友的头像url
    getImageUrl(base64Data) {
      if(base64Data)
        return `data:image/jpeg;base64,${base64Data}`;
      else
        return "src/images/avatar01.jpg";

    },

    // CCC2 返回好友的最新消息信息
    getLastMsgTime(friend){
      if(friend.last_msg_time){
        const now = new Date();
        // const msg_time = new Date(friend.last_msg_time)
        var msg_time = new Date(Date.parse(friend.last_msg_time))
        // var utcTimestamp = Date.parse(friend.last_msg_time);
        // msg_time = new Date(utcTimestamp);
        // msg_time = msg_time.toLocaleString();
        // alert(now, msg_time)
        const day = now.getDay();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        if (msg_time.getFullYear() <= now.getFullYear()
          && msg_time.getMonth() <= now.getMonth()
          && msg_time.getDate() < now.getDate()){
          return `${msg_time.getFullYear()}-${msg_time.getMonth()+1}-${msg_time.getDate()}`
        }
        else {
          // msg_time = msg_time.toLocaleTimeString();
          return `${msg_time.getHours()}:${msg_time.getSeconds()}`
        }
      }
      else{
        return;
      }
    },

    getLastMsg(friend){
      var maxLength = 8;
      if(friend.last_msg){
        if (friend.last_msg.length <= maxLength) {
          return friend.last_msg;
        } else {
          return friend.last_msg.slice(0, maxLength) + '...';
        }
      }
      else{
        return;
      }
    },

    mountEvents(){
      // alert("mount events")
      this.sockets.subscribe('returnContacts',data => {
        this.contactsdata = data
        console.log(data[0])
      })

      this.sockets.subscribe('returnAppMsgs',data => {
          this.appmsgsdata = data
      })

      this.sockets.subscribe('returnMsgs',data => {
          this.msgsdata = data
      })

      // CCC2   所有的接收消息的处理返回函数都需要在登录成功后注册
      this.sockets.subscribe('receiveMessage',data => {
          this.msgsdata.push(data[0])
          this.$socket.emit('requestContacts', (this.loginForm.username))
      })

      // 收到好友申请时
      this.sockets.subscribe('receiveAppMsg',data => {
          if(this.loginForm.username == data.sender_id){
            // alert('1')
            console.log("cnm")
            // alert("申请消息发送成功!")
          }
          else {
            // alert(data.sender_id, "请求添加您为好友!")
          }
          this.$socket.emit('requestAppMsgs', this.loginForm.username)
      })

      // 更新通讯录和申请消息列表
      this.sockets.subscribe('update',() => {
        // alert("update")
        this.$socket.emit('requestContacts', this.loginForm.username)
        this.$socket.emit('requestAppMsgs', this.loginForm.username)
      })
    },

    loginEvent () {
    //   var password = this.loginForm.password
      var data = {
        id: this.loginForm.username,
        password: this.loginForm.password
      }
      
      this.$socket.emit('login', data)

      this.sockets.subscribe('checkoutAnswer', data => {
        // console.log(data)
        if(data.msg==="用户密码正确"){
            // alert("欢迎登录！")
            this.showboxchat = true
            this.showboxlr = false
            this.isChat = true
            var user_id = this.loginForm.username
            console.log(data)
            //CCC 登录时取得头像数据
            this.myAvatar = data.avatar
            this.Nickname = data.nickname
            // 定义消息接收处理函数
            this.mountEvents()

            this.$socket.emit('requestContacts', (user_id))
            this.$socket.emit('requestAppMsgs', this.loginForm.username)
              // this.$socket.emit('requestChats', (user_id))
              // this.sockets.subscribe('returnChats',data => {
              //   this.chatsdata = data
              //   // console.log(data)
              // })
            
            // console.log(this.chatsdata)
            // this.chatsdata.chat_id
            // console.log(chatid)
        }
        else{
          alert("用户名或密码错误")
        }
      })
    },

//     receiveallmsg(){
//       var chat_id = this.chatsdata[0].chat_id
//       console.log(chat_id)
//       this.$socket.emit('requestMsgs', (chat_id))
//       this.sockets.subscribe('returnMsgs',data => {
//         this.msgsdata = data
// })
    // },

    changeNick(){
      var user_id = this.loginForm.username
      console.log(user_id)
      var new_nickname = this.changeNickname
      console.log(new_nickname)
      this.$socket.emit('changeNickname', user_id, new_nickname)
      this.Nickname = new_nickname
      this.showInputDialog = false
    },
    
    getClass(msg) {
      var user_id = this.loginForm.username

      // console.log(msg.message_id)
      if (msg.sender_id === user_id) {
        console.log('right')
        return 'right';
      } else {
        console.log('left')
        return 'left';
      }
  },


    receivemsg(friend) {
      this.msgOfChat = friend.chat_id
      this.chatfriend = friend;
      var chat_id = this.chatfriend.chat_id
      console.log(chat_id)
      // CCC 定义显示的头像
      this.msgAvatar = this.chatfriend.avatar
      this.$socket.emit('requestMsgs', (chat_id))
      this.sockets.subscribe('returnMsgs',data => {
      this.msgsdata = data
    })
    },

    // 发消息并更新消息列表
    sendMsg(){
      if (this.msgOfChat != -1){
        var msgdata={
          chat_id: this.chatfriend.chat_id,
          sender_id: this.loginForm.username,
          receiver_id: this.chatfriend.friend_id,
          send_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
          message_content: this.msgtext
        }
        this.$socket.emit('sendMessage', (msgdata))
        
        var chat_id = this.chatfriend.chat_id
        console.log(chat_id)

        this.$socket.emit('requestMsgs', (chat_id))
        
        this.msgtext = ''
      }
      else {
        alert("请先选择一个聊天！")
      }
      
  },

  // 注册
    submitForm(formName) {
    //   var id = this.ruleForm.username
    //   var password = this.ruleForm.pass
        
      var data ={
        id: this.ruleForm.username,
        password: this.ruleForm.pass
      } 

      var checkpass = this.ruleForm.checkPass
      
      if(checkpass === data.password){
        this.$socket.emit('signup', data)
        this.sockets.subscribe('signupFail', (msg) => {
          alert('注册信息不正确')
        })
        // 登陆成功
        this.sockets.subscribe('signupSuccess', (msg)=>{
          alert('请登录')
        })
      }
      else{
        alert('注册信息不正确')
      }
    },

    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },

    deleteEvent () {
        var user_id = this.loginForm.username

        this.$socket.emit('cancelAccount', user_id)

        this.sockets.subscribe('cancelAccountSuccess',() => {
          alert("注销成功")
          // 缺：用户注销后跳转界面
          this.showboxchat=false
          this.showboxlr=true
        })
      },

    requestContactsEvent () {
      var user_id = this.loginForm.username

      this.$socket.emit('requestContacts', user_id)

      this.sockets.subscribe('returnContacts',data => {
        
        })
      },

    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
    
    // 打开文件选择器
    openFilePicker() {
      this.$refs.fileInput.click();
    },

    // 修改头像
    changeAvatarRequest (event) {
        const file = event.target.files[0];
        if (!file) {
          // alert("!file");
          return;
        }
        var user_id = this.loginForm.username
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result.split(',')[1]; // 去除前缀信息
          this.$socket.emit('changeAvatarRequest', user_id, imageData);
        };
        reader.readAsDataURL(file);
        // // 图片压缩
        // compressImage(file, maxWidth, maxHeight, quality, function(compressedDataURL) {
        //   // 在这里可以使用压缩后的DataURL，例如显示在<img>元素中
        //   const imgElement = document.getElementById('compressedImg');
        //   imgElement.src = compressedDataURL;

        //   var user_id = this.loginForm.username
        //   const reader = new FileReader();
        //   reader.onload = () => {
        //     const imageData = reader.result.split(',')[1]; // 去除前缀信息
        //     this.$socket.emit('changeAvatarRequest', user_id, imageData);
        //   };
        //   reader.readAsDataURL(file);
        // });
        // alert("get it");
        

        // this.$socket.emit('changeAvatarRequest', user_id, file);

        // 处理返回事件
        this.sockets.subscribe('changeAvatar', (newAvatar) => {
          this.myAvatar = newAvatar;
          
        });
      },
      // 压缩图片函数
    compressImage(file, maxWidth, maxHeight, quality, callback) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 计算压缩后的宽度和高度
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          // 在canvas上绘制压缩后的图片
          ctx.drawImage(img, 0, 0, width, height);

          // 将canvas上的图片转为压缩后的DataURL
          const compressedDataURL = canvas.toDataURL('image/jpeg', quality / 100);

          // 调用回调函数传递压缩后的DataURL
          callback(compressedDataURL);
        };
      };
      reader.readAsDataURL(file);
    },

    // CCC1 添加好友
    addFriend(){
      // alert('add')
      this.$socket.emit('addFriend', 
      {user_id: this.loginForm.username,
      friend_id: this.searchInput}
      );
      
      this.sockets.subscribe('addFriendFail', () => {
        alert("用户不存在！");
      });
      this.sockets.subscribe('addFriendSuccess', (contact, pci) => {
        this.$socket.emit('requestContacts', (this.loginForm.username))
      });

      this.searchInput = ''
    },

    // CCC2 申请好友
    applyFriend(){
      if (this.searchInput == this.loginForm.username){
            console.log("不能添加自己")
            return
      }
      this.$socket.emit('sendAppMsg', 
        {
          sender_id: this.loginForm.username,
          receiver_id: this.searchInput,
          send_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
          application_state: 0,
        }
      );
      this.sockets.subscribe('applyFriendFail', () => {
        alert("用户不存在！");
      });
      this.searchInput = ''
    },

    // 获取申请消息另一方的用户id
    getApplyUser(appmsg) {
      if (appmsg.sender_id == this.loginForm.username)
        return appmsg.receiver_id
      else
        return appmsg.sender_id
    },

    getApplyTime(appmsg) {
      var msg_time = new Date(Date.parse(appmsg.send_time))
      return `${msg_time.getFullYear()}-${msg_time.getMonth()+1}-${msg_time.getDate()}`
    },

    getApplyState(appmsg) {
      if (appmsg.application_state == 0)
        return "待处理"
      else {
        if (appmsg.application_state == -1)
          return "已拒绝"
        else 
          return "已通过"
      }
    },

    appAccept(appmsg) {
      this.$socket.emit('appAccept', appmsg.message_id, this.loginForm.username, this.getApplyUser(appmsg))
      // this.$set(this.acceptedStatus, appmsg.message_id, newstatus);
    },

    appReject(appmsg) {
      this.$socket.emit('appReject', appmsg.message_id, this.loginForm.username, this.getApplyUser(appmsg))
      // this.$set(this.acceptedStatus, appmsg.message_id, newstatus);
    },

    // CCC1 删除好友
    deleteFriend(friend) {
      event.preventDefault();
      const confirmed = confirm('确认删除该好友吗?这将清除所有的聊天记录！');
      if (confirmed) {
        // 执行删除操作
        this.chatfriend = friend;
        this.$socket.emit('deleteFriend', friend.chat_id,this.loginForm.username, friend.friend_id);
        
        this.sockets.subscribe('deleteFriendSuccess', () => {
          // alert("删除成功！");
          this.$socket.emit('requestContacts', (this.loginForm.username))
        });
      } else {
        // 用户点击取消，不执行删除操作
      }
      

    },
  }
} 
  </script>
  
  <style lang="scss" scoped>
  .main-box {
    display: flex;
    justify-content: center;
    align-items: center;
    // margin: auto;
    // position: relative;
    position: absolute;
    border-radius: 10px;
    top: 42.4%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 800px;
    height: 700px;
    // padding: 25px;
    background-color: #ecf0f3;
    box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
    border-radius: 12px;
    overflow: hidden;
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      // margin-top: 200px;
      
      top: 0;
      width: 800px;
      height: 100%;
      padding: 0px;
      background-color: #ecf0f3;
      // background-color: #05000b;

      transition: all 1.25s;
      form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        color: #a0a5a8;
        .title {
          text-align: center;
          font-size: 34px;
          font-weight: 700;
          // line-height: 3;
          color: #181818;
        }
        .text {
          margin-top: 30px;
          margin-bottom: 12px;
        }
        .form__input {
          width: 250px;
          height: 40px;
          margin: 4px 0;
          padding-left: 25px;
          font-size: 13px;
          letter-spacing: 0.15px;
          border: none;
          outline: none;
          background-color: #ecf0f3;
          transition: 0.25s ease;
          border-radius: 8px;
          box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
        }
      }
    }
    .container-register {
      z-index: 100;
      // margin-right: 0px;
    }
    .container-login {
      z-index: 0;
      margin-left: 0px;
    }
    .is-hidden{
      opacity: 0;
    }
    .is-txl {
      left: 0;
      transition: 1.25s;
      transform-origin: right;
    }
    .is-z200 {
      z-index: 200;
      transition: 1.25s;
    }
    .switch {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 400px;
      // padding: 50px;
      z-index: 200;
      // border-radius: 2px;
      transition: 1.25s;
      background-color: #0e9747;
      overflow: hidden;
      box-shadow: 4px 4px 10px #9a9da0, -4px -4px 10px #9a9da0;
      color: #a0a5a8;
      .switch__circle {
        position: absolute;
        width: 400px;
        height: 500px;
        border-radius: 50%;
        background-color: #ecf0f3;
        box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
        bottom: -60%;
        left: -60%;
        transition: 1.25s;
      }
      .switch__circle_top {
        top: -30%;
        left: 60%;
        width: 400px;
        height: 300px;
      }
      .switch__container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        width: 400px;
        padding: 50px 55px;
        transition: 1.25s;
        h2 {
          font-size: 34px;
          font-weight: 700;
          line-height: 3;
          color: #181818;
        }
        p {
          font-size: 14px;
          letter-spacing: 0.25px;
          text-align: center;
          line-height: 1.6;
        }
      }
    }
    .login {
      left: calc(100% - 400px);
      .switch__circle {
        left: 0;
      }
    }
    .primary-btn {
      width: 180px;
      height: 50px;
      border-radius: 25px;
      margin-top: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 14px;
      letter-spacing: 2px;
      background-color: #4b70e2;
      color: #f9f9f9;
      cursor: pointer;
      // box-shadow: 2px 2px 4px #a9a9a9, -2px -2px 4px #a9a9a9;
    }

  }

  .fade-enter-active,.fade-leave-active {
  transition: opacity 1s;
}

  .fade-enter,.fade-leave-to {
  opacity: 0;
}
  .container {
  display: flex;
  width: 50%;
  margin: auto;
  /* padding: 10px; */
  height: 700px;
  border-radius: 10px;
  /* align-items: center; */
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.box {
  /* border: 1px solid black; */
  padding: 0px;
  height: 700px;
}
.verboxleft{
  background-color: #2e2e2e;
  flex: 1;
  border-radius: 5px;
  background-image: url('./images/星空.png');
  background-size: cover;
}
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
.avatar {
  width: 50px;
  height: 50px;
  /* border-radius: 50%; */
  /* background-color: #ccc; */
  /* object-fit: cover; */
}
.userinfo-dialog .el-dialog{
  border-radius: 10px;
}
.image-dialog {
  max-width: 30%;
  max-height: 30%;
}
.image-text {
  overflow: hidden;
  border-bottom:1px solid #d8d7d6;
}
.image-text .image-dialog {
  float: left;
  margin-right: 10px;
}
.btn-dialog{
  border-top:1px solid #d8d7d6;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}
.btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn{
  margin-top: 20px;
  /* margin-right: 10px;
  margin-left: 10px; */
  width: 60px;
  height: 60px;
  background-color: #2e2e2e;
}
.verboxmid{
  display: flex;
  flex-direction: column;
  background-color: #e6e5e4;
  flex: 5;
}
.verboxmidtop{
  display: flex;
  align-items: center;
  background-color: #f7f7f7;
  height: 50px;
  border-right:1px solid #d8d7d6;
  border-bottom:1px solid #d8d7d6;
}
.search-input {
  flex: 1;
  height: 20px;
  padding: 5px;
  border-radius: 10px;
  margin-left: 5px;
  margin-top: 10px;
  margin-right: 3px;
  /* margin-right: 10px; */
  border: none;
  background-color: #e2e2e2;
}
.verboxmidbottom{
  background-color: #e6e5e4;
  height: 650px;
  border-top:1px solid #d8d7d6;
}
.scroll-content {
  height: 650px;
  overflow: auto;
}
.msg-container {
  display: flex;
  flex-direction: column;
}
.right{
  align-self: flex-end;
}
.left{
  align-self: flex-start;
}
.message-left {
  float: left;
  margin-right: 10px;
}
.message-right {
  float: right;
  margin-left: 10px;
}
.divider {
  margin-top: 10px;
  border-bottom: 1px solid #ededed;
  margin-bottom: 0px;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #c4c0bf;
  border-radius: 3px;
}
::-webkit-scrollbar-track {
  background-color: #e6e5e4;
}
.verboxright{
  background-color: #f5f5f5;
  flex: 12;
}
.verboxrighttop{
  background-color: #f5f5f5;
  height: 50px;
  /* box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3); */
  border-bottom:1px solid #efefef;
}
.verboxrightmid{
  background-color: #f5f5f5;
  height: 490px;
  /* box-shadow: 0px 0.5px 4px rgba(0, 0, 0, 0.3); */
  border-top:1px solid #efefef;
  border-bottom:1px solid #efefef;
  overflow: auto;
}
.verboxrightbottom{
  display:flex;
  background-color: #f5f5f5;
  height: 160px;
  /* box-shadow: 0px 0.5px 4px rgba(0, 0, 0, 0.3); */
  border-top:1px solid #efefef;
  flex-direction: column;
}
.btn-group {
  display: flex;
  /* justify-content: space-between; */
  justify-content: flex-start;
  margin-left: 20px;
  margin-right: 20px;
}
/* .btn2 {
  margin-right: 5px;
  margin-left: 5px;
} */
.text-input{
  flex: 1;
  height: 30px;
  padding: 5px;
  border-radius: 5px;
  /* margin: 10px; */
  margin-right: 5px;
  margin-left: 5px;
  margin-bottom: 5px;
  /* background-color: #fff; */
  border:none;
  background-color: #f5f5f5;
}
input:focus {
  // border: 2px solid blue;
  outline: none;
}
.send-btn {
  display: flex;
  justify-content: flex-end;
}
.btn3{
  width: 20%;
  height: 30px;
  border: none;
  border-radius: 5px;
  margin-bottom: 8px;
  margin-right: 25px;
  background-color: #e9e9e9;
}

  </style>
  
  