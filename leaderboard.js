// We don't use the 'var' keyword below, because we want to create
// a global variable.
PlayersList = new Mongo.Collection('players');

// The code below display itself in BOTH the command line (server) AND
// the client (look in the DevTools console) because it is running on both.
console.log("Hello World from Meteor!");

// Now if we add a conditional:
if(Meteor.isClient){
  // This code only runs on the client! (you'll see it in the DevTools console only!)
  // console.log("Hello Client!");
  //=====================================================================
  // The below is deprecated, but it gives us a good example of how helpers work.
  // 1 - The Template keyword searches through the templates in our Meteor application
  // 2 - The leaderboard keyword is a reference to the name of the template we created
  // earlier.  Every helper function we create needs to be attached to an individual template.
  // 3 - The player keyword is a name we're giving to this function.  You can choose whatever
  // name you like but do know that we'll soon reference it from inside the HTML file.
  // Template.leaderboard.player = function(){
  //  return "some text from the helper function"
  //   }
  //=================================================================
  // Instead, we create a block.  We use the JSON format in between the curly brackets.
  // Note:  This is just like an object (more or less), and the syntax for declaring
  // functions in object literals.
  Template.leaderboard.helpers({
    'player': function(){
        // by passing in in the sort method, we define how we want to sort
        // our players.  In this case we sort by the 'score'
        // attribute, -1, which displays (sorts) the players in descending order.
        // Problem is...what happens if two players have the same score?  In
        // that case, we want to sort alphabetically as well, so we sort by name
        // secondarily.
        return PlayersList.find({}, {sort: {score: -1, name: 1} } );
    },
    'selectedClass': function() {
        // return "selected";
        // the code below is important!  We are retrieving the unique ID of the player.
        // Instead of it appearing in the console though, it will appear inside
        // of the 'class' attribute for the 'li' elements (via the each block).
        // Inspecting this in Dev Tools shows you each player's unique ID.
        // Here is what is happening:
        // 1 - When a user clicks on one of the players in the list, the unique ID of that player
        // is stored inside a sessionthat we've named "selectedPlayer".
        // 2 - The ID stored in that session is then matched against all of the IDs of the players
        // in the list.  Because the player's ID will always be unique, there can only ever be
        // a single match, and when there is a match, the static text of "selected" will be
        // returned by the selectedClass function and placed inside the 'class' attribute for that
        // player's 'li' element.
        // 3 - the background color is then changed to yellow.
        var playerId = this._id;
        var selectedPlayer = Session.get('selectedPlayer');
        if (playerId == selectedPlayer) {
          return "selected"; // this matches up with the selected CSS class, so it turns it yellow.
        }
      }
  });
  // We can create events in Meteor that we're able to trigger the execution of.
  // Example:
  // Template.leaderboard.events();
  // Just like helpers, events have to be tied to templates.  We format our events
  // similarly to helpers.  The 'click' is the event type.
  Template.leaderboard.events({
    //'click': function() {
    //    console.log("You clicked something");
    // }
    // While randomly clicking things are fun, we want it to trigger when something specific
    // is clicked (such as an 'li' element or a button, and we want it to be useful.)
    // To do this, we'll use event selectors.  We'll also attach the player class to the
    // li element to specify on what specifically we want our event to be triggered.
    'click .player': function() {
        var playerId = this._id;
        Session.set('selectedPlayer', playerId);
    },
      // Below we add the MongoDB update function.  Between the brackets, we define:
      // 1 - What document we want to modify.
      // 2 - How we want to modify it.
      // If we leave this as is and click on the player, we get a whole
      // bunch of errors: 'errorClass: MinimongoError: Modifier must be an object...'
      // So, we have to pass a second argument into the update function that determines
      // what part of the document we want to modify.
      // We need to use a MongoDB operator that allows us to set the value of the score field
      // without ever deleting the document.
      // - We use the 'set' operator that we can use to modify the value of a field
      // (or multiple fields) without deleting the document.  So after the colon, we just pass
      // through the fields we want to modify and their new values:
      // PlayersList.update(selectedPlayer, {$set: {score: 5} });
      // BUT, $set will do only that, "set" the value to 5.  We want to increment the value
      // by 5, so we do the following:
      'click .increment': function() {
          var selectedPlayer = Session.get('selectedPlayer');
          PlayersList.update(selectedPlayer, {$inc: {score: 5} });
      },
      'click .decrement': function() {
          var selectedPlayer = Session.get('selectedPlayer');
          PlayersList.update(selectedPlayer, {$inc: {score: -5} });
      }
  });
}