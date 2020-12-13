const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt');
var session = require('express-session');
const ejs = require('ejs');

login_flag = false;

app.set('trust proxy', 1);
app.set('ejs',ejs.renderFile);
app.use(express.static('public'));

app.use(session({ //sessionの設定
  secret: 'toudou',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxage: 1000 * 60 * 30
  }
}));

const connection = mysql.createConnection({ //mysql接続の初期化
  host: 'localhost',
  user: 'root',　//dbのuser
  password: 'EW4bH2hq',//dbのpassword
  database: 'test'//database
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  if(typeof login_flag == false){
    res.render('index.ejs');
  }else{
    res.render('index.ejs',{uid:req.session.username});
  }
});

app.get('/login', (req, res) => {
  if(typeof login_log === 'undefined'){
    res.render('login.ejs');
  }else{
    res.render('login.ejs',{l_log:login_log});
  }
});

app.post('/login_account',(req,res) => {
  var_sql_login = "select * from account_test where user_id=?;";
  var_value_login = [req.body.userid];
  connection.query(var_sql_login,var_value_login,(error,results)=>{
    if(results.length == 0){
      login_log = 'ユーザIDを間違えています．';
    }else{
      if(bcrypt.compareSync(req.body.password, results[0].password) == true){
        login_log = 'ログイン！'
        login_flag = true;
        req.session.username = req.body.userid;
        res.redirect('/');
      }else{
        login_log = 'パスワードが違います！'
      }
    }
    if(login_flag == false){
      res.redirect('/login');
    }
  });
});

app.get('/logout',(req,res) => {
  req.session.destroy(function (err){
    console.log('logout!');
  });
  login_flag = false;
  res.redirect('/');
});


app.get('/todo',tp1,tp2,tp3);
function tp1(req,res,next){
  if(typeof req.session.username !== 'undefined'){
    next();
  }else{
    res.redirect('/');
  }
}
function tp2(req,res,next){
    var_todo_user_list = 'select list_name from manage_ToDoList where user_id=?';
    connection.query(var_todo_user_list,req.session.username,(error, results) =>{
      user_todo_list = results;
      console.log(user_todo_list);
      next();
    });
}
function tp3(req,res){
  if(typeof list_data !== 'undefined'){
    console.log(list_data);
    res.render('todo.ejs',{u_todo_list:user_todo_list,ToDo:list_data});
  }else{
    res.render('todo.ejs',{u_todo_list:user_todo_list});
  }
}

app.post('/add_todo',todo_ad,todo_addl);
function todo_ad(req,res,next){
  todo_ad_sql = 'INSERT INTO '+connection.escape(listname)+' values (?)';
  todo_ad_sql = todo_ad_sql.replace(/'/g,'');
  connection.query(todo_ad_sql,[req.body.todo],(error,results)=>{
    next();
    console.log(error);
    console.log(req.body.todo);
  });
}

app.post('/delete_todo',todo_dlt,todo_addl);
function todo_dlt(req,res,next){
  todo_dlt_sql = 'DELETE FROM '+connection.escape(listname)+' WHERE todo=?';
  todo_dlt_sql = todo_dlt_sql.replace(/'/g,'');
  connection.query(todo_dlt_sql,[req.body.todo],(error,results)=>{
    next();
    console.log(error);
    console.log(req.body.todo);
  });
}

app.post('/todo_choise_list',todo_addl);
function todo_addl(req,res){
  if(req.body.c_list != null){
    listname = req.body.c_list;
  }
  var_todo = 'SELECT * FROM '+connection.escape(listname);
  var_todo = var_todo.replace(/'/g,'');
  connection.query(var_todo,(error, results,fields) => {
    list_data = results;
    res.redirect('/todo');
    console.log('---tcl---')
    console.log(error);
    console.log(results);
    console.log(listname);
    console.log(list_data);
    console.log('---end-cl---')
  });
}

app.get('/register', (req, res) => {
  if(typeof reg_log === 'undefined'){
    res.render('register.ejs');
  }else{
    res.render('register.ejs',{r_log:reg_log});
    reg_log = null;
  }
});

app.post('/register_account',(req,res) =>{
  pass_hash = bcrypt.hashSync(req.body.register_password, 10);
  var_sql_register = "insert into account_test (user_id,user_name,mail_address,password) values (?);";
  var_values_register = [req.body.register_userid, req.body.register_username, req.body.register_mail, pass_hash];
  connection.query(var_sql_register, [var_values_register],(error,results)=>{
    if(error){
      console.log(error.errno)
      if(error.errno == 1062){
        reg_log = 'そのユーザIDはすでに使用されています！';
      }
    }else{
      reg_log = '登録完了！';
    }
    res.redirect('/register')
  });
});

app.listen(3000);

