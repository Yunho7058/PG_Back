const express = require('express');
const app = express();
app.listen(9999);
app.use(express.json()); //json 형태로 사용
app.get('/', (req, res) => res.send('Hello World'));

const userInfo = [];
let id = 1;
//로그인 기능
app.post('/login', (req, res) => {});
//회원가입 기능
app.post('/singup', (req, res) => {
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
app
  .route('/users/:id')
  .get((req, res) => {
    let { id } = req.params;
    id = Number(id);
    const user = userInfo.filter((el) => el.id === id);
    console.log(userInfo, id, user);
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
// app.get('/users/:id', (req, res) => {
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
// app.delete('/users/:id', (req, res) => {
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
