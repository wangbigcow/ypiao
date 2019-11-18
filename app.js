const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.js');
const ticketRouter = require('./routes/ticket.js');
const cors = require('cors'); 
 
var app = express();
app.listen(8080);
//添加cors中间件
//所有请求进入app.js 加请求头
app.use(cors());




app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended:false
}));
app.use('/user',userRouter);
app.use('/ticket',ticketRouter);


