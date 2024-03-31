const express = require('express');

const userRouter = require('./routes/users');
const channelRouter = require('./routes/channels');
const app = express();

app.listen(9999);
//미들웨어 router를 이용해 작성한코드(모듈) 연결
app.use('/', userRouter);
app.use('/channels', channelRouter);
