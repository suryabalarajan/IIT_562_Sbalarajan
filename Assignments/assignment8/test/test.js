var expect  = require('chai').expect,
    request = require('request'),
    chai = require('chai'),
    assert = chai.assert;
let chaiHttp = require('chai-http'),
    server = require('../routes/users.js'),
    should = chai.should();

chai.use(chaiHttp);
chai.use(require('chai-json-schema'));

let user = {
  user: {
    name : "surya",    
    email : "surya@gmail.edu"  
  } 
};

let reminder = {  
  reminder : {    
      title : "Homework",  
      description : "Complete my assignemnts"  
    } 
  };

var userId, reminderId ;

var reminderSchema = {
  reminder : {
    title: 'valid reminder schema',
    type: 'object',
    required: [ 'title', 'description'],
    properties: {
      name: {
        type: 'string'
      },
      email: {
        type: 'string'
      }
    }
  }
};         
     
var userSchema = {
  user : {
    title: 'valid user schema',
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: {
        type: 'string'
      },
      email: {
        type: 'string'
      }
    }
  }
};

describe('/GET users', () => {
  it('check for all users', function(done) {
    request('http://localhost:3000/users' , function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('it should GET all the users', (done) => {
    chai.request('http://localhost:3000')
        .get('/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('users');
          res.body.should.have.property('users').to.be.an('array');             
          done();
        });
  });
});
 
 
describe('/POST user', () => {
  it('check user schema', (done) => {
    expect(user).to.be.jsonSchema(userSchema);
    done();
  });

  it('add a user ', (done) => {   
    chai.request('http://localhost:3000')
    .post('/users')
    .send(user)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      console.log(JSON.stringify(res));
      userId =JSON.parse(res.text).id;
      console.log("id from server"+userId);

      done();
    });
  });
    
    
});
 
describe('/GET/:id users', () => {
  it('check for all users with specific id', function(done) {
    request('http://localhost:3000/users/'+userId , function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
    });
  });

  it('it should GET all users with specific id ', (done) => {
    chai.request('http://localhost:3000')
    .get('/users/'+userId)
    .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('name');
        res.body.should.have.property('email');             
        done();
    });
  });
});

describe('/POST reminder', () => {
  it('check reminder schema ', (done) => {
    expect(reminder).to.be.jsonSchema(reminderSchema);
    done();
  });

  it('add a reminder ', (done) => {   
    chai.request('http://localhost:3000')
    .post('/users/'+userId+'/reminders')
    .send(reminder)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      reminderId =JSON.parse(res.text).id;
      console.log("id from server"+userId);
      console.log("id from reminder"+reminderId);
      done();
    });
  });
}); 

describe('/POST second reminder', () => {
  it('add a reminder ', (done) => {
    let reminder = {  
      "reminder" : {    
        "title" : "Project",  
        "description" : "Complete final Project"  
      } 
    };
  chai.request('http://localhost:3000')
    .post('/users/'+userId+'/reminders')
    .send(reminder)
    .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        done();
    });
  });  
});

describe('/delete/:id/reminders/:id', () => {
 it('it should delete the reminder with specific id',(done) => {
  chai.request('http://localhost:3000')
  .delete('/users/'+userId+'/reminders/'+reminderId)
  .end((err,res) => {
    res.should.have.status(204);
    done();
  });
 });
}); 

describe('/delete/:id/reminders', () => {
 it('it should delete the reminder',(done) => {
  chai.request('http://localhost:3000')
  .delete('/users/'+userId+'/reminders/')
  .end((err,res) => {
    res.should.have.status(204);
    done();
  });
 });
}); 

describe('/delete/:id', () => {
 it('it should delete the user',(done) => {
  chai.request('http://localhost:3000')
  .delete('/users/'+userId)
  .end((err,res) => {
    res.should.have.status(204);
    done();
  });
 });
});


