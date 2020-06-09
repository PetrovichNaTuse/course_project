const path = require('path');
const fs = require('fs');
const mime = require('mime');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('../db/db');
const ObjectID = require('mongodb').ObjectId;
//const userControllers = require('./controllers/user');

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../public')))

app.get('/reg', (req, res) => {
    //console.log(req.body);
    res.render('registration', { title: 'Registration', text_h1: 'Registration' });
});

app.get('/admin', (req, res) => {
    db.get().collection('admin').findOne({login: req.query.login}, (err, admin) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if(admin && req.query.password === admin.password) {
            db.get().collection('products').find({}).toArray((err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500);
                }

                res.render('admin', { products: result });
            });
        } else res.sendStatus(404);
    });
});

app.post('/reg',(req, res) => {

    db.get().collection('users').insertOne(req.body, function(err, result) {
        if(err) {
            res.status(500, 'Server error');
            console.log(err);
        }
        console.log('User add');
        res.send('ok');
    })
})

app.post('/uploadimg', (req, res) => {
    const fileName = req.headers['file-name'];
    const fileMime = mime.getExtension(req.headers['content-type']);
    
    console.log(req.headers)
    let filePath = path.join(__dirname, 'public/img/products')

    const listDir = fs.readdirSync(filePath);
    fs.mkdirSync(path.join(filePath, listDir.length + 1 + ''));
    filePath = path.join(filePath, + listDir.length + 1 + '', fileName + '.' + fileMime);

    const fileStream = fs.createWriteStream(filePath)
    req.pipe(fileStream);

    fileStream.on('close', () => {
        db.get().collection('products').updateOne({ 'name': fileName }, { $set: {'fgimg': filePath }}, () => {
            console.log('file loaded');
            res.end('ok');
        });
    })
})

app.post('/addproduct', (req, res) => {
    db.get().collection('products').findOne({ name: req.body.name }, (err, item) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if(!req.body) return res.status(204);
        if(item) {
            res.status(208);
            return res.end('Product exists');
        }
        db.get().collection('products').insertOne(req.body, (err, result) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.send('ok');
        });
    });
});


// autorization

app.post('/authentication', (req, res) => {
    db.get().collection('users').findOne({ email: req.body.email }, (err, item) => {
        if(err) {
            console.log(err);
            return res.sendStarus(500);
        }
        if(!item) {
            res.status(400);
            return res.end('User not found');
        }

        if(req.body.passwd !== item.password) {
            res.status(400);
            return res.send('Invalid password');
        }

        res.status(200);
        return res.send(item);
    });
});
app.post('/autentication/addkey', (req, res) => {
    db.get().collection('users').updateOne({ '_id': ObjectID(req.body._id) }, { $set: { 'storageKey': req.body.key } }, (err) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log('key created');

        db.get().collection('users').findOne( {'_id': ObjectID(req.body._id)},  (err, user) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.status(200);
            return res.send(user.basket);
        })
    })
});

app.post('/logout', (req, res) => {
    db.get().collection('users').updateOne({ '_id': ObjectID(req.body._id) }, { $set: { 'storageKey': '' } }, (err) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log('account logout');
        res.status(200);
        return res.end();
    });
})
app.post('/checkKey', (req, res) => {
    

    db.get().collection('users').findOne( { _id: ObjectID(req.body._id) }, (err, user) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }

        if(!user) {
            res.status(426);
            return res.end('Data does not match');
        }

        if(user.storageKey != req.body.key) {
            db.get().collection('users').updateOne({ '_id': ObjectID(req.body._id) }, { $set: { 'storageKey': '' } }, (err) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                res.status(426);
                return res.end('Data does not match');
            });
        } else {
            res.status(200);
            return res.end();
        }
    })
});

//  Отдача товара на главную страницу
app.post('/getproducts', (req, res) => {
    db.get().collection('products').find({}).toArray((err, result) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.status(200);
        return res.send(result);
    })
});

// Отдача корзины пользователя
app.post('/getUserBasket', (req, res) => {
    let userProducts = [];
    let interval;

    //req.body.forEach(item => {
    //    db.get().collection('products').findOne( {_id: ObjectID(item)}, (err, prod) => {
    //        if(err) {
    //            console.log(err);
    //            return res.sendStatus(500);
    //        }
    //        userProducts.push(prod);
    //    });
    //});

    //interval = setInterval(() => {
    //    if(userProducts.length !== req.body.length) console.log('upload');
    //    else {
    //        clearInterval(interval)
    //        res.status(200);
    //        return res.send(userProducts);
    //    }
    //}, 10);

    //});

    const promissifyCollection = (item) => new Promise((resolve, reject) => {
        db.get().collection('products').findOne( {_id: ObjectID(item)}, (err, prod) => {
            if(err) {
                return reject(new Error('Пятисотая ошибка'));
                
            }
            return resolve(prod);
            
        } );
        
    })

    Promise
    .all(req.body.map(promissifyCollection))
        .then((results) => {
            res.status(200);
            res.send(results);
            
        })
        .catch((err) => {
            res.sendStatus(500);
            
        })
})

// Добавление товара в корзину пользователя
app.post('/userBasket', (req, res) => {
    console.log(req.body);
    db.get().collection('users').updateOne({ '_id': ObjectID(req.body._id) }, { $set: { 'basket': req.body.basket } });

    res.status(200);
    res.end('ok');
})

db.connect('mongodb://localhost:1234/', (err) => {
    if(err) return console.log(err);
    //db = client.db('car_auto');
    app.listen(3076, () => {
        console.log('server started on port 3076');
    });
});
