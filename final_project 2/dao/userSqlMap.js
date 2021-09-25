var userSqlMap = {
    add: 'insert into user(username, password) values(?, ?)',//注册时用
    getByUsername: 'select username, password,stopflag from user where username = ?',//登陆时用
    stop:'update user set stopflag = 1 where username = ?',//停用用户
    start:'update user set stopflag = 0 where username = ?'//启用用户
};

module.exports = userSqlMap;