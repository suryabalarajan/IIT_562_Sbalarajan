var express = require('express');
    router = express.Router(),
    mongo = require('mongodb'),
    ObjectID = mongo.ObjectID,
    Server = mongo.Server,
    Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('userDB', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'userDB' database");

        db.collection('userDB', {strict:true}, function(err, collection) {
            if (err) {
            	
                console.log("The user collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

var populateDB = function() {

    var users = [
    	{
    		"user": {
					"name": "Example Name",
					"email": "example@gmail.com"
					},
			"reminder": [
                {
                    "rid": new ObjectID(),
					"title": "Example Title",
					"description": "Example Description",
					"created": new Date()
				}
            ]
		},
        {
            "user": {
                    "name": "Example Name2",
                    "email": "example2@gmail.com"
                    },
            "reminder": [
                {
                    "rid": new ObjectID(),
                    "title": "Example Title2",
                    "description": "Example Description2",
                    "created": new Date()
                }
            ]
        }
    ];

	db.collection('userDB', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {
            console.log(result);
        });
    });   
};

exports.findAll = function(req, res) {
    db.collection('userDB', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if (err) res.status(404);
            else {
                res.status(200).render('users', {title : 'users', users : items});
            }

        });
    });
};

exports.findById = function(req, res) {

    var id = req.params.id;
    console.log('Retrieving User: ' + id);

    db.collection('userDB', function(err, collection) {
        collection.find({'_id':new mongo.ObjectID(id)}).toArray(function(err, item) {
            if (err) res.status(404);
            else {
                console.log(item);
                res.status(200).render('users/id', {title : 'users', user : item[0]});
            }    
        });
    });
    
};

exports.findReminders = function(req, res) {
    
    var id = req.params.id;
    console.log('Retrieving User: ' + id);

    console.log("parameter absent");
    db.collection('userDB', function(err, collection) {
        collection.find({'_id':new mongo.ObjectID(id)}).toArray(function(err, item) {
            if (err) res.status(404);
            else {
                console.log("remidners : " + item[0].reminder);
                res.status(200).render('users/id/reminder', {title : 'Reminders', reminders : item[0].reminder, id : id}); 
            }    
        });
    });
};

exports.findremindersbyID = function(req, res) {
    
    var id = req.params.id;
    console.log('Retrieving Reminder: ' + id);
    var rid = req.params.rid;
    console.log("Retrieving rid : " + rid);
    var result;

    db.collection('userDB', function(err, collection) {
        collection.find({reminder : {$elemMatch: {'rid' : new mongo.ObjectID(rid)} }}).toArray(function(err, item) {
            if (err) res.status(404);
            else {
                console.log(item);
                if(item.length != 0) {
                    var reminderArr = item[0].reminder;
                    console.log(item[0].reminder);

                    if(item[0].reminder.length > 0){
                        for(var i = 0; i < item[0].reminder.length; i++){
                            if(item[0].reminder[i].rid.equals(rid) ) {
                                result = item[0].reminder[i];
                                console.log(result);
                            }
                        }
                    }
                    res.status(200).render('users/id/reminder/rid', {title : 'Reminder', reminder : result});
                    // res.status(200).send(result);    
                } else {

                    res.send("No Content Found");
                }
            }
        });
    });
};

exports.getnewuser = function(req, res) {


    console.log(req.body);

    res.render('adduser', {title : 'Add User', user: {} });
    
};

exports.getnewreminders = function(req, res) {


    console.log(req.body);

    res.render('addnewreminders', {title : 'Add New Reminders', reminder: {} });
    
};

exports.addreminders = function(req, res) {

    console.log(req.body.title);
    var id = req.params.id;

    var reminder = {
        "reminder": [
                {
                    "rid": new ObjectID(),
                    "title": req.body.title,
                    "description": req.body.description,
                    "created": new Date()
                }
            ]
    };

    db.collection('userDB', function(err, collection) {
        collection.update({'_id':new mongo.ObjectID(id)}, {$push: {reminder}},  function(err, result) {
            if (err) {
                console.log(result);
                res.status(404).send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + result);
                db.collection('userDB', function(err, collection) {
                    collection.find({'_id':new mongo.ObjectID(id)}).toArray(function(err, item) {
                        if (err) res.status(404);
                        else {
                            console.log("remidners : " + item[0].reminder);
                            res.status(200).render('users/id/reminder', {title : 'Reminders', reminders : item[0].reminder, id : id}); 
                        }    
                    });
                });
            }
        });
    });
};

exports.adduser = function(req, res) {

    console.log("res.body : " + req.body.name);

    var user = {
        "user" : {
            "name" : req.body.name,
            "email" : req.body.email
        }        
    };
    console.log('Adding User: ' + user[0]);
    db.collection('userDB', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.status(404).send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + result["ops"][0]["_id"]);
                db.collection('userDB', function(err, collection) {
                    collection.find().toArray(function(err, items) {
                        if (err) res.status(404);
                        else {
                            res.status(200).render('users', {title : 'users', users : items});
                        }

                    });
                });   
            }
        });
    });
};



exports.deleteuser = function(req, res) {

    var id = req.params.id;
    console.log('Deleting User: ' + id);
    db.collection('userDB', function(err, collection) {
        collection.remove({'_id':new mongo.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.status(404).send("404 User does not exist");
            } else {
                console.log(" n : " + result.result.n);
                if(result.result.n === 0 ) {
                    res.send("404 User does not exist");
                } else {
                    res.status(204).render('deleteuser', {title : 'Delete User', user : {} });
                }
            }
        });
    });
    
};
