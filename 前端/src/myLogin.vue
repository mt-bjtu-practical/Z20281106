<template>
  <div class="main_box">
    <div class="login_box" style="display: block;" v-show="showBox1">
      <div class="el-with-border">
        <el-form :label-position="labelPosition" label-width="50px" class="form-wrapper">
          <h2 class="title">Sign in to Website</h2>
          <el-form-item label="用户名">
            <!-- <el-input v-model="formLabelAlign.username" placeholder="name"></el-input> -->
            <input class="el-input" v-model="formLabelAlign.username" type="text" placeholder="name" />
          </el-form-item>
          <el-form-item label="密码">
            <!-- <el-input v-model="formLabelAlign.password" placeholder="password"></el-input> -->
            <input class="el-input" v-model="formLabelAlign.password" type="text" placeholder="password" />
          </el-form-item>
          <div class="button-container">
            <el-button type="primary" @click="loginEvent">登录</el-button>
            <el-button type="text" @click="registerEvent">没有账号？立即注册</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <div class="chatroom_box" v-show="showBox3">
        <div>
            <el-container>
            <el-header>CHAT
              <el-button style="float:right;line-height:0px;" icon="el-icon-more" circle></el-button>
            </el-header>
            </el-container>

            <el-container>
            <el-aside width="200px">
            <el-row class="tac">
            <el-col :span="24">
                <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">
                <el-menu-item index="1">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">user1</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">user2</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">user3</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">user4</span>
                </el-menu-item>
                </el-menu>
            </el-col>
            </el-row>

            </el-aside>
            <el-container>
            <el-main>Main</el-main>
            </el-container>

            </el-container>

            <el-container>
                <el-main style="background-color:#B3C0D1">
                    <el-button style="float:right;line-height: 0px;" type="primary" icon="el-icon-video-camera"></el-button>
                    <el-button style="float:right;line-height: 0px;margin-right: 5px;" type="primary" icon="el-icon-phone"></el-button>
                    <el-button style="float:left;line-height: 0px;" type="primary" icon="el-icon-picture"></el-button>
                    <el-button style="float:left;line-height: 0px;" type="primary" icon="el-icon-folder"></el-button>
                    <el-button style="float:left;line-height: 0px;" type="primary" icon="el-icon-scissors"></el-button>
                    <el-button style="float:left;line-height: 0px;" type="primary" icon="el-icon-chat-dot-round"></el-button>
                    <el-input name="sendmge" type="text"
                        placeholder="请输入内容"
                        v-model="input"
                        clearable>  
                    </el-input>
                    <el-button style="float: right;" type="success" plain>ENTER</el-button>
                </el-main>
            </el-container>
        </div>
    </div>

    <div class="register_box" v-show="showBox2">
      <div class="el-with-border">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="form-wrapper">
          <h2 class="title">Create Account</h2>
          <el-form-item label="用户名" prop="username">
          <!-- <el-input v-model.number="ruleForm.username"></el-input> -->
          <input class="el-input" v-model="ruleForm.username" type="text" placeholder="name" />
        </el-form-item>
          <el-form-item label="密码" prop="pass">
          <!-- <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input> -->
          <input class="el-input" v-model="ruleForm.pass" type="text" placeholder="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <!-- <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input> -->
          <input class="el-input" v-model="ruleForm.checkPass" type="text" placeholder="check password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        </el-form>
      </div>  
    </div>

    <!-- <div :class="['switch', { login: isLogin }]">
      <div class="switch__circle"></div>
      <div class="switch__circle switch__circle_top"></div>
      <div class="switch__container">
        <h2>{{ isLogin ? 'Hello Friend !' : 'Welcome Back !' }}</h2>
        <p>
          {{
            isLogin
              ? 'Enter your personal details and start journey with us'
              : 'To keep connected with us please login with your personal info'
          }}
        </p>
        <div class="primary-btn" @click="isLogin = !isLogin">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>

export default {
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
      // isLogin: true,
      showBox1: true,
      showBox2: true,
      showBox3: false,
      labelPosition: 'top',

      // 连接状态，初始未连接
      isConnected:false,
      formLabelAlign: {
        username: '',
        password: ''
    },
      ruleForm: {
          pass: '',
          checkPass: '',
          username: ''
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
        }
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
  },

  methods:{
    disconnect() {
      // 关闭WebSocket连接
      this.$socket.close(); 
      // 移除监听事件
      window.removeEventListener('beforeunload', this.disconnect); 
    },

    loginEvent () {
      var id = this.formLabelAlign.username
      var password = this.formLabelAlign.password
      this.$socket.emit('loginCheck', id, password)
      // 登陆失败
      this.sockets.subscribe('loginFail', (msg) => {
        console.log('loginFail', msg)
        alert(msg)
      })
      // 登陆成功
      this.sockets.subscribe('loginSucceed', (msg)=>{
        console.log(msg)
        // 将登录界面设置为隐藏，聊天室界面设置为显示
        this.showBox1=false
        this.showBox3=true
        alert(msg)
      })
    },

    registerEvent(){
      this.showBox1=false
      this.showBox2=true
    },

    submitForm(formName) {
      var id = this.ruleForm.username
      var password = this.ruleForm.pass

      this.$socket.emit('signupCheck', id, password)
      this.sockets.subscribe('signupFail', (msg) => {
        console.log('signupFail', msg)
        alert(msg)
      })
      // 登陆成功
      this.sockets.subscribe('signupSuccess', (msg)=>{
        console.log(msg)
        // 将注册界面设置为隐藏，登录界面设置为显示
        this.showBox2=false
        this.showBox1=true
        alert(msg)
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style lang="scss" scoped>
//   .main-box {
//   // display: flex;
//   // justify-content: center;
//   // align-items: center;
//   position: relative;
//   width: 1000px;
//   min-width: 1000px;
//   min-height: 600px;
//   height: 600px;
//   padding: 25px;
//   background-color: #ecf0f3;
//   box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
//   border-radius: 12px;
//   overflow: hidden;
//   .container {
//     // display: flex;
//     // justify-content: center;
//     // align-items: center;
//     position: absolute;
//     top: 0;
//     width: 600px;
//     height: 100%;
//     padding: 25px;
//     background-color: #ecf0f3;
//     transition: all 1.25s;
//     .form-wrapper {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       flex-direction: column;
//       width: 100%;
//       height: 100%;
//       color: #a0a5a8;
//       .title {
//         font-size: 34px;
//         font-weight: 700;
//         line-height: 3;
//         color: #181818;
//       }
//       .text {
//         margin-top: 30px;
//         margin-bottom: 12px;
//       }
//       .el__input {
//         width: 350px;
//         height: 40px;
//         margin: 4px 0;
//         padding-left: 25px;
//         font-size: 13px;
//         letter-spacing: 0.15px;
//         border: none;
//         outline: none;
//         background-color: #ecf0f3;
//         transition: 0.25s ease;
//         border-radius: 8px;
//         box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
//       }
//     }
//   }
//   .container-register {
//     z-index: 100;
//     left: calc(100% - 600px);
//   }
//   .container-login {
//     left: calc(100% - 600px);
//     z-index: 0;
//   }
//   .is-txl {
//     left: 0;
//     transition: 1.25s;
//     transform-origin: right;
//   }
//   .is-z200 {
//     z-index: 200;
//     transition: 1.25s;
//   }
//   .switch {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     position: absolute;
//     top: 0;
//     left: 0;
//     height: 100%;
//     width: 400px;
//     padding: 50px;
//     z-index: 200;
//     transition: 1.25s;
//     background-color: #ecf0f3;
//     overflow: hidden;
//     box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
//     color: #a0a5a8;
//     .switch__circle {
//       position: absolute;
//       width: 500px;
//       height: 500px;
//       border-radius: 50%;
//       background-color: #ecf0f3;
//       box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
//       bottom: -60%;
//       left: -60%;
//       transition: 1.25s;
//     }
//     .switch__circle_top {
//       top: -30%;
//       left: 60%;
//       width: 300px;
//       height: 300px;
//     }
//     .switch__container {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       flex-direction: column;
//       position: absolute;
//       width: 400px;
//       padding: 50px 55px;
//       transition: 1.25s;
//       h2 {
//         font-size: 34px;
//         font-weight: 700;
//         line-height: 3;
//         color: #181818;
//       }
//       p {
//         font-size: 14px;
//         letter-spacing: 0.25px;
//         text-align: center;
//         line-height: 1.6;
//       }
//     }
//   }
//   .login {
//     left: calc(100% - 400px);
//     .switch__circle {
//       left: 0;
//     }
//   }
//   .primary-btn {
//     width: 180px;
//     height: 50px;
//     border-radius: 25px;
//     margin-top: 50px;
//     text-align: center;
//     line-height: 50px;
//     font-size: 14px;
//     letter-spacing: 2px;
//     background-color: #4b70e2;
//     color: #f9f9f9;
//     cursor: pointer;
//     box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;

//   }
// }
  .el-with-border{
    display: flex;
    justify-content: center;
    height: 75vh;
    align-items: center;
  }

  /* 边框 */
  .form-wrapper {
    width: 1000px;
    height: 600px;
    border: 1px solid #ccc;
    padding: 40px;
    background-color: #ecf0f3;
  }
  /* 按钮居中 */
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

        .el__input {
        width: 350px;
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
</style>
