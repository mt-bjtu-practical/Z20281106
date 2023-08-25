const conn = require('./config');
const connection = conn();
// 查询所有数据
let selectAll = (sql,callback)=>{
  // console.log(sql);
  connection.query(sql,(err,result)=>{
    if(err){
        console.log('错误信息-',err.sqlMessage);
        let errNews = err.sqlMessage;
        callback(errNews,'');
        return;
    } 
    var string=JSON.stringify(result); 
    var data = JSON.parse(string);
    callback('',data);
  })
}
// 插入一条数据
let insertData = (table,datas,callback)=>{
  var fields='';
  var values='';
  for( var k in datas){
      fields+=k+',';
      values=values+"'"+datas[k]+"',"
  }
  fields=fields.slice(0,-1);
  values=values.slice(0,-1);
  var sql="INSERT INTO "+table+'('+fields+') VALUES('+values+')';
  // console.log(sql);
  connection.query(sql,callback);
}
// 更新一条数据
let updateData=function(table,sets,where,callback){
    var _SETS='';
    var _WHERE='';
    var keys='';
    var values='';
    for(var k in sets){
        _SETS+=k+"='"+sets[k]+"',";
    }
    _SETS=_SETS.slice(0,-1);
    for(var k2 in where){
      _WHERE+= k2+"='"+where[k2]+"',";
    }
    _WHERE=_WHERE.slice(0,-1);
    var sql="UPDATE "+table+' SET '+_SETS+' WHERE '+_WHERE;
    // console.log(sql);
    connection.query(sql,callback);
    // console.log(callback); 
}

// 删除一条数据
let deleteData=function(table,where,callback){
    var _WHERE='';
    for(var k2 in where){
      // _WHERE+= k2+"='"+where[k2]+"',";
      _WHERE+= `${k2}='${where[k2]}',`;
      console.log(_WHERE)
    }
    _WHERE = _WHERE.slice(0, -1);
    // var sql="DELETE FROM " + table + ' WHERE ' + _WHERE;
    var sql=`DELETE FROM ${table} WHERE ${_WHERE}`;
    console.log(sql)
    connection.query(sql,callback);
}


exports.selectAll = selectAll;
exports.insertData = insertData;
exports.deleteData = deleteData;
exports.updateData = updateData;
