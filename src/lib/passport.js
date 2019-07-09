const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contrasena',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE usuario = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.contrasena);
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.nombre));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'contrasena',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const { nombre, apellidos, usuario, contrasena } = req.body;
  const newUser = {
    nombre,
    apellidos,
    usuario,
    contrasena
  }
  newUser.contrasena =await helpers.encryptPassword(newUser.contrasena);
  const result = await pool.query('INSERT into users SET ?',[newUser]);
  newUser.id = result.insertId;
  const newCarrito = {
    idUser: newUser.id ,
  }
  await pool.query('INSERT into carrito SET ?',[newCarrito]);
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});