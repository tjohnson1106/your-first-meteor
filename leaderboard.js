PlayersList = new Mongo.Collection('players');
 
console.log("Hello world");
 
if (Meteor.isClient) {
  Template.leaderboard.helpers({
    'player': function(){
      return "Some other text"
  }
});
}

if(Meteor.isServer) {

	
}