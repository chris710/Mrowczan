/**
 * Created by st3rn on 07/07/16.
 */
var bodyParser = require('body-parser');
var express = require('express'), app = express();
var request = require('request');
var path = require('path');

var admin_username = 'admin'
var admin_password = 'password'

app.use(express.static(__dirname+'/public'));

app.set('views', path.join(__dirname+'/public/signup'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/bower_components', express.static(__dirname+'/bower_components'));


app.get('/',function (req,res) {
    res.sendFile('index.html',{'root':__dirname+'/public/index'});
});

app.get('/signIn', function (req,res) {
    res.sendFile('signin.html', {
        'root': __dirname+'/public/signin'
    });
});

app.get('/signUp', function (req, res) {
    res.render('signup',{error:''})
    /*res.sendFile('signup.ejs', {
        'root': __dirname+'/public/signup'
    });*/
});

app.post('/register', function(req, res) {
    var _firstName = req.body.inputFirstName;
    var _lastName = req.body.inputLastName;
    var _username = req.body.inputUsername;
    var _password = req.body.inputPassword;
    var _phone = req.body.inputPhone;
    
    var options = {
        url: 'http://127.0.0.1:5000/user/',
        method: 'POST',
        auth: {
            user: 'admin',
            password: 'admin'
        },
        formData: {
            firstname: _firstName,
            lastname: _lastName,
            username: _username,
            password: _password,
            phone: _phone
        }
    };
    
    request(options, function(err, res2, body) {
        if(err) {
            return res.render('signup', {
                error: err
            })
        }
        var result = JSON.parse(body)
        if(result._status == 'ERR') {   //errory walidacyjne
            if (result._error.code == '400') {
                return res.render('signup', {
                    error: 'Username Already Exists!'
                })
            }
            return res.render('signup', {
                error: result._issues.username
            })
        } else {
            console.log('All good');
            res.redirect('/signIn');
        }
    })
});


app.listen(3000, function () {
    console.log('App listening on port 3000!');
});