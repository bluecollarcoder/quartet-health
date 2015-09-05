var assert = require('chai').assert;
var sinon = require('sinon');
var QuestionnaireStore = require('../../js/stores/QuestionnaireStore.react');

var dispatcher = {
  "register":function(callback){}
};

describe("QuestionnaireStore Tests",function(){

  beforeEach(function(){
    this.store = new QuestionnaireStore(dispatcher);

    var self = this;
    this.callCount = 0;
    this.store.on("change",function(){
      self.callCount++;
    });
  });

  it('should initialize with the correct properties',function(){
    assert.equal(this.store.current,-1);
    assert.deepEqual(this.store.answers,[]);
    assert.deepEqual(this.store.therapists,[]);
  });

  it('should handle the "begin" action',function(){
    this.store.emit({"type":"begin"});
    assert.equal(this.store.current,0,"Current should point to the first question.");
    assert.equal(this.callCount,1);

    // Calling "begin" on an on-going questionnaire should reset it
    this.store.current = 3;
    this.store.answers = [1,2,3];
    this.store.emit({"type":"begin"});
    assert.equal(this.store.current,0,"Current should point to the next question.");
    assert.deepEqual(this.store.answers,[],"Answers should be emptied.");
    assert.equal(this.callCount,2);
  });

  it('should handle the "answer" action',function(){
    // Severity less than the threshold
    this.store.current = 3;
    this.store.answers = [0,0,0];
    this.store.emit({"type":"answer","choice":3});
    assert.equal(this.store.current,4,"Current should point to the next question.");
    assert.deepEqual(this.store.answers,[0,0,0,3],"Answers should be updated.");
    assert.equal(this.store.therapists.length,0,"Therapists should still be empty.");
    assert.equal(this.callCount,1);

    // Severity over the threshold
    this.store.current = 3;
    this.store.answers = [3,3,3];
    this.store.emit({"type":"answer","choice":3});
    assert.deepEqual(this.store.answers,[3,3,3,3],"Answers should be updated.");
    assert.equal(this.store.therapists.length,3,"Therapists should not be empty.");
    assert.equal(this.callCount,2);
  });

  it('should handle "back" action',function(){
    this.store.current = 3;
    this.store.answers = [3,3,3];
    this.store.emit({"type":"back","choice":3});
    assert.deepEqual(this.store.answers,[3,3,3,3],"Answers should be updated.");
    assert.equal(this.store.current,2,"Current should point to the last question.");
    assert.equal(this.callCount,1);
  });

  it('should handle "selectTherapist" action',function(){
    // Set up
    this.store.current = 3;
    this.store.answers = [3,3,3];
    this.store.emit({"type":"answer","choice":3});

    // Do the actual selection
    this.store.emit({"type":"selectTherapist","index":2});
    assert.equal(this.store.therapist.name,"Ned Stark");
    assert.equal(this.callCount,2);
  });

});
