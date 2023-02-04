const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { createPool } = require('mysql');
const path = require('path');
const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: 'registration',
    connectionLimit: 10
});


const users = [];
app.use(express.urlencoded({ extended: 'false' }));
app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user_id = Date.now().toString;
        let userinfo = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const query = 'INSERT INTO users SET ? ';
        pool.query(query, userinfo, (err, result, fields) => {
            if (err) {
                console.error('Error saving to the database: ' + err.stack);
                return res.send("Error didn't save to the database");
            }
            res.send('Data saved successfully');
        });
    } catch (e) {
        res.redirect('/signup');
    }
})




const exphbs = require('express-handlebars');
app.set('view engine', 'hbs');

// app.use(express.static('public'));
// app.use(express.static('upload'));


var urlEncodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'ejs');
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login')
})
let dataFromDb = 0;

app.post('/index', urlEncodedParser, (req, res) => {
    let userLogginCredentials = req.body;
    let userLogginEmail = req.body.email;
    console.log(userLogginCredentials)
    let sql = 'SELECT * FROM users WHERE email = ?';

    pool.query(sql, userLogginEmail, (err, results) => {
        if (err) throw err;
        dataFromDb = results;
        console.log(dataFromDb);


        if (userLogginCredentials.email == dataFromDb[0].email && userLogginCredentials.name == dataFromDb[0].username && userLogginCredentials.password == dataFromDb[0].password) {
            res.render('index',{name:dataFromDb[0].username,email:dataFromDb[0].email});
        } else {
            res.send('Invalid credentials');
        }


    })
    // pool.query(`UPDATE users SET username='${req.body.newusername}', email='${req.body.newemail}' WHERE email=${dataFromDb[0].email}`, (err , data) => {
    //     if (err) throw err
    //     console.log(data)
    // })
})





app.get('/index',(req,res)=>{
    res.render('index')
})
// app.post('/login',(req,res)=>{

// })
// app.post('/index',(res,req)=>{
//     console.log(dataFromDb)
//     pool.query(`UPDATE users SET username= '${req.body.newusername}', email= '${req.body.newemail}' WHERE email=?` ,dataFromDb[0].email,(err,data)=>{
//         if(err) throw err
//         // res.send('username and email are successfully updated')
//         console.log(data);
//     })
// })

app.listen(3000, () => {
    console.log("listening on port 3000");
}
)   