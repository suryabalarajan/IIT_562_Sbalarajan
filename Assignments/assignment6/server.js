var mongo = require('mongodb'),
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
            else res.send(items);
        });
    });
};

exports.findById = function(req, res) {

    var id = req.params.id;
    console.log('Retrieving User: ' + id);

    db.collection('userDB', function(err, collection) {
        collection.find({'_id':new mongo.ObjectID(id)}).toArray(function(err, item) {
            if (err) res.status(404);
            else res.status(200).send(item);    
        });
    });
    
};

exports.findReminders = function(req, res) {
    
    var id = req.params.id;
    console.log('Retrieving User: ' + id);

    if(typeof req.query.title != "undefined") {
        console.log(req.query.title);
        var result;
        db.collection('userDB', function(err, collection) {
        collection.find({reminder : {$elemMatch: {'title' : req.query.title} }}).toArray(function(err, item) {
            if (err) res.status(404);
            else {
                console.log(item);
                if( item.length !== 0) {
                    var reminderArr = item[0].reminder;
                    console.log(item[0].reminder);

                    if(item[0].reminder.length > 0){
                        for(var i = 0; i < item[0].reminder.length; i++){
                            if(item[0].reminder[i].title === req.query.title ) {
                                result = item[0].reminder[i];
                                console.log(result);
                            }
                        }
                    }
                    res.status(200).send(result); 
                } else {
                    res.send("No Content found");
                } 
                   
            }
        });
    });

    } else {
        console.log("parameter absent");
        db.collection('userDB', function(err, collection) {
            collection.find({'_id':new mongo.ObjectID(id)}).toArray(function(err, item) {
                if (err) res.status(404);
                else res.status(200).send(item[0].reminder);    
            });
        });
    }  

    
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
                    res.status(200).send(result);    
                } else {
                    res.send("No Content Found");
                }
            }
        });
    });
};

exports.adduser = function(req, res) {

    var user = req.body;
    console.log('Adding User: ' + user[0]);
    db.collection('userDB', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.status(404).send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + result["ops"][0]["_id"]);
                res.status(200).send("id: " + result["ops"][0]["_id"]);
            }
        });
    });
    
};

exports.addreminders = function(req, res) {

    var reminder = req.body.reminder;
    var id = req.params.id;

    console.log("id : " + id);
    console.log("reminder : " + reminder);
    reminder.created = new Date();
    reminder.rid = new ObjectID();

    db.collection('userDB', function(err, collection) {
        collection.update({'_id':new mongo.ObjectID(id)}, {$push: {reminder}},  function(err, result) {
            if (err) {
                console.log(result);
                res.status(404).send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + result);
                res.status(200).send("id: " + reminder.rid);
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
                res.send("404 User does not exist");
            } else {
                console.log(" n : " + result.result.n);
                if(result.result.n === 0 ) {
                    res.send("404 User does not exist");
                } else res.send("204 No Content");
            }
        });
    });
    
};

exports.deletereminders = function(req, res) {

    var id = req.params.id;

    console.log("id : " + id);

    db.collection('userDB', function(err, collection) {
        collection.update({'_id': new mongo.ObjectID(id)}, {$set : {'reminder' : [] }  },  function(err, result) {
            if (err) {
                res.status(404).send(result);
            } else {
                console.log('Success: ' + result);
                res.send("204 No Content");
            }
        });
    });
};

exports.deleteremindersbyID = function(req, res) {
    
    var id = req.params.id;
    var rid = req.params.rid;

    console.log("id : " + id);

    db.collection('userDB', function(err, collection) {
        collection.update({'_id':new mongo.ObjectID(id)}, {$pull : {"reminder" : {"rid" : new mongo.ObjectID(rid)} } },  function(err, result) {
            if (err) {
                res.status(404).send(result);
            } else {
                console.log('Success: ' + result);
                res.send("204 No Content");
            }
        });
    });
};
