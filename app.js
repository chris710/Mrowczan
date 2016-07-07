/**
 * Created by st3rn on 07/07/16.
 */

var express = require('express'), app = express();

app.use(express.static(__dirname+'/public'));

app.get('/',function (req,res) {
    res.sendFile('index.html',{'root':__dirname+'/public/index'});
});

app.get('/signIn', function (req,res) {
    res.sendFile('signin.html', {
        'root': dirname+'/public/signin'
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});