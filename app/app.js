const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt');
var session = require('express-session');
const ejs = require('ejs');

login_flag = false;
drop_tList_flag = false; 

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
  password: 'EW4bH2hq',//dbのpassword   ローカル環境の設定から元に戻してgitに上げるのを忘れないように！！！！EW4bH2hq
  database: 'ToDoListt'//database   ここもToDoListに変えてからgitにあげな！！！
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
  if(typeof req.session.username !== 'undefined'){
    res.redirect('/')
  }else{
    if(typeof login_log === 'undefined'){
      res.render('login.ejs');
    }else{
      res.render('login.ejs',{l_log:login_log});
    }
  }
});

app.post('/login_account',(req,res) => {
  var_sql_login = "select * from ManageAccount where user_id=?;";
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

app.get('/logout_account',(req,res) => {
  req.session.destroy(function (err){
    console.log('logout!');
  });
  login_flag = false;
  res.redirect('/');
});

app.post('/add_tList',tlist_add1,tlist_add2);
function tlist_add2(req,res){
  console.log(add_list_id);
  tlist_ad_sql = 'INSERT INTO ManageLists value (?)';
  tlist_ad_val = [req.session.username, add_list_id, add_list_n];
  connection.query(tlist_ad_sql,[tlist_ad_val],(error,result) => {
    if(error){
      console.log('error -> add tlist to MagageLists');
      console.log(error);
    }
    if(result){
      console.log('add tlist to MagageLists');
    }
    res.redirect('/todo');
  });
}
function tlist_add1(req,res,next){
  if(req.body.tlist != null){
    add_list_n = req.body.tlist;
    add_list_id = req.body.tlist+'_'+req.session.username;
    add_list_id = add_list_id.replace(/'/g,'');
  }
  create_tlist = 'create table '+add_list_id+'(todo_id int not null primary key auto_increment,todo varchar(100) not null, description varchar(200), label varchar(100))';
  connection.query(create_tlist,(error,results) => {
    console.log(error);
    console.log(results);
    if(error){
      console.log('create_tlist error!')
      console.log(error);
      res.redirect('/todo');
    }
    if(results){
      next();
    }
  });
}

app.post('/drop_tList',tlist_dlt1,tlist_dlt2);
function tlist_dlt2(req,res){
  tlist_drop_sql = 'delete from ManageLists where list_id=?';
  connection.query(tlist_drop_sql,[drop_listid],(error,result) => {
    if(error){
      console.log('error -> delete tlist at MagageLists');
      console.log(error);
    }
    if(result){
      console.log('delete tlist at MagageLists');
    }
    drop_tList_flag = true;
    res.redirect('/todo');
  });
}
function tlist_dlt1(req,res,next){
  drop_listid = req.body.c_list+'_'+req.session.username;
  drop_listid = drop_listid.replace(/'/g,'');
  drop_tlist_sql = 'drop table '+drop_listid;
  drop_tlist_sql = drop_tlist_sql.replace(/'/g,'');

  connection.query(drop_tlist_sql,(error,results) => {
    console.log(error);
    console.log(results);
    if(error){
      console.log('drop_tlist error!')
      console.log(error);
      res.redirect('/todo');
    }
    if(results){
      next();
    }
  });
}


app.get('/todo',tp1,tp2,tp3);
function tp1(req,res,next){
  if(typeof req.session.username !== 'undefined'){
    next();
  }else{
    res.redirect('/');
  }
}
function tp2(req,res,next){
    var_todo_user_list = 'select * from ManageLists where user_id=?';
    connection.query(var_todo_user_list,req.session.username,(error, results) =>{
      user_todo_list = results;
      next();
    });
}
function tp3(req,res){
  if(typeof list_data === 'undefined' || drop_tList_flag == true){
    drop_tList_flag = false;
    res.render('todo.ejs',{u_todo_list:user_todo_list});
  }else{
    res.render('todo.ejs',{u_todo_list:user_todo_list,ToDo:list_data,NowList:list_n});
  }
}

app.post('/add_todo',todo_ad,todo_addl);
function todo_ad(req,res,next){
  todo_ad_sql = 'INSERT INTO '+connection.escape(listname)+' (todo,description,label) values (?)';
  todo_ad_sql = todo_ad_sql.replace(/'/g,'');
  todo_ad_val = [req.body.todo, req.body.description, req.body.label];
  connection.query(todo_ad_sql,[todo_ad_val],(error,results)=>{
    next();
    console.log(error);
    console.log(req.body.todo);
  });
}

app.post('/delete_todo',todo_dlt,todo_addl);
function todo_dlt(req,res,next){
  todo_dlt_sql = 'DELETE FROM '+connection.escape(listname)+' WHERE todo_id=?';
  todo_dlt_sql = todo_dlt_sql.replace(/'/g,'');
  connection.query(todo_dlt_sql,[req.body.todo_id],(error,results)=>{
    next();
    console.log(error);
    console.log(req.body.todo_id);
  });
}

app.post('/todo_choise_list',todo_addl);
function todo_addl(req,res){
  if(req.body.c_list != null){
    list_n = req.body.c_list;
    listname = req.body.c_list+'_'+req.session.username;
    listname = listname.replace(/'/g,'');
  }
  var_todo = 'SELECT * FROM '+connection.escape(listname);
  var_todo = var_todo.replace(/'/g,'');
  connection.query(var_todo,(error, results,fields) => {
    list_data = results;
    res.redirect('/todo');
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
  var_sql_register = "insert into ManageAccount(user_id,user_name,mail_address,password) values (?);";
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

app.get('/logout', (req, res) => {
  if(typeof req.session.username !== 'undefined'){
    res.redirect('/')
  }else{
    res.render('logout.ejs');
  }
});


app.listen(3000);

