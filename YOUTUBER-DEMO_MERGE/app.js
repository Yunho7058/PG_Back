const express = require('express');
let dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./routes/users');
const channelRouter = require('./routes/channels');
const app = express();

app.listen(process.env.PORT);
//미들웨어 router를 이용해 작성한코드(모듈) 연결
app.use('/', userRouter);
app.use('/channels', channelRouter);
