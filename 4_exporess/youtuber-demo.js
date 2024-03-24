const express = require('express');

const app = express();
const port = 8888;

//서버 열기
app.get('/', (req, res) => res.send('Hello World'));

//json
app.use(express.json());

//url test 입력시 req 바디와 내가 보낸 메세지 확인
app.post('/test', (req, res) => {
  console.log(req.body);
  res.send('HI POST');
});

//데이터 만들기
const youtuber1 = {
  channelTitle: '백엔드는 무엇인가',
  sub: '100만',
  videoNum: '100개',
};
const youtuber2 = {
  channelTitle: '빽코딩에 프론트엔드',
  sub: '30만',
  videoNum: '120개',
};
const youtuber3 = {
  channelTitle: '풀스텍 개발자',
  sub: '1000만',
  videoNum: '1300개',
};

//배열 객채로 만들기
let db = new Map();
// js Map set 이용하여 등록 get 조회
//아이디 1 부터 증가
let id = 1;
db.set(id++, youtuber1);
db.set(id++, youtuber2);
db.set(id++, youtuber3);

//한번에 만들기
// const db = [
//   {
//     id: 1,
//     channelTitle: '백엔드는 무엇인가',
//     sub: '100만',
//     videoNum: '100개',
//   },
//   {
//     id: 2,
//     channelTitle: '빽코딩에 프론트엔드',
//     sub: '30만',
//     videoNum: '120개',
//   },
//   {
//     id: 3,
//     channelTitle: '풀스텍 개발자',
//     sub: '1000만',
//     videoNum: '1300개',
//   },
// ];

//기존 데이터를 합치거나 처음부터 객체로 만들수 있음
app.get('/youtubers', (req, res) => {
  const youtubers = {};
  //특정 데이터 찾기
  //   db.forEach((el, idx) => {
  //     youtubers[idx] = el;
  //   });
  //! 추가로 예외처리 방법
  if (db.size !== 0) {
    // db에 데이터가 있을때
    db.forEach((el, idx) => {
      youtubers[idx] = el;
    });
  } else {
    res.status(404).send('조회할 유튜버가 없습니다.');
  }
  res.json(youtubers);
});

app.get('/youtubers/:id', (req, res) => {
  let { id } = req.params;
  id = Number(id);

  const youtuber = db.get(id);
  // ! 아니면 유트버가 없을때
  if (!youtuber) {
    res.status(404).json({ message: '조회할 유튜버가 없습니다' });
    //리턴 하여 함수 종료
    return;
  }
  // 윗 if 안걸릴경우
  res.json(youtuber);
});

app.use(express.json());
console.log(db);
app.post('/youtubers', (req, res) => {
  // js map get,set 좀더 공부하기 코테에 사용할수 있을수도..
  //   db.set(id++, req.body);
  //   console.log(db);
  //   console.log(id);
  const channelTitle = req.body.channelTitle;
  if (!channelTitle) {
    res.status(400).json({
      message: '요청값을 확인해주세요.',
    });
  } else {
    db.set(id++, req.body);
    //등록 성공
    res
      .status(201)
      .json({ message: `${db.get(id - 1).channelTitle}님, 화이팅!` });
  }
});

app.delete('/youtubers/:id', (req, res) => {
  let { id } = req.params;
  id = Number(id);

  const youtuber = db.get(id);
  //마찬가지로 찾는 유트브 없을때
  if (!youtuber) {
    // 오류 상황 코드 보내기
    res.status(404).json({ error: '조회할 유튜버가 없습니다' });
  } else {
    // 삭제
    db.delete(id);
    res.json({ message: `해당 유트버를 삭제합니다.` });
  }
});

app.delete('/youtubers', (req, res) => {
  if (db.size === 0) {
    res.status(404).json({ message: '비워있습니다.' });
    return;
  }
  db.clear();
  res.json({ message: `모두 삭제합니다.` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.put('/youtubers/:id', (req, res) => {
  let { id } = req.params;
  id = Number(id);
  const youtuber = db.get(id);
  const prevChannelTitle = youtuber.channelTitle;
  if (!youtuber) {
    res.status(404).json({ error: '조회할 유튜브가 없습니다' });
    return;
  }
  // 있으면 아래 함수실행
  const newChannelTitle = req.body.channelTitle;
  youtuber.channelTitle = newChannelTitle;
  db.set(id, youtuber);

  res.json({
    message: `${prevChannelTitle}님, 채널명이 ${newChannelTitle}으로 변경되었습니다.`,
  });
});
