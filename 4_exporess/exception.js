// json 배열, find() 예외 처리
const express = require('express');
const app = express();
app.listen(8888);

//배열 생성
const foods = [
  { id: 1, name: 'hamburger' },
  { id: 2, name: 'pizza' },
  { id: 3, name: 'iceCream' },
  { id: 4, name: 'kimchi' },
];

//전체 조회
app.get('/foods', (req, res) => {
  res.json(foods);
});

//개별 조회
app.get('/foods/:id', (req, res) => {
  //파람스에서 아이디가져오기
  const id = req.params.id;
  //food 중 아이디 같은 food 조회

  //? const food = foods[id] 코드 작성시
  //! js 파일이라 1 아이디 값을 넣으면 2가 산출됨
  // -> foods[id-1] 해서 원하는값 산출 가능
  // -> forEach 함수 사용 , map이나 filter도 가능한가?
  var findFood;
  findFood = foods.filter((el) => {
    el.id === id;
  });
  // 방법은 여러가지 존재
  // 한줄 정리
  // var findFood = foods.find(f =>f.id ===id)

  //예외처리 객체가 없을경우
  if (findFood) {
    res.json(findFood);
  } else {
    // status 상태 코드를 실패로 보내준다. 404 -> 실패 코드 + 메서지도 같이 보내기₩
    // 상대방이 볼수 있기때문에 메세지도 같이 보내기(의사소통)
    res.status(404).send('전송한 id로 조회된 음식이 없습니다.');
  }
});
