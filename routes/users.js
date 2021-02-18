var express = require('express');
var router = express.Router();
const querySql = require('../db/index')
const {PWD_SALT, PRIVATE_KEY, EXPIRED} = require('../utils/constant')
const {md5} = require('../utils/index')
const jwt = require('jsonwebtoken')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* 注册 */
router.post('/register', async(req, res, next) => {
  let {username, password, nickname} = req.body
  try {
    let user = await querySql('select * from user where username = ?', [username])
    console.log(res)
    if(!user || user.length === 0){
      password = md5(`${password}${PWD_SALT}`)
      console.log('加密后的password为:  ', password)
      await querySql('insert into user(username, password, nickname) value(?, ?, ?)', [username, password, nickname])
      res.send({code:0, msg: '注册成功'})
    }
    else {
      res.send({code: -1, msg: '该账号已注册'})
    }
  }
  catch(e){
    console.log(e)
    next(e)
  }
});

//登录接口
router.post('/login', async (req, res, next) => {
  let {username, password} = req.body
  try {
    let user = await querySql('select * from user where username = ?', [username])
    console.log(res)
    if(!user || user.length === 0){
      res.send({code:-1, msg: '该账号不存在'})
    }
    else {
      password = md5(`${password}${PWD_SALT}`)
      let result = await querySql('select * from user where username = ? and password = ?', [username, password])
      if(!result || result.length === 0){
        res.send({code:-1, msg: '密码错误'})
      }
      else {
        let token = jwt.sign({username}, PRIVATE_KEY, {expiresIn:EXPIRED})
        res.send({code:0, msg: '登录成功', token: token})
      }
    }
  }
  catch(e){
    console.log(e)
    next(e)
  }
})

//获取用户信息接口
router.get('/info',async(req,res,next) => {
  let {username} = req.user
  try {
    let userinfo = await querySql('select nickname,head_img from user where username = ?',[username])
    res.send({code:0,msg:'成功',data:userinfo[0]})
  }catch(e){
    console.log(e)
    next(e)
  } 
})

module.exports = router;
