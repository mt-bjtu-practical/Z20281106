const mysql = require('mysql')

const connectdb=()=>{
  var connection = mysql.createConnection({     
    host     : 'localhost',       
    user     : 'root',              
    password : '123456',       
    port: '3306',                   
    database: 'Chat' 
})
  return connection;
}
module.exports=connectdb;
