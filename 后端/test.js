user_id = 'user'
friend_id = 'chat'
sql = "select * from private_chat_info where user_id ='" + user_id + "' and " + 
"chat_with_id ='" + friend_id + "' " 
console.log(sql);