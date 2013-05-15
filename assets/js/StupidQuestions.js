// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Questions = new Meteor.Collection("questions");

if (Meteor.isClient) {
  Template.room.questions = function () {
    return Questions.find({}, {sort: {rank: -1}});
  };

  Template.room.events({
    'click #add-question': function () {
      //Players.update(Session.get("selected_player"), {$inc: {score: 5}});
      Questions.insert({question: $('#new-question').val(), rank: 0});
    },
    'click .up-vote' : function() {
      Questions.update(this._id, {$inc: {rank: 5}});
    },
    'click .down-vote' : function() {
      Questions.update(this._id, {$inc: {rank: -5}});
    }
  });

}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Questions.find().count() === 0) {
      var questions = ["Who are you?",
                   "What's that smell?",
                   "How old are you?",
                   "Do you want to hear about my startup?",
                   "Can I use your talk as a soapbox for my own opinions?",
                   "Can you go back to that slide with the thing?"];
      for (var i = 0; i < questions.length; i++)
        Questions.insert({question: questions[i], rank: Math.floor(Random.fraction()*10)*5});
    }
  });
}
