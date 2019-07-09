const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isAdmin } = require('../lib/auth');
const multer = require('multer');

router.get('/',isAdmin,async(req, res, next)=>{
    await pool.query('SELECT * FROM prendas', (err, prendas)=>{
        if(err){
            res.json(err);
        }
        res.render('prendas/list',{
            data: prendas
        });
    });
});

router.get('/add',isAdmin,async(req, res, next)=>{
    res.render('prendas/add');
});

router.post('/add',async(req, res, next)=>{
    const { nombre, color, precio, genero, cantidad } = req.body;
    const imageURL = req.file.filename;
    const data = {
        nombre,
        color,
        precio,
        genero,
        cantidad,
        imageURL
    }
    await pool.query('INSERT INTO prendas set ?',[data], (err, tipoPrendas)=>{
        if(err){
            res.json(err);
        } 
        res.redirect('/prendas');
    })
});

router.get('/delete/:id',async(req, res, next)=>{
    const { id }= req.params;
    
        pool.query("Update prendas Set estadoRegistro='*' Where id= ?",[id], (err, prenda)=>{
            if(err){
                res.json(err);
            }
            res.redirect('/prendas');
        })
    
});

router.get('/ofertar/:id',async(req, res, next)=>{
    const { id }= req.params;
    
        pool.query("Update prendas Set oferta='1' Where id= ?",[id], (err, prenda)=>{
            if(err){
                res.json(err);
            }
            res.redirect('/prendas');
        })
    
});
router.get('/desofertar/:id',async(req, res, next)=>{
    const { id }= req.params;
    
        pool.query("Update prendas Set oferta='0' Where id= ?",[id], (err, prenda)=>{
            if(err){
                res.json(err);
            }
            res.redirect('/prendas');
        })
    
});
router.get('/activar/:id',async(req, res, next)=>{
    const { id }= req.params;
    
        pool.query("Update prendas Set estadoRegistro='A' Where id= ?",[id], (err, prenda)=>{
            if(err){
                res.json(err);
            }
            res.redirect('/prendas');
        })
    
});
module.exports = router;