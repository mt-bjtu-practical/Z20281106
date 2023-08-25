var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fs = require('fs');
const db = require('./db/db.js')

// CCC
const conn = require('./db/config');
const { url } = require('inspector');
const connection = conn();
// const sharp = require('sharp');

const onlineUsers = new Map()


io.on('connection', function(socket) {
    console.log('A client connected: ', socket.id);

    // 注册
    socket.on('signup', function(data) {
        console.log("signup")
        // 连接数据库验证
        db.selectAll("select * from user where id = '" + data.id + "' ", (e, r) => {
            let tt = r.length;
            if (tt == 1) {
                console.log("ID已经被注册")
                socket.emit('signupFail')
            } else {
                let saveData = data
                //注册
                db.insertData('user', saveData, (e, r) => {
                    console.log('注册成功')
                    socket.emit('signupSuccess')

                })
            }
        })
    });

    //注销
    socket.on('cancelAccount', function(user_id) {
        db.deleteData("user", {id: user_id}, (e, r) => {
            console.log(e, r)
            console.log("注销账户：", user_id);
            delete onlineUsers[user_id];
            socket.emit("cancelAccountSuccess")

        })
    });

    //登录
    socket.on('login', function(data) {
        // 连接数据库验证
        let msg = '', resultData = '';
        db.selectAll("select * from user where id ='" + data.id + "' ", (e, r) => {
            let tt = r.length;
            if (tt == 0) {
                msg = "用户名不存在: " + data.id;
            } else if (data.password != r[0].password) {
                msg = "用户密码错误";
            } else {
                resultData = r[0];
                msg = "用户密码正确"
                console.log(typeof data.id)
                console.log(typeof resultData.id)
                onlineUsers.set(resultData.id, socket.id)
                console.log(onlineUsers)
            }
            console.log(msg);
            // CCC 需要将blob转换为base64
            var base64String
            if (resultData.avatar){
                const buffer = Buffer.from(resultData.avatar, 'binary'); 
                base64String = buffer.toString('base64');
            }
            else{
                base64String = null;
            }
            

            socket.emit('checkoutAnswer', {
                msg: msg,
                id: resultData.id,
                avatar: base64String,
                nickname: resultData.nickname,
            })
            // console.log(msg, resultData)
        })
    });

    //返回通讯录数据
    socket.on('requestContacts', (user_id)=>{
        let friends = [];
        // db.selectAll("call query_contacts('" + user_id + "') ", (e, res) => {
        //     // console.log(res);
        //     // console.log(r[0])
        //     friends.splice(0, friends.length);
        //     for (var i = 0; i < res[0].length; i++) {
        //         friends.push({
        //             friend_id: res[0][i].friend_id,
        //             avatar: null,
        //             remark: res[0][i].remark,
        //             chat_id: res[0][i].chat_id,
        //         })
        //     }
        //     socket.emit('returnContacts', friends)
        // })
        db.selectAll("select friend_id, avatar, remark, contacts.chat_id, last_msg_id, last_msg_time, last_msg " + 
                     "from contacts " + 
                     "LEFT JOIN view_pc_last_msg_info on contacts.chat_id = view_pc_last_msg_info.chat_id " +
                     "LEFT JOIN user on user.id = contacts.friend_id " + 
                     "where contacts.user_id ='" + user_id + "'  " , (e, res) => {
                // console.log(res);
                // console.log(r[0])
                if (e) console.log(e);
                friends.splice(0, friends.length);
                for (var i = 0; i < res.length; i++) {
                    // CCC 需要将blob转换为base64
                    var base64String
                    if (res[i].avatar){
                        const buffer = Buffer.from(res[i].avatar.data, 'binary'); 
                        base64String = buffer.toString('base64');
                    }
                    else{
                        base64String = null;
                    }
                    friends.push({
                        friend_id: res[i].friend_id,
                        avatar: base64String,
                        remark: res[i].remark,
                        chat_id: res[i].chat_id,
                        // CCC2 返回最新消息信息
                        last_msg_id: res[i].last_msg_id,
                        last_msg: res[i].last_msg,
                        last_msg_time: res[i].last_msg_time,
                    })
                }
                socket.emit('returnContacts', friends)
                console.log(user_id, "获取通讯录数据")
        })
    })

    //返回聊天数据
    socket.on('requestChats', (user_id)=>{
        let chats = [];
        // const sqlQuery = `
        //                 SELECT chat_with_id, remark, chat_id, last_msg_time, last_msg, avatar
        //                 FROM view_pc_outline, user
        //                 WHERE user_id = ? AND user.id = view_pc_outline.chat_with_id
        //                 `;
        const sqlQuery = `
                        SELECT chat_with_id, remark, chat_id, last_msg_time, last_msg
                        FROM view_pc_outline
                        WHERE user_id = ?
                        `;
        connection.query(sqlQuery, [user_id], (error, res, fields) => {
            if (error) {
                console.error('查询数据时出错：', error);
            } else {
                // 在这里处理查询结果 results
                console.log('查询结果：', res);
                chats.splice(0, chats.length);
                for (var i = 0; i < res.length; i++) {
                    // CCC 需要将blob转换为base64
                    var base64String
                    if (res[i].avatar){
                        const buffer = Buffer.from(res[i].avatar.data, 'binary'); 
                        base64String = buffer.toString('base64');
                    }
                    else{
                        base64String = null;
                    }
                    chats.push({
                        chat_with_id: res[i].chat_with_id,
                        remark: res[i].remark,
                        chat_id: res[i].chat_id,
                        last_msg_time: res[i].last_msg_time,
                        last_msg: res[i].last_msg,
                        avatar: base64String,
                    })
                }
                socket.emit('returnChats', chats)
            }
        });
        // db.selectAll("select chat_with_id, remark, chat_id, last_msg_time, last_msg" + 
        //             "from view_pc_outline" + 
        //             " where user_id ='" + user_id + "' ", (e, res) => {
        //     console.log(e)
        //     console.log(res);
        //     // console.log(r[0])
            
        // })
    })

    //返回聊天消息
    socket.on('requestMsgs', (chat_id)=>{
        let msgs = [];
        db.selectAll("select * from private_chat_message where chat_id ='" + chat_id + "' ", (e, res) => {
            // console.log(res);
            // console.log(r[0])
            msgs.splice(0, msgs.length);
            for (var i = 0; i < res.length; i++) {
                msgs.push({
                    message_id: res[i].message_id,
                    sender_id: res[i].sender_id,
                    send_time: res[i].send_time,
                    message_content: res[i].message_content,
                })
            }
            socket.emit('returnMsgs', msgs)
        })
    })

    //接收消息
    socket.on('sendMessage', (data)=>{
        db.insertData('private_chat_message', data, (e, r) => {
            console.log('消息发送成功')
            console.log(data, r, e)
            data.message_id = r.insertId
            socket.emit('receiveMessage', [data])
            if(io.sockets.connected[onlineUsers.get(data.receiver_id)]){
                console.log('sendMessage: receiver online!')
                io.sockets.connected[onlineUsers.get(data.receiver_id)].emit(
                    'receiveMessage', 
                    [data])
            }
        })
    })

    // 初始化，用于和用户本地数据库做初始同步
    socket.on('initContacts', (user_id)=>{
        let friends = [];
        // db.selectAll("select * from contacts where user_id ='" + user_id + "' ", (e, res) => {
        //     friends.splice(0, friends.length);
        //     console.log(res[0])
        //     for (var i = 0; i < res.length; i++) {
        //         friends.push({
        //             friend_id: res[i].friend_id,
        //             avatar: null,
        //             remark: res[i].remark,
        //             chat_id: res[i].chat_id,
        //         })
        //     }
        //     socket.emit('initContactsReturn', friends)
        // })
        db.selectAll("call query_contacts('" + user_id + "') ", (e, res) => {
            // console.log(res);
            // console.log(r[0])
            friends.splice(0, friends.length);
            for (var i = 0; i < res[0].length; i++) {
                friends.push({
                    friend_id: res[0][i].friend_id,
                    avatar: null,
                    remark: res[0][i].remark,
                    chat_id: res[0][i].chat_id,
                })
            }
            socket.emit('initContactsReturn', friends)
        })
    })

    socket.on('initPCI', (user_id)=>{
        let PCI = [];
        db.selectAll("select * from private_chat_info where user_id ='" + user_id + "' ", (e, res) => {
            // console.log(res);
            // console.log(r[0])
            // console.log(res[0])
            PCI.splice(0, PCI.length);
            for (var i = 0; i < res.length; i++) {
                PCI.push({
                    chat_with_id: res[i].chat_with_id,
                    chat_id: res[i].chat_id,
                    do_not_disturb: res[i].do_not_disturb,
                })
            }
            socket.emit('initPCIReturn', PCI)
        })
    })

    socket.on('initPCM', (chat_id)=>{
        let PCM = [];
        db.selectAll("select * from private_chat_message where chat_id ='" + chat_id + "' ", (e, res) => {
            PCM.splice(0, PCM.length);
            
            for (var i = 0; i < res.length; i++) {
                PCM.push({
                    message_id: res[i].message_id,
                    chat_id: res[i].chat_id,
                    sender_id: res[i].sender_id,
                    receiver_id: res[i].receiver_id,
                    send_time: res[i].send_time,
                    message_content: res[i].message_content,
                })
            }
            console.log(PCM)
            socket.emit('initPCMReturn', PCM)
        })
    })

    // 用户登录时申请消息同步
    socket.on('msgSynchronize', (chat_id, last_msg_id) =>{
        let msgs = [];
        db.selectAll("select * from private_chat_message where chat_id ='" + chat_id + "' ", (e, res) => {
            // console.log(res);
            // console.log(r[0])
            msgs.splice(0, msgs.length);
            for (var i = res.length-1; i >= 0; i--) {
                if(res[i].message_id > last_msg_id){
                    msgs.push(res[i])
                }
                else{
                    break;
                }
            }
            console.log("msgSyn", msgs)
            msgs.reverse();
            console.log("msgSyn", msgs)
            socket.emit('receiveMessage', msgs)
        })
    })

    //修改昵称
    socket.on('changeNickname', (user_id, new_nickname)=> {
        // 连接数据库验证
        db.updateData('user', {nickname: new_nickname}, {id: user_id}, (e, r) => {
            console.log('昵称修改成功')
        })
    })
    
    // 查询个人信息
    socket.on('updatePersonalInfo', (user_id) =>{
        db.selectAll("select nickname from user where id ='" + user_id + "' ", (e, res) => {
            socket.emit('updatePersonalInfoReturn', {
                nickname: res[0].nickname, 
            })
        })
    })

    // 添加好友
    socket.on('addFriend', (data)=> {
        // 连接数据库验证
        console.log('add')
        let msg = '', resultData = '';
        db.selectAll("select * from user where id ='" + data.friend_id + "' ", (e, r) => {
            let tt = r.length;
            if (tt == 0) {
                msg = "用户不存在";
                socket.emit('addFriendFail');
            } else {
                resultData = r[0].id;
                db.insertData('private_chat', {user1_id: data.user_id, user2_id: data.friend_id}, (e, r) => {
                    console.log('添加成功')
                    let contact = {}, pci = {};
                    // 新的通讯录信息
                    db.selectAll("select * from contacts where user_id ='" + data.user_id + "' and " + 
                                                            "friend_id ='" + data.friend_id + "' ", (e, res) => {
                        contact = res[0];
                        // 新的聊天信息
                        db.selectAll("select * from private_chat_info where user_id ='" + data.user_id + "' and " + 
                                                                        "chat_with_id ='" + data.friend_id + "' " , (e, res) => {
                                pci = res[0];
                                console.log(contact, pci);
                                socket.emit('addFriendSuccess', contact, pci)
                        })
                    })
                })
            }
        })
    })

    socket.on('deleteFriend', function(chat_id, user_id, friend_id) {
        // var sql = `DELETE FROM contacts WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`;
        // connection.query(sql, [user_id, friend_id, friend_id, user_id], (error, results, fields) => {
        //     console.log(error)
        //     sql =  `DELETE FROM private_chat_info WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`;
        //     connection.query(sql, [user_id, friend_id, friend_id, user_id], (error, results, fields) => {
        //         console.log(error)
        //         sql =  `DELETE FROM private_chat_info WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`;
        //         connection.query(sql, [user_id, friend_id, friend_id, user_id], (error, results, fields) => {
        //             console.log(error)
                    
        //         });
        //     });

        // });
        var sql =  `DELETE FROM private_chat_info WHERE chat_id = ?`;
        connection.query(sql, [chat_id], (error, results, fields) => {
            console.log(error)
            var sql =  `DELETE FROM contacts WHERE chat_id = ?`;
            connection.query(sql, [chat_id], (error, results, fields) => {
                console.log(error)
                var sql =  `DELETE FROM private_chat_message WHERE chat_id = ?`;
                connection.query(sql, [chat_id], (error, results, fields) => {
                    console.log(error)
                    var sql =  `DELETE FROM private_chat WHERE chat_id = ?`;
                    connection.query(sql, [chat_id], (error, results, fields) => {
                        console.log(error)
                        socket.emit('deleteFriendSuccess');
                    });
                });
            });
        });
        
    });


    // CCC 修改头像
    socket.on('changeAvatarRequest', function(user_id, new_avatar) {
        console.log('change avatar')
        const avatarData =  Buffer.from(new_avatar ,'base64');
        const sql = 'UPDATE user SET avatar = ? WHERE id = ?';
        connection.query(sql, [avatarData, user_id], (error, results, fields) => {
            console.log(error)
            socket.emit('changeAvatar', new_avatar);
          });
    });

    // CCC3 好友申请
    // 处理用户发出的好友申请消息
    socket.on('sendAppMsg', (data)=>{
        db.selectAll("select * from user where id ='" + data.receiver_id + "' ", (e, r) => {
            let tt = r.length;
            if (tt == 0) {
                socket.emit('applyFriendFail');
            } else {
                db.insertData('application_message', data, (e, r) => {
                    if (e) console.log(e);
                    console.log('申请消息发送成功')
                    // console.log(data, r, e)
                    data.message_id = r.insertId
                    socket.emit('receiveAppMsg', [data])
                    if(io.sockets.connected[onlineUsers.get(data.receiver_id)]){
                        console.log('sendAppMsg: receiver online!')
                        io.sockets.connected[onlineUsers.get(data.receiver_id)].emit(
                            'receiveAppMsg', 
                            [data])
                    }
                })
            }
        })
        
    })

    socket.on('requestAppMsgs', (user_id)=>{
        console.log('用户', user_id, '请求好友申请消息')
        let appMsgs = []
        db.selectAll("select * " + 
                    " from application_message " + 
                    " where receiver_id ='" + user_id + 
                    "' or sender_id ='" + user_id + "' " , (e, res) => {
            console.log(res);
            // console.log(r[0])
            if (e) console.log(e);
            appMsgs.splice(0, appMsgs.length);
            for (var i = 0; i < res.length; i++) {
                appMsgs.push({
                    message_id: res[i].message_id,
                    sender_id: res[i].sender_id,
                    receiver_id: res[i].receiver_id,
                    send_time: res[i].send_time,
                    message_content: res[i].message_content,
                    application_state: res[i].application_state,
                })
            }
            socket.emit('returnAppMsgs', appMsgs)
        })
    })

    // 申请通过
    socket.on('appAccept', (message_id, user_id, friend_id)=>{
        db.updateData('application_message', {application_state: 1}, {message_id: message_id}, (e, r) => {
            if (e) console.log(e);
            console.log('申请通过')
            db.insertData('private_chat', {user1_id: user_id, user2_id: friend_id}, (e, r) => {
                if (e) console.log(e);
                console.log('添加成功')
                // 更新通讯录和申请消息列表
                socket.emit('update')
                if(io.sockets.connected[onlineUsers.get(friend_id)]){
                    console.log('appAccept: receiver online!')
                    io.sockets.connected[onlineUsers.get(friend_id)].emit('update')
                }
            })
        })
        
    })

    socket.on('appReject', (message_id, user_id, friend_id)=>{
        db.updateData('application_message', {application_state: -1}, {message_id: message_id}, (e, r) => {
            if (e) console.log(e);
            console.log('申请拒绝')
            // 更新通讯录和申请消息列表
            socket.emit('update')
            if(io.sockets.connected[onlineUsers.get(friend_id)]){
                console.log('appAccept: receiver online!')
                io.sockets.connected[onlineUsers.get(friend_id)].emit(update)
            }
        })
        
    })

    socket.on('disconnect', function() {
        console.log('A client disconnected: ', socket.id);
    });

    
});

http.listen(8081, function() {
    console.log('Server is running');
});
