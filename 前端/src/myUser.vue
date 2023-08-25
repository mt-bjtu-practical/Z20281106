<template>
    <div class="container" style="display: block;" v-show="false">
      <!-- 用户列表 -->
      <div class="user-list">
        <div class="header">
          <div class="avatar">
            <img class="img avatar_url" src="images/avatar2.jpg" alt="" />
          </div>
          <div class="info">
            <!--  -->
            <h3 class="username">清流</h3>
          </div>
        </div>
        <div class="title">
          <h3>通讯录</h3>
          <input type="text" placeholder="id" id="friend_id" />
          <button class="weui-btn" id="addBtn">添加朋友</button>
        </div>
        <ul id="contacts">
          <li class="user">
            <div class="avatar"><img src="images/avatar2.jpg" alt="" /></div>
            <div class="name">清流</div>
          </li>
        </ul>
      </div>
      <!-- 聊天主窗口 -->
      <div class="box">
        <!-- 聊天窗口头部 -->
        <div class="box-hd">
          <h3><span id="chat_with"></span></h3>
        </div>
  
        <!-- 聊天窗口主体区域 -->
        <div class="box-bd">
          <!--
          <div class="system">
            <p class="message_system">
              <span class="content">"往事随风"邀请你和"Boy"加入了群聊</span>
            </p>
          </div>
          <div class="message-box">
            <div class="my message">
              <img class="avatar" src="images/avatar2.jpg" alt="" />
              <div class="content">
                <div style="margin-bottom: 3px;margin-right: 3px;">20/06/12 10:39</div>
                <div class="bubble">
                  <div class="bubble_cont">在干嘛</div>
                </div>
              </div>
            </div>
          </div>
          <div class="message-box">
            <div class="other message">
              <img class="avatar" src="images/avatar02.jpg" alt="" />
              <div class="content">
                <div style="margin-bottom: 3px;margin-right: 3px;">20/06/12 10:39</div>
                <div class="nickname">小美 <span>20/06/12 10:40</span></div>
                <div class="bubble">
                  <div class="bubble_cont">吃饭</div>
                </div>
              </div>
            </div>
          </div>
          -->
        </div>
  
        <!-- 聊天窗口底部区域 -->
        <div class="box-ft">
          <!-- 工具栏 -->
          <div class="toolbar">
            <a href="javascript:;" title="表情" class="face"></a>
            <a href="javascript:;" title="截屏" class="screen-cut">
            </a>
            <a href="javascript:;" title="图片" class="file">
              <label for="file"></label>
              <input type="file" id="file" style="display: none;" />
            </a>
          </div>
          <!-- 内容输入区域 -->
          <div class="content">
            <!-- div添加一个属性：contenteditable 可编辑div文本内容-->
            <div class="text" id="content" contenteditable></div>
          </div>
          <!-- 发送按钮 -->
          <div class="action">
            <span class="desc">按下Alt+Enter发送</span>
            <!-- 给a标签加一个空js，消除a默认的返回顶部效果 -->
            <a class="btn-send" id="btn-send" href="javascript:;">发送</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    // Component logic goes here
  }
  </script>
  
  <style scoped>
  </style>
  