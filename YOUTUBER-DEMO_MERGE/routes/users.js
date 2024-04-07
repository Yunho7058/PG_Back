const express = require('express');
const conn = require('../mariadb');
const { body, validationResult, param } = require('express-validator');
const router = express.Router();
let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
router.use(express.json()); //json 형태로 사용
dotenv.config();

// 검증
//let decoded = jwt.verify(token, process.env.PRIVATE_KEY);

const validate = (req, res, next) => {
  const err = validationResult(req);
  //! 유효성 검사 후 데이터 넣기
  if (err.isEmpty()) {
    // err 발생, 유효성 검사 통과 못했을때
    //!err.array() -> 어디서 어떻게 err 발생했는지 알려주는 배열
    return next();
  } else {
    return res.status(400).json({
      message: `입력값 확인해주세요.`,
    });
  }
};
//
//로그인 기능
router.post(
  '/login',
  [
    body('email').notEmpty().isEmail().withMessage('이메일을 확인해주세요.'),
    body('password')
      .notEmpty()
      .isString()
      .withMessage('비밀번호을 확인해주세요.'),
    validate,
  ],
  (req, res) => {
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
          //토큰 발급
          let token = jwt.sign(
            { email: loginUser.email, name: loginUser.name },
            process.env.PRIVATE_KEY
          );
          res.status(200).json({
            message: `${loginUser.name}님 환영합니다.`,
            token: token,
          });
        } else {
          res.status(404).json({
            message: '아이디 또는 비밀번호를 확인해주세요.',
          });
        }
      }
    );
  }
);
//회원가입 기능
router.post(
  '/singup',
  [
    body('email').notEmpty().isEmail().withMessage('이메일을 확인해주세요.'),
    body('password')
      .notEmpty()
      .isString()
      .withMessage('비밀번호을 확인해주세요.'),
    body('name').notEmpty().isString().withMessage('이름을 확인해주세요.'),
    validate,
  ],
  (req, res, next) => {
    //! sql문구 및 코드에서 pwd 입력시 등록x -> 왜 db에 pwd 가 아닌 password 로 되어있어서

    const { email, password, name, mobile } = req.body;

    conn.query(
      `INSERT INTO users(email, name, password,mobile) VALUES (?,?,?,?)`,
      [email, name, password, mobile],
      (err, results) => {
        // results 회원가입이라 따로 없음
        if (err) {
          throw err;
        }
        res.status(201).json({
          message: `${name}님 환영합니다.`,
        });
      }
    );
    return;
  }
);
router
  .route('/users')
  .get(
    [
      body('email').notEmpty().isEmail().withMessage('이메일을 확인해주세요.'),
      validate,
    ],
    (req, res, next) => {
      let { email } = req.body;
      conn.query(
        `SELECT * FROM users WHERE email =?`,
        email,
        (err, results) => {
          if (results.length) {
            res.status(200).json(results);
          } else {
            res.status(404).json({
              message: '회원정보가 없습니다.',
            });
          }
        }
      );
      //! socket hang up 오류 찾기 -> socket(클라이언트와 서버가 주고받는 주머니)
      // 템플릿 문자열 불가능
    }
  )
  .delete(
    [
      body('email').notEmpty().isEmail().withMessage('이메일을 확인해주세요.'),
      validate,
    ],
    (req, res, next) => {
      let { email } = req.body;
      conn.query(`DELETE FROM users WHERE email =?`, email, (err, results) => {
        res.status(200).json({ message: ` 잘가요.` }); //!results -> affectedRows 항목으로 판단하여 코드 작성
      });
    }
  );

module.exports = router;
