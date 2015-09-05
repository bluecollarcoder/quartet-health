var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var assert = require('chai').assert;
var sinon = require('sinon');
var jsdom = require('jsdom');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var jQuery = require('jquery');

var Questionnaire = require("../../js/components/QuestionnaireComponent.react");

// Initialize all the Flux components
var actionCreator = {
  "begin":function(){},
  "answer":function(){},
  "back":function(){},
  "selectTherapist":function(){}
};

describe("QuestionnaireComponent Tests",function(){

  beforeEach(function(){
    global.document = jsdom.jsdom();
    global.window = document.parentWindow;
    global.$ = jQuery(window);

    this.store = new EventEmitter();
  });

  it("should initialize to the intro screen",function(){
    var store = _.extend({},this.store,{
      "current":-1,
      "answers":[],
      "therapists":[],
      "therapist":null
    });
    React.render(<Questionnaire store={store} actionCreator={actionCreator} />,document.body);

    // Check that the intro screen has been rendered
    var $elements = $('.intro-container');
    assert.equal($elements.length,1,"The intro screen should be rendered.");

    // Check that clicking the "next" button triggers the "begin" action
    var spy = sinon.spy(actionCreator,'begin');
    var button = $('button')[0];
    React.addons.TestUtils.Simulate.click(button);
    assert.ok(spy.calledOnce,'The "begin" action should be triggered.');
  });

  it("should load the correct question based on the current state of the store",function(){
    var store = _.extend({},this.store,{
      "current":2,
      "answers":[0,0],
      "therapists":[],
      "therapist":null
    });
    React.render(<Questionnaire store={store} actionCreator={actionCreator} />,document.body);

    // Check that the intro screen has been rendered
    var $elements = $('.question-container');
    assert.equal($elements.length,1,"Question "+store.current+" should be rendered.");
    assert.ok($elements.hasClass('question-'+store.current),"Question "+store.current+" should be rendered.");

    // Check that clicking the "next" button shows the error message
    var button = $('button')[0];
    React.addons.TestUtils.Simulate.click(button);
    var $errorMsg = $('.error-msg');
    assert.ok($errorMsg.is(':visible'),"Error message should be shown.");
  });

  it('should load the correct question when the user click the "back" or the "next" button',function(){
    var store = _.extend({},this.store,{
      "current":2,
      "answers":[0,0],
      "therapists":[],
      "therapist":null
    });
    var instance = React.render(<Questionnaire store={store} actionCreator={actionCreator} />,document.body);

    // Check that clicking the "back" button triggers the "back" action
    var spy = sinon.spy(actionCreator,'back');
    React.addons.TestUtils.Simulate.click($('a.btn')[0]);
    assert.ok(spy.calledOnce,'The "back" action should be triggered.');

    // Click one of the options and set the state
    React.addons.TestUtils.Simulate.click($('.option[value="0"]')[0]);

    // Check that submitting the form triggers the "answer" action
    spy = sinon.spy(actionCreator,'answer');
    React.addons.TestUtils.Simulate.submit($('form')[0]);
    assert.ok(spy.calledOnce,'The "answer" action should be triggered.');
  });

  it('should load the result screen after user has answered the last questions',function(){
    var store = _.extend({},this.store,{
      "current":9,
      "answers":[0,0,0,0,0,0,0,0,0],
      "therapists":[],
      "therapist":null
    });
    var instance = React.render(<Questionnaire store={store} actionCreator={actionCreator} />,document.body);

    // Check that the result screen has been rendered
    var $elements = $('.result-container');
    assert.equal($elements.length,1,"Result screen should be rendered.");
    assert.ok(!$('.therapists-container').is(':visible'),"The therapists section should not be shown.");

    // Re-render the component with therapists
    React.unmountComponentAtNode(document.body);
    store = _.extend({},this.store,{
      "current":9,
      "answers":[3,3,3,3,3,3,3,3,3],
      "therapists":[
        {"name":"Jon Snow","expertise":"Child Psychology","photo":"static/img/photo-0.jpg"},
        {"name":"Tyrion Lanister","expertise":"Substance Abuse","photo":"static/img/photo-1.jpg"},
        {"name":"Ned Stark","expertise":"Family Counciling","photo":"static/img/photo-2.jpg"}
      ],
      "therapist":null
    });
    instance = React.render(<Questionnaire store={store} actionCreator={actionCreator} />,document.body);

    // Check the therapists section has been rendered
    assert.ok($('.therapists-container').is(':visible'),"The therapists section should be shown.");
    assert.equal($('.therapists-container .therapists .therapist').length,3,"The therapists section should be shown.");
    // ... and there are two buttons
    assert.equal($('button').length,2,'There should be a "back" button and a "submit" button.')

    // Select a therapist from the list
    React.addons.TestUtils.Simulate.click($('.therapists-container .therapists .therapist')[0]);

    // Check that submitting the form triggeres the "selectTherapist" action.
    var spy = sinon.spy(actionCreator,"selectTherapist");
    React.addons.TestUtils.Simulate.click($('button')[1]);
    assert.ok(spy.calledOnce,'The "selectTherapist" action should be triggered.');
  });

});
