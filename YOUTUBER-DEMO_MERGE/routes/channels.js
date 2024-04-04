const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
router.use(express.json()); //json 형태로 사용

// 설계 후 기초 API 작성
// 같은 url 묶기
// postman 으로 테스트
// 분기처리

//채널 생성, 전체조회
router
  .route('/')
  .post((req, res) => {
    const { name, userId } = req.body;
    //! 유효성 검사 후 데이터 넣기

    conn.query(
      `INSERT INTO channels(name,user_id) VALUES (?,?)`,
      [name, userId],
      (err, results) => {
        // results 회원가입이라 따로 없음
        res.status(201).json({
          message: `${name}님 환영합니다.`,
        });
      }
    );

    // if (!channelTitle) {
    //   res.status(400).json({
    //     message: `입력값 확인해주세요.`,
    //   });
    // } else {
    //   db.push({ id: id++, ...req.body });
    //   res.status(201).json({
    //     message: `${channelTitle} 응원합니다~`,
    //   });
    // }
  })
  .get((req, res) => {
    let { userId } = req.body;
    if (!userId) {
      res.status(400).end();
    } else {
      conn.query(
        `SELECT * FROM channels WHERE user_id = ?`,
        userId,
        (err, results) => {
          if (results.length) {
            res.status(200).json(results);
          } else {
            notFoundChannels(res);
          }
        }
      );
    }
    //단축 평가 -> 짧게 연산자 이용하여 코드 정리
    //userId &&
  });
//채널 수정, 삭제, 개별조회
router
  .route('/:id')
  .put((req, res) => {
    let { id } = req.params;
    id = Number(id);
    const channel = db.filter((el) => el.id === id);
    if (!channel) {
      res.status(404).json({
        message: `입력값을 확인해주세요.`,
      });
    } else {
      let oldTitle = channel[0].channelTitle;
      let newTitle = req.body.channelTitle;
      db = db.map((el) =>
        el.id === id ? { ...el, channelTitle: newTitle } : el
      );
      res.status(200).json({
        message: `채널명이 기존 ${oldTitle}에서 ${newTitle}변경되었습니다 `,
      });
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = Number(id);
    const channel = db.filter((el) => el.id === id);
    if (!channel) {
      res.status(404).json({
        message: `입력값을 확인해주세요.`,
      });
    } else {
      db = db.filter((el) => el.id !== id);
      res
        .status(200)
        .json({ message: `${channel[0].channelTitle} 삭제 되었습니다.` });
    }
  })
  .get((req, res) => {
    let { id } = req.params;
    id = Number(id);
    conn.query(`SELECT * FROM channels WHERE id = ?`, id, (err, results) => {
      if (results.length) {
        res.status(200).json(results);
      } else {
        notFoundChannels(res);
      }
    });
  });
const notFoundChannels = (res) => {
  res.status(404).json({
    message: `채널이 정보를 찾을수 없어요ㅠ.`,
  });
};

module.exports = router;
