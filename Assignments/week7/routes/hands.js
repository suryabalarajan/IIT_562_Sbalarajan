var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db;
    // BSON = mongo.BSONPure;


var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('hand_db', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'hand_db' database");
        db.collection('hands', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The hands collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving hand: ' + id);

    db.collection('hands', function(err, collection) {
        collection.find({'_id':new mongo.ObjectID(id)}).toArray(function(err, item) {
            if (err) res.status(404);
            else res.status(200).send(item);    
        });
    });
};

exports.findById_cards = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving hand: ' + id);

    db.collection('hands', function(err, collection) {
        collection.find({'_id':new mongo.ObjectID(id)}).toArray(function(err, item) {
            if (err) res.status(404);
            else res.status(200).send(item[0].cards);    
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('hands', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if (err) res.status(404);
            else res.send(items);
        });
    });
};

exports.addHand = function(req, res) {
    var hand = req.body;
    console.log('Adding hand: ' + hand);
    db.collection('hands', function(err, collection) {
        collection.insert(hand, {safe:true}, function(err, result) {
            if (err) {
                res.status(404).send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + result[0]);
                res.status(200).send(result[0]);
            }
        });
    });
}

exports.updateHand = function(req, res) {
    var id = req.params.id;
    var hand = req.body;
    console.log('Updating hand: ' + id);
    console.log(hand);
    db.collection('hands', function(err, collection) {
        collection.update({'_id':new mongo.ObjectID(id)}, hand, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating hand: ' + err);
                res.status(404).send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.status(200).send(hand);
            }
        });
    });
}

var populateDB = function() {

    var hands = [
        {
            "handsid" : "0",
            "description" : "Five of a kind",
            "cards": [
                {
                    "suit" : "spades",
                    "rank" : "a" 
                },
                {
                    "suit" : "clubs",
                    "rank" : "a"    
                },
                {
                    "suit" : "diamonds",
                    "rank" : "a"
                },
                {
                    "suit" : "hearts",
                    "rank" : "a"
                },
                {
                    "suit" : "none",
                    "rank" : "joker"
                }
            ]
        },
        {
            "handsid" : "1",
            "description" : "Five of a kind",
            "cards": [
                {
                    "suit" : "spades",
                    "rank" : "2" 
                },
                {
                    "suit" : "clubs",
                    "rank" : "2"    
                },
                {
                    "suit" : "diamonds",
                    "rank" : "2"
                },
                {
                    "suit" : "hearts",
                    "rank" : "2"
                },
                {
                    "suit" : "none",
                    "rank" : "joker"
                }
            ]   
        }
    ];

    db.collection('hands', function(err, collection) {
        collection.insert(hands, {safe:true}, function(err, result) {});
    });

};
