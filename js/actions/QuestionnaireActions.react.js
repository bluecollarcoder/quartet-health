var dispatcher;

/**
 * A static namespace containing all the actions that are associated with the
 * depression questionnaire. Supported actions: "begin", "back", "answer",
 * "selectTherapist".
 * @namespace
 * @param {Dispatcher} dispatcher - The dispatcher that will dispatch events for this object.
 * @throws {Error} - Thrown if the object initialized without a dispatcher.
 * @returns {object} - The public methods of this namespace.
 */
module.exports = function(_dispatcher){
  if (_dispatcher == null)
    throw new Error("The dispatcher must be passed into QuestionnaireActions as argument");
  else
    dispatcher = _dispatcher;

  /**
   * Return the public methods.
   * @public
   */
  return {
    /**
     * Move the user to the first question.
     */
    "begin":function(){
      dispatcher.dispatch({
        "type":"begin"
      });
    },
    /**
     * Save the answer to the current question and move to the next question.
     * @param {number} choice - The user's answer to the current question.
     */
    "answer":function(choice){
      dispatcher.dispatch({
        "type":"answer",
        "choice":choice
      });
    },
    /**
     * Move the user one question back, saving the answer to the current question.
     * @param {number} choice - The user's answer to the current question.
     */
    "back":function(choice){
      dispatcher.dispatch({
        "type":"back",
        "choice":choice
      });
    },
    /**
     * Persist the user's chosen therapist to the store.
     * @param {number} index - The order in the list of the user's chosen therapist.
     */
    "selectTherapist":function(index){
      dispatcher.dispatch({
        "type":"selectTherapist",
        "index":index
      });
    }
  };
};
