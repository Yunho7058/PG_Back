const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, validationResult, param } = require('express-validator');
router.use(express.json()); //json 형태로 사용

// 설계 후 기초 API 작성
// 같은 url 묶기
// postman 으로 테스트
// 분기처리

//미들웨어 => 모듈화
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

//채널 생성, 전체조회
router
  .route('/')
  .post(
    [
      body('userId').notEmpty().isInt().withMessage('숫자 입력하자!'),
      body('title').notEmpty().isString().withMessage('문자 입력하자!'),
      validate,
    ],
    (req, res, next) => {
      const { title, userId } = req.body;
      conn.query(
        `INSERT INTO channels(title,user_id) VALUES (?,?)`,
        [title, userId],
        (err, results) => {
          // results 회원가입이라 따로 없음
          if (err) {
            throw err;
            //return res.status(400).end();
          } else {
            res.status(201).json({
              message: `${title}님 환영합니다.`,
            });
          }
        }
      );
    }
  )
  .get(
    body('userId').notEmpty().isInt().withMessage('숫자 입력하자!'),
    (req, res) => {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        // err 발생, 유효성 검사 통과 못했을때
        //!err.array() -> 어디서 어떻게 err 발생했는지 알려주는 배열
        return res.status(400).json({
          message: `입력값 확인해주세요.`,
        });
      }
      let { userId } = req.body;
      conn.query(
        `SELECT * FROM channels WHERE user_id = ?`,
        userId,
        (err, results) => {
          if (err) {
            throw err;
            //return res.status(400).end();
          }
          if (results.length) {
            res.status(200).json(results);
          } else {
            notFoundChannels(res);
          }
        }
      );
      //단축 평가 -> 짧게 연산자 이용하여 코드 정리
      //userId &&
    }
  );
//채널 수정, 삭제, 개별조회
router
  .route('/:id')
  .put(
    [
      param('id').notEmpty().withMessage('채널 아이디 필요!'),
      body('title').notEmpty().withMessage('채널 이름 필요!'),
      validate,
    ],
    (req, res) => {
      let { id } = req.params;
      let { title } = req.body;
      id = Number(id);

      conn.query(
        `UPDATE channels SET title = ? WHERE id = ?;`,
        [title, id],
        (err, results) => {
          if (err) {
            return res.status(400).end();
          }
          if (results.affectedRows) {
            return res.status(200).json(results);
          } else {
            return notFoundChannels(res);
          }
        }
      );
    }
  )
  .delete(
    [param('id').notEmpty().withMessage('채널 아이디 필요!'), validate],
    (req, res) => {
      let { id } = req.params;
      id = Number(id);

      conn.query(`DELETE FROM channels WHERE id =?`, id, (err, results) => {
        if (err) {
          throw err;
        }
        results.affectedRows
          ? res.status(200).json(results)
          : notFoundChannels(res);
      });
    }
  )
  .get(
    [param('id').notEmpty().withMessage('채널 아이디 필요!'), validate],
    (req, res) => {
      let { id } = req.params;
      id = Number(id);

      conn.query(`SELECT * FROM channels WHERE id = ?`, id, (err, results) => {
        if (results.length) {
          res.status(200).json(results);
        } else {
          notFoundChannels(res);
        }
      });
    }
  );
const notFoundChannels = (res) => {
  res.status(404).json({
    message: `채널이 정보를 찾을수 없어요ㅠ.`,
  });
};

module.exports = router;
