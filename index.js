/*
 * Load external dependencies
 */
var React = require("react");
var Dispatcher = require("flux").Dispatcher;
var Store = require("./js/stores/QuestionnaireStore.react");
var ActionCreator = require("./js/actions/QuestionnaireActions.react");
var Questionnaire = require("./js/components/QuestionnaireComponent.react");

// Initialize all the Flux components
var dispatcher = new Dispatcher();
var store = new Store(dispatcher);
var actionCreator = ActionCreator(dispatcher); // Singleton

// Render the Questionnaire component
React.render(<Questionnaire store={store} actionCreator={actionCreator} />, $(".content")[0]);
