<template>
  <div class="register_box" v-show="showRegisterBox">
    <h3>用户注册</h3>
    <div>
      <div>ID</div>
      <input class="input" type="text" placeholder="id" v-model="register_id" /><br>
    </div>
    <div>
      <div>密码</div>
      <input class="input" type="text" placeholder="password" v-model="register_password" /><br>
    </div>
    <div id="sex">
      <div>性别</div>
      男&nbsp; <input type="radio" value="m" name="sex" v-model="sex" />&nbsp; &nbsp;
      女&nbsp; <input type="radio" value="f" name="sex" v-model="sex" />
    </div>
    <div>
      <div>头像</div>
      <ul id="register_avatar">
        <li v-for="(avatar, index) in avatars" :key="index" :class="{ 'now': selectedAvatar === index }">
          <img :src="'images/avatar' + (index + 1).toString().padStart(2, '0') + '.jpg'" alt="" @click="selectAvatar(index)" />
        </li>
      </ul>
    </div>
    <section class="button">
      <input type="button" value="注册" @click="register" /> &nbsp;
      <button @click="switchToLogin">登录</button>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showRegisterBox: false,
      register_id: "",
      register_password: "",
      sex: "",
      selectedAvatar: 0,
      avatars: [
        "avatar01.jpg",
        "avatar02.jpg",
        "avatar03.jpg",
        "avatar04.jpg",
        "avatar05.jpg",
        "avatar06.jpg",
        "avatar07.jpg",
        "avatar08.jpg",
        "avatar09.jpg",
        "avatar10.jpg"
      ]
    };
  },
  methods: {
    selectAvatar(index) {
      this.selectedAvatar = index;
    },
    register() {
      // 处理注册逻辑
    },
    switchToLogin() {
      
    }
  }
};
</script>

<style scoped>
.register_box {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 380px;
      height: 380px;
      transform: translate(-50%, -50%);
      border-radius: 4px;
      background-color: #fff;
      box-shadow: #999 0 2px 10px;
    }

    .register_box h3 {
      text-align: center;
      color: #333;
      font-size: 24px;
      font-weight: 400;
      margin: 15px auto;
    }

    .input {
      border: 1px solid #ccc;
      padding: 7px 0px;
      padding-left: 0px;
      border-radius: 3px;
      padding-left: 5px;
      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      -webkit-transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
      -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
      transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
      width: 200px;
    }

    .register_box>div {
      display: flex;
      margin-bottom: 15px;
    }

    .register_box div>div {
      display: inline-block;
      margin: 0 20px;
    }

    #register_avatar {
      width: 250px;
    }

    #register_avatar li {
      width: 46px;
      height: 46px;
      display: inline-block;
    }

    #register_avatar li img {
      width: 44px;
      height: 44px;
      margin: 2px;
    }

    .button {
      text-align: center;
    }

    .button #register {
      position: relative;
      display: inline-block;
      width: 200px;
      box-sizing: border-box;
      font-size: 14px;
      text-align: center;
      text-decoration: none;
      color: #ffffff;
      line-height: 2.55555556;
      border-radius: 5px;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      overflow: hidden;
      background-color: #66afe9;
      border: none;
      cursor: pointer;
      margin-top: 5px;
    }

    .button #register_login {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      font-size: 14px;
      text-align: center;
      text-decoration: none;
      color: #ffffff;
      line-height: 2.55555556;
      border-radius: 5px;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      overflow: hidden;
      border: none;
      cursor: pointer;
      margin-top: 5px;
      width: 50px;
      background-color: #cccccc;
      margin-right: -25px;
    }

    .register_box li.now img {
      border: 2px solid #1aad19;
    }

    .contacts li.now img {
      border: 2px solid #1aad19;
    }

.register_box {
  display: block;
}
</style>
