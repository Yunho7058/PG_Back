let jwt = require('jsonwebtoken'); // 모듈 가져오고
let token = jwt.sign({ foo: 'bar' }, process.env.PRIVATE_KEY); //토큰생성 -> 서명함 (페이로드,암호)+SHA256
// shhhhh -> 암호화키 -> 숨겨야할듯 -> .env 이용하여 숨기기
// git 올릴때 암화키가 노출되기때문에 .env 를 이용하여 암호키를 숨기고 env는 깃에 올리지 않음
console.log(token);
let dotenv = require('dotenv');
dotenv.config();

// 검증
let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
console.log(decoded);
// { foo: 'bar', iat: 1712489353 }
// iat -> 발행 시간
//! 발행시간이 달라져 페이로드가 달라지면서 서명값도 달라짐!
