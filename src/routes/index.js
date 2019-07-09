const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { isAdmin }= require('../lib/auth');

router.get('/',(req, res, next)=>{
    res.render('index');
});

router.get('/hombres',async(req, res, next)=>{
    pool.query('select * from prendas where genero=0', (err, prendas)=>{
        if(err){
            res.json(err);
        }
        res.render('hombres',{
            data: prendas
        });
    });
});

router.get('/mujeres',async(req, res, next)=>{
    pool.query('select * from prendas where genero=1', (err, prendas)=>{
        if(err){
            res.json(err);
        }
        res.render('mujeres',{
            data: prendas
        });
    });
});

router.get('/ofertas',async(req, res, next)=>{
    pool.query('select * from prendas where oferta=1', (err, prendas)=>{
        if(err){
            res.json(err);
        }
        res.render('ofertas',{
            data: prendas
        });
    });
});


router.get('/view/:id',async(req, res, next)=>{
    const { id } = req.params;
    const rows = await pool.query('SELECT * FROM prendas WHERE id = ?', [id]);
    res.render('view',{
        data: rows[0]
    });
});

router.get('/carrito',isLoggedIn,async(req,res,next)=>{
    const { id } = req.user;
    const carrito = await pool.query('SELECT * FROM carrito WHERE idUser = ?',[id]);
    const idCarrito = carrito[0].id;
    const rows = await pool.query('SELECT * FROM carritoDetalle WHERE idCarrito = ?',[idCarrito]);
    var prendas = [];
    for (let index = 0; index < rows.length; index++) {
        prendas[index] = await pool.query('SELECT * FROM prendas WHERE id = ?',[rows[index].idPrenda]);
    }
    console.log(prendas);
    res.render('carrito',{
        data: rows,
        data2: prendas
    });
});

router.post('/agregarCarrito',isLoggedIn,async(req,res,next)=>{
    const idUser = req.user.id;
    const carrito = await pool.query('SELECT * FROM carrito WHERE idUser = ?',[idUser]);
    const idCarrito = carrito[0].id;
    const { idPrenda }  = req.body;
    const { precio } = req.body;
    const { cantidad } = req.body;
    const precioTotal = precio * cantidad;
    console.log(req.body);
    const newCarritoDetalle={
        idCarrito,
        idPrenda,
        cantidad,
        precioTotal
    };
    await pool.query('INSERT INTO carritoDetalle set ?',[newCarritoDetalle]);
    res.redirect('/hombres');
});

router.get('/deleteCarritoDetalle/:id',isLoggedIn,async(req, res, next)=>{
    await pool.query('DELETE FROM carritoDetalle WHERE id = ?',[req.params.id]);
    res.redirect('/carrito');
});

router.get('/usuarios', isAdmin,async(req,res,next)=>{
    const users = await pool.query('SELECT * FROM users');
    res.render('usuarios',{
        data: users
    })
});

router.get('/hacerAdmin/:id', isAdmin,async(req,res,next)=>{
    await pool.query("UPDATE users SET tipo='admin' where id = ?",[req.params.id]);
    res.redirect('/usuarios');
});

router.get('/hacerNormal/:id', isAdmin,async(req,res,next)=>{
    await pool.query("UPDATE users SET tipo='normal' where id = ?",[req.params.id]);
    res.redirect('/usuarios');
});

module.exports = router;