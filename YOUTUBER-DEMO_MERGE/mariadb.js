// Get the client
const mysql = require('mysql2');

// Create the connection to database
//! 기존에 있던 db 충돌되어 docker에서 port트를 3307로 설정후 추가로 port 번호도 추가해 내가 찾고자하는 db
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: 'root',
  database: 'Youtube',
  dateStrings: true,
});

//컨넥션으로 보내는 sql 매번 이렇게 보내기 불편
// connection.query('SELECT * FROM `users`', (err, results, fields) => {
//   console.log(err);
//   console.log(results[0]); // 내가 원하는 데이터
//   console.log(fields); //  result 예외
// });

module.exports = connection;
// A simple SELECT query
// try {
//   const [results, fields] = connection.query('SELECT * FROM `users`');

//   console.log(results); // results contains rows returned by server
//   console.log(fields); // fields contains extra meta data about results, if available
// } catch (err) {
//   console.log(err);
// }
