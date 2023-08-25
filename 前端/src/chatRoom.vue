<template>
  <div class="container">
    <div class="box verboxleft">
      <div class="avatar-container">
        <img src="./images/avatar01.jpg" alt="Avatar" class="avatar" @click="showInfoDialog = true">
        <el-dialog :visible.sync="showInfoDialog" width="20%" :top="'55px'" :before-close="handleClose" custom-class="userinfo-dialog">
          <div class="image-text">
            <img src="./images/avatar02.jpg" alt="tupian" class="image-dialog">
            <div class="text-dialog" style="font-size:20px;">Nikoname</div>
            <div class="text-dialog">Username</div>
            <div style="clear: both;"></div>
           </div>
          <div class="btn-dialog">
            <button class="btn0" style="margin-right: 10px;border-radius: 4px; border:none; padding:5px 40px; background-color: #25c672; color: #ffffff;font-size: 20px;">发消息</button>
            <el-button class="btn0" type="text" icon="el-icon-delete" style="font-size: 20px;" @click="deleteEvent"></el-button>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="showInfoDialog = false">取 消</el-button>
          <el-button type="primary" @click="showInfoDialog = false">确 定</el-button>
        </span>
        </el-dialog>
      </div>
      <dic class="btn-container">
        <el-button class="btn" type="text" icon="el-icon-chat-round" style="width:0px;height: 0px; font-size: 0px;"></el-button>
        <el-button class="btn" type="text" icon="el-icon-chat-round" style="font-size: 30px;"></el-button>
        <el-button class="btn" type="text" icon="el-icon-user" style="font-size: 30px;"></el-button>
        <el-button class="btn" type="text" icon="el-icon-setting" style="font-size: 30px;"></el-button>
      </dic>
    </div>
    <div class="box verboxmid">
      <div class="verboxmidtop">
        <input type="text" class="search-input" placeholder="搜索">
        <i class="el-icon-circle-plus-outline"></i>
      </div>
      <div class="verboxmidbottom">
        <div class="scroll-content">
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>
          <p>1</p>

        </div>
      </div>
    </div>
    <div class="box verboxright">
      <div class="verboxrighttop" style="font-size: 20px;">大家一起聊水群</div>
      <div class="verboxrightmid">bottom</div>
      <div class="verboxrightbottom">
        <div class="btn-group">
          <el-button class="btn2" type="text" icon="el-icon-orange" style="font-size: 25px;"></el-button>
          <el-button class="btn2" type="text" icon="el-icon-folder-opened" style="font-size: 25px;"></el-button>
          <el-button class="btn2" type="text" icon="el-icon-picture-outline" style="font-size: 25px;"></el-button>
          <el-button class="btn2" type="text" icon="el-icon-mic" style="font-size: 25px;"></el-button>
        </div>
        <input type="text" class="text-input" placeholder="输入文本">
        <div class="send-btn">
          <button class="btn3" style="color: #25c672;font-size: 16px;">发送(s)</button>
        </div>
        
      </div>
      
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showInfoDialog: false,
      };
    },
    mounted() {
      const dialog = document.querySelector('.el-dialog');

      if (dialog) {
        dialog.style.left = '-195px';
      }
    },
    methods: {
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
        })
      },

      requestContactsEvent () {
        var user_id = this.loginForm.username

        this.$socket.emit('cancelAccount', user_id)

        this.sockets.subscribe('cancelAccountSuccess',() => {
          alert("注销成功")
          // 缺：用户注销后跳转界面
        })
      },
    }
  }
</script>

<style>
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