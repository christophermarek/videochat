var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();

var indexRouter = require('./routes/index');
var roomRouter = require('./routes/room');

var server = require('http').Server(app);
var io = require('socket.io')(server);
//server.listen(80);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/', indexRouter);
app.use('/room', roomRouter);

io.on('connection', socket => {
  console.log('User connected');
  
  socket.on('chatter', function(message) {
    console.log('message : ' + message);
    io.emit('chatter', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
