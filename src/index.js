const express = require('express');
const morgan = require('morgan');
const path = require('path');
//require('dotenv').config();
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const multer = require('multer');
const { database } = require('./keys');


//init
const app = express();
require('./lib/passport');


//settings 
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middlewares
app.use(session({
    secret: 'dreamprogrammers',
    resave: false,
    saveUninitialized:false,
    store: new MySQLStore(database)
    })
);
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
}) 
app.use(multer({
    storage,
    fileFilter:(req,res, file, cb)=>{
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype&&extname){
            return cb(null, true);
        }
        cb("El archivo debe ser una imagen");
    }
}).single('image'));

//Global variables
app.use((req, res, next)=>{
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/prendas',require('./routes/prendas'));
app.use('/tipoPrendas',require('./routes/tipoPrendas'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Start
app.listen(app.get('port'), ()=>{
    console.log('Server on Port ', app.get('port'));
});

