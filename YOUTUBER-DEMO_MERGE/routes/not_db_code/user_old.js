const express = require('express');

const router = express.Router();
router.use(express.json()); //json 형태로 사용

const userInfo = [];
let id = 1;
//로그인 기능
router.post('/login', (req, res) => {
  //1. 사용자로부터 아이디 비번 받고
  //2. db 찾기 (우리는 위에 객체에서 찾기)
  const { userId, pwd } = req.body;
  const user = userInfo.filter((el) => el.userId === userId);
  // 영상에서는 let hasUserInfo = false 변수 하나만들어 관리
  const userInfoIsEmpty = Boolean(user.length);
  if (!userInfoIsEmpty) {
    // 유저정보가 없습니다 이이디 확인해주세요
    res.status(404).json({
      message: '이이디를 확인해주세요.',
    });
    return;
  } else if (pwd === user[0].pwd) {
    // 유저있으면 비밀번호 맞는지 확인, 맞는경우
    res.status(200).json({
      message: `${user[0].name}님 환영합니다.`,
    });
  } else {
    // 비밀번호 틀릴경우
    res.status(400).json({
      message: '비밀번호를 확인해주세요.',
    });
  }
});
//회원가입 기능
router.post('/singup', (req, res) => {
  const { userId, pwd, name } = req.body;
  if (!userId || !pwd || !name) {
    res.status(400).json({
      message: `입력값을 확인해주세요.`,
    });
  } else {
    userInfo.push({ id: id++, userId, pwd, name });
    res.status(201).json({
      message: `${name}님 환영합니다.`,
    });
  }
});
router
  .route('/users')
  .get((req, res) => {
    let { userId } = req.body;
    const user = userInfo.filter((el) => el.userId === userId);
    if (user.length === 0) {
      res.status(404).json({
        message: '회원정보가 없습니다.',
      });
    } else {
      res.status(200).json({
        userId: user[0].userId,
        name: user[0].name,
      });
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = Number(id);
    const user = userInfo.filter((el) => el.id === id);
    if (!user) {
      res.status(404).json({
        message: '회원정보가 없습니다.',
      });
    } else {
      userInfo.pop();
      console.log(userInfo, '삭제');
      res.status(200).json({
        message: `${user[0].name} 잘가요.`,
      });
    }
  });
//회원개별조회 기능
// router.get('/users/:id', (req, res) => {
//   let { id } = req.params;
//   id = Number(id);
//   const user = userInfo.filter((el) => el.id === id);
//   console.log(userInfo, id, user);
//   if (user.length === 0) {
//     res.status(404).json({
//       message: '회원정보가 없습니다.',
//     });
//   } else {
//     res.status(200).json({
//       userId: user[0].userId,
//       name: user[0].name,
//     });
//   }
// });
//회원개별탈퇴 기능
// router.delete('/users/:id', (req, res) => {
//   let { id } = req.params;
//   id = Number(id);
//   const user = userInfo.filter((el) => el.id === id);
//   if (!user) {
//     res.status(404).json({
//       message: '회원정보가 없습니다.',
//     });
//   } else {
//     userInfo.pop();
//     console.log(userInfo, '삭제');
//     res.status(200).json({
//       message: `${user[0].name} 잘가요.`,
//     });
//   }
// });

module.exports = router;
