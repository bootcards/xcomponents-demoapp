/*
 * ML: Sample script to create a model based on introspection
 * in progress, untested, never worked yet...
 */

var ds = require('../server/data-sources/db.js')('memory');
  
// Instance JSON document
var note = {

	title : "Create an offer",
	description : "Make an offer this customer can't refuse",
	author : "Mark Leusink",
	dateCreated : "2014-11-04T18:25:43.511Z",
	tags : ["todo"]

};

  
// Create a model from the user instance
var Note = ds.buildModelFromInstance('Note', note, {idInjection: true});
  
// Use the model for CRUD
var obj = new Note(note);
  
console.log(obj.toObject());
  
Note.create(note, function (err, u1) {
  console.log('Created: ', u1.toObject());
  Note.findById(u1.id, function (err, u2) {
    console.log('Found: ', u2.toObject());
  });
});

console.log('done');