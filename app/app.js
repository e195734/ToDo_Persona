const express = require('express');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({ //mysql接続の初期化
  host: 'localhost',
  user: 'root',　//dbのuser
  password: 'EW4bH2hq',//dbのpassword
  database: 'test'//database
});

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/todo', (req, res) => {
  connection.query(
    'SELECT * FROM ToDoList', 
    (error, results,fields) => {
      res.render('todo.ejs',{ToDoList:results});//ejsに値を渡してhtmlを生成
      //console.log(results);
      //console.log(error);
      //console.log(fields);
    }
  );
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.listen(3000);

