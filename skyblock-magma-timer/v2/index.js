const vars = require("./vars");
require("./logToFile");

const fs = require('fs');
const request = require("request");
// require('request-debug')(request);
const qs = require('querystring');
const parseXmlString = require("xml2js").parseString;

const express = require('express');
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 10 // limit each IP to 10 requests per windowMs
});
//  apply to all requests
app.use(limiter);

app.use(express.static('public'));


const mysql = require("mysql");
const connection = mysql.createConnection(vars.mysql);
connection.connect(function (err) {
    if (err) throw err;
});

const port = 3040;


app.get("/api", (req, res) => {
    res.json({
        success:true,
        msg: "Hello World!"
    });
});

app.get("/api/activeUsers",(req,res)=>{
    connection.query("SELECT COUNT(*) AS total FROM hypixel_skyblock_magma_timer_pings WHERE active_time > NOW() - INTERVAL 2 MINUTE",function (err,res) {
        if (err) {
            res.json({
                success:false,
                msg: "sql error"
            });
            return;
        }
        console.log(res);

        res.json({
            success:true,
            msg:"",

        })
    })
});


app.listen(port, () => console.log(`Example app listening on port ${ port }!`))

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ');
    console.log(err)
});