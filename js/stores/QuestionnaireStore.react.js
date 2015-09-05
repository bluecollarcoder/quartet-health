var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

/**
 * This class stores the current state of the questionnaire. It fires one of four
 * events (begin, back, answer, selectTherapist) when the state of the object
 * changes. It also exposes four properties that an external component can access.
 * @class
 * @extends {EventEmitter}
 * @param {Dispatcher} dispatcher - The dispatcher that will dispatch events to this store.
 * @property {number} current - The current page.
 * @property {array} answers - An array containing the choices the user has chosen so far.
 * @property {array} therapists - If the user is moderately depressed or worse, this array would be populated with a list of recommended therapists.
 * @property {object} therapist - The therapist (if any) chosen by the user.
 * @fires QuestionnaireStore#begin -Fired when the user moves to the first question.
 * @fires QuestionnaireStore#back - Fired when the user moves to the previous question.
 * @fires QuestionnaireStore#answer - Fired when the user completes a question and moves to the next.
 * @fires QuestionnaireStore#selectTherapist - Fired when the user selects a therapist at the end.
 * @throws {Error} - Thrown if this instance is initialized without a dispatcher.
 */
function QuestionnaireStore(dispatcher) {
  if (dispatcher == null)
    throw new Error("The dispatcher must be passed into QuestionnaireStore as argument");

  var self = this;
  // Register this store with the dispatcher
  dispatcher.register(function(action){
    self.emit(action);
  });

  // Call super constructor
  EventEmitter.call(this);

  // private methods
  var updateResult = function(choice){
    this.answers[this.current] = choice;
    var score = _.reduce(this.answers, function(memo,_choice){
      return memo + _choice;
    }, 0);
    // If the running score is 10 or higher, set the list of therapists.
    this.therapists = (score >= 10) ? [
      {"name":"Jon Snow","expertise":"Child Psychology","photo":"static/img/photo-0.jpg"},
      {"name":"Tyrion Lanister","expertise":"Substance Abuse","photo":"static/img/photo-1.jpg"},
      {"name":"Ned Stark","expertise":"Family Counciling","photo":"static/img/photo-2.jpg"}
    ] : [];
  };

  // Override EventEmitter's emit function
  _.extend(this,{
    "current":-1,
    "answers":[],
    "therapists":[],
    "therapist":null,
    "emit":function(action){
      // Decide what to do based on the action type
      switch(action.type){
        case "begin":
          // Set current to first question
          this.current = 0;
          this.answers = [];
          EventEmitter.prototype.emit.call(this,"change");
          break;
        case "answer":
          // Update the results
          updateResult.call(this,action.choice);
          this.current++;
          EventEmitter.prototype.emit.call(this,"change");
          break;
        case "back":
          // Update the results
          if (action.choice != null)
            updateResult.call(this,action.choice);
          this.current--;
          EventEmitter.prototype.emit.call(this,"change");
          break;
        case "selectTherapist":
          this.therapist = this.therapists[action.index];
          EventEmitter.prototype.emit.call(this,"change");
          break;
      }
    }
  });
}
QuestionnaireStore.prototype = Object.create(EventEmitter.prototype);
QuestionnaireStore.prototype.constructor = QuestionnaireStore;

module.exports = QuestionnaireStore;
