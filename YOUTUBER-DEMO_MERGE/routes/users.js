const express = require('express');
const conn = require('../mariadb');
const router = express.Router();
router.use(express.json()); //json 형태로 사용

//로그인 기능
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  /*
  let sql = ''
  let value = ''
  나누는게 더좋은가?
  */
  conn.query(
    `SELECT * FROM users WHERE email =?`,
    email,
    //! err와 results(value) 값 무조건 넣기
    (err, results) => {
      //results 길이에 따른 회원정보가 확인
      let loginUser = results[0];
      if (loginUser && loginUser.password === password) {
        //이메일이 있으면 비밀번호 확인하기
        res.status(200).json({
          message: `${loginUser.name}님 환영합니다.`,
        });
      } else {
        res.status(404).json({
          message: '아이디 또는 비밀번호를 확인해주세요.',
        });
      }
    }
  );
});
//회원가입 기능
router.post('/singup', (req, res) => {
  //! sql문구 및 코드에서 pwd 입력시 등록x -> 왜 db에 pwd 가 아닌 password 로 되어있어서
  const { email, password, name, mobile } = req.body;
  if (!email || !password || !name || !mobile) {
    res.status(400).json({
      message: `입력값을 확인해주세요.`,
    });
  } else {
    conn.query(
      `INSERT INTO users(email, name, password,mobile) VALUES (?,?,?,?)`,
      [email, name, password, mobile],
      (err, results) => {
        // results 회원가입이라 따로 없음
        res.status(201).json({
          message: `${results[0].name}님 환영합니다.`,
        });
      }
    );
  }
});
router
  .route('/users')
  .get((req, res) => {
    let { email } = req.body;
    conn.query(`SELECT * FROM users WHERE email =?`, email, (err, results) => {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({
          message: '회원정보가 없습니다.',
        });
      }
    });
    //! socket hang up 오류 찾기 -> socket(클라이언트와 서버가 주고받는 주머니)
    // 템플릿 문자열 불가능
  })
  .delete((req, res) => {
    let { email, name } = req.body;
    conn.query(`DELETE FROM users WHERE email =?`, email, (err, results) => {
      res.status(200).json({ message: `${name}님 잘가요.` }); //!results -> affectedRows 항목으로 판단하여 코드 작성
    });
  });

module.exports = router;
