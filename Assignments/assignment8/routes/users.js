var express = require('express');
    router = express.Router();

function Data() {
    this.users = [];
    this.userId = 1;
    this.rId = 1;
}

Data.prototype.find = function (id) {
    var user = this.users.filter(function(item) {
        return item.userId == id;
    })[0];
    if (null == user) {
        throw new Error('user not found');
    }
    return user;
}

Data.prototype.findIndex = function (id) {
    var index = null;
    this.users.forEach(function(item, key) {
        if (item.userId == id) {
            index = key;
        }
    });
    if (null == index) {
        throw new Error('user not found');
    }
    return index;
}

Data.prototype.findAll = function () {
    return this.users;
}

Data.prototype.save = function (user) {
    if (user.userId == null || user.userId == 0) {
        user.userId = this.userId;
        this.users.push(user);
        this.userId++;
        return user.userId;
    } else {
        var index = this.findIndex(user.userId);
        this.users[index] = user;
         return user.userId;
    }

}

Data.prototype.remove = function (id) {
    var index = this.findIndex(id);
    this.users.splice(index, 1);
}

Data.prototype.addReminder = function (task,reminder) {
 
	var prevRem = task.reminders;
	var newReminder,newRID;
      
    if (prevRem == null ) {
        reminder.remId = this.rId;
        reminder.created= new Date();
        this.rId++;
        newRID= reminder.remId;
        newReminder = [reminder];
    } else {
        reminder.remId = this.rId;
        reminder.created= new Date();
        newRID = reminder.remId;
        this.rId++;
        prevRem.push(reminder);
        newReminder = prevRem;
    }
    console.log("new remidner : " + newReminder[0].created);
    usersData.save({
    	userId: task.userId,
        name: task.name,
        email: task.email,
        reminders: newReminder
    });
    return newRID;

}

var usersData = new Data();

exports.findAll = function(req, res) {
	
    res.status(200);
    res.json({"users" : usersData.findAll()});  
};

exports.findById = function(req, res) {
	var id = req.params.id;
    try {
        var user= usersData.find(id);
        console.log("user : " + user.reminders);
        var result = {"Id" : user.userId, "name":user.name,"email":user.email, "reminders:": user.reminders};
        res.statusCode= 200;
        res.json(result);
        
    } catch (exeception) {
        res.sendStatus(404);
    }
    
};

exports.findReminders = function(req, res) {
    var userId = req.params.id;
    var result = "",
    	arrReminders = [];
    try {
        console.log("id =="+userId);
        console.log("response"+usersData.find(userId).reminders);
        result = usersData.find(userId).reminders;

        console.log("result lenght : " + result.length);
        
        result.forEach(function(item, key) {
            mTemp="";
            console.log("item : " +item[0].title)
            mTemp = {
            	"rId" : item.remId,
            	"created":item.created,
            	"title":item[0].title,
            	"description":item[0].description,
            };
            console.log(mTemp);
            arrReminders.push(mTemp);
        });
        console.log("arrReminders : " + arrReminders);
        res.json(arrReminders);
        
    } catch (exeception) {
        res.sendStatus(404);
    }
};

exports.findremindersbyID = function(req, res) {
    var userId = req.params.id;
    var reminderId = req.params.rid;
    var result=[],
    	mTemp="";
    try {
        console.log(reminderId);
        var reminder = usersData.find(userId).reminders;
        var mReminders= reminder.filter(function(item) {
            return item.remId == reminderId;
        });
        
        mReminders.forEach(function(item, key) {
            mTemp="";
            console.log("item : " +item[0].title)
            mTemp = {
            	"rId" : item.remId,
            	"created":item.created,
            	"title":item[0].title,
            	"description":item[0].description,
            };
            console.log(mTemp);
            result.push(mTemp);
        });
 
        res.statusCode= 200;
        res.json(result);
    } catch (exeception) {
        res.sendStatus(404);
    }
};

exports.adduser = function(req, res) {
    var user = req.body;
    var id = usersData.save( 
    {
        name: user.user.name,
        email: user.user.email
    });

    var result = { "id": id };
    res.statusCode= 200;
    res.json(result);
};

exports.addreminders = function(req, res) {
	var reminder = req.body;
    var userId = req.params.id;

    try {
        var user = usersData.find(userId);
        var remId= usersData.addReminder(user,reminder.reminder);

        console.log("success"+remId);
        var result = {"id":remId};
        res.statusCode= 200;
        res.json(result);
    } catch (exception) {
        console.log("exception");
        res.sendStatus(404);
    }    
};

exports.deleteuser = function(req, res) {
	console.log("request.params.id id to remove "+req.params.id);
    try {
        usersData.remove(req.params.id);
        var result = { "success" : "no content found" };
        
        res.status(204).send("No Content Found");
    } catch (exeception) {
        res.sendStatus(404);
    }
    
};

exports.deletereminders = function(req, res) {
    var userId = req.params.id;
    
    try {
        var user = usersData.find(userId);

        usersData.save({
			userId: user.userId,
            name: user.name,
        	email: user.email
        });
        
        res.statusCode = 204;
        res.json("No Content Found");
        
    } catch (exception) {
        console.log("exception");
        res.sendStatus(404);
    }
};

exports.deleteremindersbyID = function(req, res) {
    var userId = req.params.id;
    var reminderId = req.params.rid;
    var index = null;
    try {
        var user = usersData.find(userId);
        var mReminder= user.reminders;
        
        
        mReminder.forEach(function(item, key) {
            if (item.remId == reminderId) {
                index = key;
            }
        });
        
        mReminder.splice(index, 1);
        usersData.save({
            userId: user.userId,
            name: user.name,
            email: user.email,
            reminders: mReminder
        });
        res.statusCode= 204;
        res.json("No content found"); 
    } catch (exception) {
        console.log("exception");
        if (null == index) {
            response.json("reminder not found").sendStatus(404);
        }
        res.sendStatus(404);
    }
};

