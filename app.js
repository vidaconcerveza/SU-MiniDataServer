const { query } = require('express');
const express = require('express')
const app = express();
const port = 3000;
const bodyParser = require('body-parser')



const mysql = require('mysql');
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'DataServer'
});

conn.connect((err)=>{
    if(err) throw err;
    console.log('Sql server connected')
})

//app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine', 'ejs')

app.listen(port, ()=>{
    console.log(`Server is Running on port ${port}!`)
});

app.get('/', (req,res) => {
    res.send("Welcome to Data Server")
})

app.get('/all', (req, res)=>{
    const query = "select * from data";
    conn.query(query, (err, result, field)=>{
        if(err) throw err;
        res.send(result);
    })
})


app.post('/data', (req,res)=>{
    try{
        let query = "INSERT INTO data(uid, block, data, updateTime) VALUES";
        req.body.forEach((data)=>{
            query += `('${data.uid}','${data.block}','${data.data}','${data.updateTime}'),`
        })

        let newQuery = query.slice(0,-1);
        newQuery+= "ON DUPLICATE KEY UPDATE data=values(data), updateTime=VALUES(updateTime)";
        conn.query(newQuery, (err, result, field)=>{
            if(err) res.send(err);
            res.send(result);
        })
    }catch(err){
        res.send(err);
    }
})