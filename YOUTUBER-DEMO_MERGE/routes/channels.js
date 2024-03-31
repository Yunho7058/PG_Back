const express = require('express');
const router = express.Router();

router.use(express.json()); //json 형태로 사용

let db = [];
let id = 1;

// 설계 후 기초 API 작성
// 같은 url 묶기
// postman 으로 테스트
// 분기처리

//채널 생성, 전체조회
router
  .route('/')
  .post((req, res) => {
    const { channelTitle } = req.body;
    if (!channelTitle) {
      res.status(400).json({
        message: `입력값 확인해주세요.`,
      });
    } else {
      db.push({ id: id++, ...req.body });
      res.status(201).json({
        message: `${channelTitle} 응원합니다~`,
      });
    }
  })
  .get((req, res) => {
    let { userId } = req.body;
    if (userId.length === 0) {
      res.status(404).json({
        message: '로그인 정보를 확인해세요.',
      });
    }
    if (!db) {
      //아무것도 없는경우
      notFoundChannels();
    } else {
      //있는경우
      let channels = db.filter((el) => el.userId === userId);
      if (channels.length === 0) {
        res.status(404).json({
          message: '현재 아이디에 등록된 채널이 없습니다.',
        });
      } else {
        channels = channels.map((el) => el.channelTitle);
        res.status(200).json(channels);
      }
    }
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
    const channel = db.filter((el) => el.id === id);
    if (!channel.length) {
      notFoundChannels();
    } else {
      res.status(200).json(channel);
    }
  });
const notFoundChannels = () => {
  res.status(404).json({
    message: `채널이 정보를 찾을수 없어요ㅠ.`,
  });
};

module.exports = router;
