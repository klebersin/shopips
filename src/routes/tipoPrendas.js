const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/',async(req, res, next)=>{
    await pool.query('SELECT * FROM tipoPrenda', (err, tipoPrendas)=>{
        if(err){
            res.json(err);
        }
        console.log(tipoPrendas);
        res.render('tipoPrendas/list',{
            data: tipoPrendas
        });
    });
});

router.get('/add',(req, res, next)=>{
    res.render('tipoPrendas/add');
});

router.post('/add',async(req, res, next)=>{
    const data= req.body;
    await pool.query('INSERT INTO tipoPrenda set ?',[data], (err, tipoPrendas)=>{
        if(err){
            res.json(err);
        }
        res.redirect('/tipoPrendas');
    })
});

router.get('/edit/:id',(req, res, next)=>{
    res.render('tipoPrendas/edit');
});
module.exports = router;