var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser')
  , path = require('path')

var app = express();
app.use(bodyParser());
app.use(express.static( path.resolve( __dirname + '/../app' ) ) );

var db = mongoskin.db('mongodb://@localhost:27017/dack', {safe:true})

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})

app.get('/', function(req, res, next) {
  //res.send('please select a collection, e.g., /collections/messages')
  res.sendfile( path.resolve( './app/index.html' ) );
})

app.get( '/id/:id/transactions', function(req, res, next) {
  db.collection("dackCollection").find( { user:parseInt(req.params.id) }, {} ).toArray(function( e, results ) {
    if (e) return next (e);
    res.send(results);
  });
}); //fetches transaction for specific user

app.get( '/transactions', function(req, res, next) {
  db.collection("dackCollection").find( {}, {} ).toArray(function( e, results ) {
    if (e) return next (e);
    res.send(results);
  });
}); //fetch all transactions

app.get( '/transactions/:id', function(req, res, next) {
  db.collection("dackCollection").findById( req.params.id, function( e, results ) {
    if (e) return next (e);
    res.send(results);
  });
}); //fetch all transaction by specific id

function include(arr, obj) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === obj) return true;
  }
    return false
  }

app.get('/tags', function(req, res, next) {
  db.collection("dackCollection").find({}, {tags:1}).toArray(function(e, results)
  {
    if (e) return next (e);
    var allTags = [];
    var result = [];
    for (var i = 0; i < results.length; i++) {
      allTags.push(results[i].tags);
    }

    for (var i = 0; i < allTags.length; i++) {
      if (!(include(result, allTags[i]))) {
        result.push(allTags[i]);
      } 
    }
    res.send(result);
  })
   
}); //get all tags

app.put('/transactions/:transaction/tags', function(req, res, next) {
  db.collection("dackCollection").updateById(req.params.transaction, {$set: {tags:req.body.tags}}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg: 'error'})
  })
}); //update the tags on particular transactions



app.post('/transactions/:transaction/split', function(req, res, next) {
  db.collection("dackCollection").findById( req.params.transaction, function(e, transaction) {
    console.log( req.body );

    if (req.body.amount1 > transaction.amount || req.body.amount1 <= 0) {
      res.send({message: "Invalid transaction amount, this doesn't make sense...."});
    } else {
  
     var half1 = {
      "transaction": transaction.transaction + "a",
      "details" : {
        "date" : transaction.details.date
      },
      "tags" : req.body.tag1,
      "user" : transaction.user,
      "amount" : req.body.amount1
    };
         
    var half2 = {
      "transaction": transaction.transaction + "b",
      "details" : {
        "date" : transaction.details.date
                  },
      "tags" : req.body.tag2,
      "user" : transaction.user,
      "amount" : transaction.amount - req.body.amount1
    };

    db.collection("dackCollection").insert( half1, {}, function(e, newlyInserted) {
      db.collection("dackCollection").insert( half2, {}, function(e, newlyInserted2) {
        db.collection("dackCollection").removeById( transaction._id, function( e, result ) {
          res.send( { message:" it worked!"} );
        });
      });
    }); 
   };
  }); 
 });
//splits a particular transaction and allows to set a new tag to the split transaction
  

/*
  req.collection.insert(req.body, { }, function(e, results){
    if (e) return next(e)
    res.send(results)
  })

*/

 

app.get('/collections/:collectionName', function(req, res, next) {

  req.collection.find({} ,{limit:10, sort: [['_id',-1]]}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.post('/collections/:collectionName', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

app.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.del('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})



app.listen(3000)
console.log( "Listening on port 3000" );