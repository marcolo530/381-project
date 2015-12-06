var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MONGODBURL = 'mongodb://marcolo530:room3414@ds061464.mongolab.com:61464/restaurant';

var restaurantSchema = require('./restaurant');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/restaurant_id/:x', function (req, res) {
    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var restaurant = mongoose.model('restaurants', restaurantSchema);
        //Kitten.find({name: new RegExp(req.params.x)},function(err,results){
        restaurant.find({restaurant_id: req.params.x}, function (err, results) {
            if (err) {
                console.log("Error: " + err.message);
                res.write(err.message);
            }
            else {

                console.log('Found: ', results.length);
                if (results.length == 0) {
                    results = {"message": "No matching document", "restaurant_id": req.params.x};

                }
                res.json(results);
                db.close();
            }
        });
    });
});

app.get('/search/:attrib/:attrib_value', function (req, res) {
    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var restaurant = mongoose.model('restaurants', restaurantSchema);
        //Kitten.find({name: new RegExp(req.params.x)},function(err,results){
        var criteria = {};
        if (req.params.attrib == 'grade' || req.params.attrib == 'score' || req.params.attrib == 'date') {
            var temp1 = {};
            var temp2 = {};

            temp1[req.params.attrib] = req.params.attrib_value;
            temp2['$elemMatch'] = temp1;

            criteria['grades'] = temp2;
            console.log('Found: ', criteria);

        } else if (req.params.attrib == 'street' || req.params.attrib == 'zipcode' || req.params.attrib == 'building' || req.params.attrib == 'coord') {

            criteria["address." + req.params.attrib] = req.params.attrib_value;

        } else {
            criteria[req.params.attrib] = req.params.attrib_value;
        }
        restaurant.find(criteria, function (err, results) {
            if (err) {
                console.log("Error: " + err.message);
                res.write(err.message);
            }
            else {

                console.log('Found: ', criteria);
                if (results.length == 0) {
                    results = {"message": "No matching document", "restaurant_id": req.params.x};

                }
                res.json(results);
                db.close();
            }
        });
    });
});

app.get('/search2Attrib/:attrib/:attrib_value/:attrib2/:attrib_value2', function (req, res) {
    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var restaurant = mongoose.model('restaurants', restaurantSchema);
        //Kitten.find({name: new RegExp(req.params.x)},function(err,results){
        var criteria = {};
        var criteria2 = {}
        if (req.params.attrib == 'grade' || req.params.attrib == 'score' || req.params.attrib == 'date') {
            var temp1 = {};
            var temp2 = {};

            temp1[req.params.attrib] = req.params.attrib_value;
            temp2['$elemMatch'] = temp1;

            criteria['grades'] = temp2;
            console.log('Found: ', criteria);

        } else if (req.params.attrib == 'street' || req.params.attrib == 'zipcode' || req.params.attrib == 'building' || req.params.attrib == 'coord') {

            criteria["address." + req.params.attrib] = req.params.attrib_value;

        } else {
            criteria[req.params.attrib] = req.params.attrib_value;
        }


        if (req.params.attrib2 == 'grade' || req.params.attrib2 == 'score' || req.params.attrib2 == 'date') {
            var temp1 = {};
            var temp2 = {};

            temp1[req.params.attrib2] = req.params.attrib_value2;
            temp2['$elemMatch'] = temp1;

            criteria2['grades'] = temp2;
            console.log('Found: ', criteria);

        } else if (req.params.attrib2 == 'street' || req.params.attrib2 == 'zipcode' || req.params.attrib2 == 'building' || req.params.attrib2 == 'coord') {

            criteria2["address." + req.params.attrib2] = req.params.attrib_value2;

        } else {
            criteria2[req.params.attrib2] = req.params.attrib_value2;
        }
        restaurant.find({$and: [criteria, criteria2]}, function (err, results) {
            if (err) {
                console.log("Error: " + err.message);
                res.write(err.message);
            }
            else {

                console.log('Found: ', criteria, criteria2);
                if (results.length == 0) {
                    results = {"message": "No matching document"};

                }
                res.json(results);
                db.close();
            }
        });
    });
});





app.post('/', function (req, res) {
    var newRest =
            {address: {building: "", coord: [0, 0], street: "", zipcode: ""}, borough: "", cuisine: "", grades: [], name: "", restaurant_id: ""};
    if (req.body.building == null) {
        req.body.building = " ";
    }
    if (req.body.street == null) {
        req.body.street = " ";
    }
    if (req.body.zipcode == null) {
        req.body.zipcode = " ";
    }
    if (req.body.lon == null) {
        req.body.lon = " ";
    }
    if (req.body.lat == null) {
        req.body.lat = " ";
    }
    if (req.body.borough == null) {
        req.body.borough = " ";
    }
    if (req.body.cuisine == null) {
        req.body.cuisine = " ";
    }
    if (req.body.grade == null) {
        req.body.grade= " ";
    }
    if (req.body.score == null) {
        req.body.score = " ";
    }
    if (req.body.date == null) {
        req.body.date = " ";
    }
	

    newRest.name = req.body.name;
    newRest.address.building = req.body.building;
    newRest.address.street = req.body.street;
    newRest.address.zipcode = req.body.zipcode;
    newRest.address.coord[0] = req.body.lon;
    newRest.address.coord[1] = req.body.lat;
    newRest.borough = req.body.borough;
    newRest.cuisine = req.body.cuisine;
    newRest.restaurant_id = req.body.restaurant_id;
if ((req.body.grade==" "&req.body.date==" "&req.body.score==" ")){

  console.log('123: ');
}
else{
	var criteria = {};
    criteria["date"] = req.body.date;
    criteria["grade"] = req.body.grade;
    criteria["score"] = req.body.score;
    newRest.grades = criteria;
}
    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var Restaurant = mongoose.model('restaurants', restaurantSchema);

        console.log('Request body: ', req.body);
        var r = new Restaurant(newRest);

        r.save(function (err, result) {
            if (err) {
                res.end(err.message, 500);
            }
            else {
                db.close();
                console.log('Found: ', result);
                var output = {"message": "insert done", "_id": result._id};
                res.json(output);
                res.end('Done', 200);
            }
        });
    });
});



app.put('/restaurant_id/:x/grade', function (req, res) {
    var criteria = {};
    criteria["date"] = req.body.date;
    criteria["grade"] = req.body.grade;
    criteria["score"] = req.body.score;
    console.log(criteria);

    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var restaurant = mongoose.model('restaurants', restaurantSchema);
        restaurant.update({restaurant_id: req.params.x}, {$push: {grades: criteria}}, function (err, result) {
            if (err) {
                console.log("Error: " + err.message);
                res.write(err.message);
            }
            else {

                
                if (result.n == 1)
                    results = {"message": "update done"};
                else
                    results = {"message": "record doesn't exist!!"};
                res.json(results);
                db.close();
            }
        });
    });
});

app.put('/:field/:field_value/:attrib/:attrib_value', function (req, res) {
    var criteria = {};
    if (req.params.attrib == 'street' || req.params.attrib == 'zipcode' || req.params.attrib == 'building' || req.params.attrib == 'coord') {

        criteria["address." + req.params.attrib] = req.params.attrib_value;

    } else {
        criteria[req.params.attrib] = req.params.attrib_value;
    }

    console.log(criteria);
    var fieldArray = {};
    fieldArray[req.params.field] = req.params.field_value;
    console.log(fieldArray);
    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var restaurant = mongoose.model('restaurants', restaurantSchema);
        restaurant.update(fieldArray, {$set: criteria}, function (err, result) {
            if (err) {
                console.log("Error: " + err.message);
                res.write(err.message);
            }
            else {

                
                if (result.n == 1)
                    results = {"message": "update done"};
                else
                    results = {"message": "record doesn't exist!!"};
                res.json(results);
                db.close();
            }
        });
    });
});


app.put('/:field/:field_value/:attrib/:attrib_value/:attrib2/:attrib_value2', function (req, res) {
    var criteria = {};
    var criteria2 = {}
    if (req.params.attrib == 'street' || req.params.attrib == 'zipcode' || req.params.attrib == 'building' || req.params.attrib == 'coord') {

        criteria["address." + req.params.attrib] = req.params.attrib_value;

    } else {
        criteria[req.params.attrib] = req.params.attrib_value;
    }


     if (req.params.attrib2 == 'street' || req.params.attrib2 == 'zipcode' || req.params.attrib2 == 'building' || req.params.attrib2 == 'coord') {

        criteria2["address." + req.params.attrib] = req.params.attrib_value2;

    } else {
        criteria2[req.params.attrib2] = req.params.attrib_value2;
    }

var result={};
for(var key in criteria) result[key]=criteria[key];
for(var key in criteria2) result[key]=criteria2[key];


console.log(result);


    var fieldArray = {};
    fieldArray[req.params.field] = req.params.field_value;
    console.log(fieldArray);
    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var restaurant = mongoose.model('restaurants', restaurantSchema);
        restaurant.update(fieldArray,{$set:result}, function (err, result) {
            if (err) {
                console.log("Error: " + err.message);
                res.write(err.message);
            }
            else {

                
                if (result.nModified == 1)
                    results = {"message": "update done"};
                else
                    results = {"message": "record doesn't exist!!"};
                res.json(results);
                db.close();
            }
        });
    });
});


app.delete('/restaurant_id/:x', function (req, res) {
    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var restaurant = mongoose.model('restaurants', restaurantSchema);
        //Kitten.find({name: new RegExp(req.params.x)},function(err,results){




        restaurant.remove({restaurant_id: req.params.x}, function (err, results) {
            if (err) {
                console.log("Error: " + err.message);
                res.write(err.message);
            }
            else {

                console.log('Delete: ', results.result.n);
                if (results.result.n == 0) {
                    results = {"message": "record doesn't exist!"};
                }
                else {
                    results = {"message": "delete", "restaurant_id": req.params.x};
                }

                res.json(results);
                db.close();
            }
        });

    });
});

app.delete('/:attribu/:x', function (req, res) {
    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var restaurant = mongoose.model('restaurants', restaurantSchema);
        //Kitten.find({name: new RegExp(req.params.x)},function(err,results){


        var criteria = {};
        if (req.params.attrib == 'grade' || req.params.attrib == 'score' || req.params.attrib == 'date') {
            var temp1 = {};
            var temp2 = {};

            temp1[req.params.attrib] = req.params.attrib_value;
            temp2['$elemMatch'] = temp1;

            criteria['grades'] = temp2;
            console.log('Found: ', criteria);

        } else if (req.params.attrib == 'street' || req.params.attrib == 'zipcode' || req.params.attrib == 'building' || req.params.attrib == 'coord') {

            criteria["address." + req.params.attrib] = req.params.attrib_value;

        } else {
            criteria[req.params.attrib] = req.params.attrib_value;
        }

        restaurant.remove(criteria, function (err, results) {
            if (err) {
                console.log("Error: " + err.message);
                res.write(err.message);
            }
            else {

                console.log('Delete: ', results.result.n);
                if (results.result.n == 0) {
                    results = {"message": "record doesn't exist!"};
                }
                else {
                    results = {"message": "deleted"};
                }

                res.json(results);
                db.close();
            }
        });

    });
});

app.delete('/:attrib/:attrib_value/:attrib2/:attrib_value2', function (req, res) {
    mongoose.connect(MONGODBURL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var restaurant = mongoose.model('restaurants', restaurantSchema);
        //Kitten.find({name: new RegExp(req.params.x)},function(err,results){


        var criteria = {};
        var criteria2 = {}
        if (req.params.attrib == 'grade' || req.params.attrib == 'score' || req.params.attrib == 'date') {
            var temp1 = {};
            var temp2 = {};

            temp1[req.params.attrib] = req.params.attrib_value;
            temp2['$elemMatch'] = temp1;

            criteria['grades'] = temp2;
            console.log('Found: ', criteria);

        } else if (req.params.attrib == 'street' || req.params.attrib == 'zipcode' || req.params.attrib == 'building' || req.params.attrib == 'coord') {

            criteria["address." + req.params.attrib] = req.params.attrib_value;

        } else {
            criteria[req.params.attrib] = req.params.attrib_value;
        }


        if (req.params.attrib2 == 'grade' || req.params.attrib2 == 'score' || req.params.attrib2 == 'date') {
            var temp1 = {};
            var temp2 = {};

            temp1[req.params.attrib2] = req.params.attrib_value2;
            temp2['$elemMatch'] = temp1;

            criteria2['grades'] = temp2;
            console.log('Found: ', criteria);

        } else if (req.params.attrib2 == 'street' || req.params.attrib2 == 'zipcode' || req.params.attrib2 == 'building' || req.params.attrib2 == 'coord') {

            criteria2["address." + req.params.attrib2] = req.params.attrib_value2;

        } else {
            criteria2[req.params.attrib2] = req.params.attrib_value2;
        }
console.log('Found: ', criteria2);

        restaurant.remove({$and: [criteria, criteria2]}, function (err, results) {
            if (err) {
                console.log("Error: " + err.message);
                res.write(err.message);
            }
            else {

                console.log('Delete: ', results.result.n);
                if (results.result.n == 0) {
                    results = {"message": "record doesn't exist!"};
                }
                else {
                    results = {"message": "deleted"};
                }

                res.json(results);
                db.close();
            }
        });

    });
});


app.listen(process.env.PORT || 8099);
