var React = require("react");
var _ = require("underscore");

// Styles used in this component
var styles = {
  "dotsContainer":{
    "marginLeft":"auto",
    "marginRight":"auto",
    "width":"14.4em",
    "marginTop": "1em",
    "marginBottom": "1em"
  },
  "dot":{
    "float":"left",
    "width":"0.6em",
    "height":"0.6em",
    "borderRadius":"0.3em",
    "margin":"0.5em",
    "backgroundColor":"#AAA"
  },
  "current":{
    "backgroundColor":"#0071bc"
  },
  "content":{
    "padding":"4rem 6rem",
    "backgroundColor":"#FFF",
    "borderRadius":"15px"
  },
  "questionText":{
    "fontSize":"1.2em",
    "fontWeight":600,
    "margin":"1em 0"
  },
  "optionsContainer":{
    "marginTop":"1.5em"
  },
  "option":{
    "border":"solid 1px #CCC",
    "width":"15em",
    "marginLeft":"auto",
    "marginRight":"auto",
    "padding":"0.5em",
    "marginTop":"-1px",
    "cursor":"pointer",
    "fontSize":"1.2em"
  },
  "optionFirst":{
    "borderTopLeftRadius":"15px",
    "borderTopRightRadius":"15px"
  },
  "optionLast":{
    "borderBottomLeftRadius":"15px",
    "borderBottomRightRadius":"15px"
  },
  "optionSelected":{
    "backgroundColor":"#CCC"
  },
  "buttonContainer":{
    "marginTop":"1.5em"
  },
  "button":{
    "margin":"0 1.5em 0 1.5em"
  },
  "errorMsg":{
    "marginTop":"20px",
    "color":"red",
    "display":"none"
  },
  "result":{
    "fontSize":"1.2em",
    "fontWeight":600
  },
  "therapists":{
    "marginTop":"1em",
    "marginLeft":"auto",
    "marginRight":"auto",
    "width":"13em"
  },
  "therapist":{
    "padding":"0.5em",
    "textAlign":"left",
    "cursor":"pointer",
    "borderRadius":"15px"
  },
  "photo":{
    "float":"left",
    "width":"50px",
    "height":"50px",
    "marginRight":"1em",
    "backgroundColor":"#F1F1F1"
  },
  "name":{
    "fontWeight":600,
    "fontSize":"1.2em"
  },
  "expertise":{
    "color":"#777"
  },
  "condition":{
    "none":{"color":"blue"},
    "mild":{"color":"green"},
    "moderate":{"color":"goldenrod"},
    "moderatelySevere":{"color":"orange"},
    "severe":{"color":"red"}
  }
};

// The list of questions in the questionnaire
var questions = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
  "Trouble concentrating on things, such as reading the newspaper or watching television?",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
  "Thoughts that you would be better off dead, or of hurting yourself in some way?	"
];

/**
 * The action creator that will handle triggering the appropriate event for each
 * action.
 * @private
 */
var actionCreator;

/**
 * Component for the intro screen.
 * @private
 */
var Intro = React.createClass({
  "render":function(){
    return <div className="intro-container">
      <p>Please complete this 9-question questionnaire to help us assess whether you are suffering from depression.</p>
      <div style={styles.buttonContainer}><button className="btn btn-primary" style={styles.button} onClick={this._doNext}>Begin</button></div>
    </div>;
  },
  "_doNext":function(){
    // Move the user to the first question.
    actionCreator.begin();
  }
});

/**
 * Component for the question screens.
 * @private
 */
var Question = React.createClass({
  "getInitialState":function(){
    // If the user has already answer this question, persist it to the state.
    return {"choice":this.props.choice};
  },
  "componentWillReceiveProps":function(nextProps){
    // If the user has already answer this question, persist it to the state.
    this.setState({"choice":nextProps.choice});
  },
  "render":function(){
    var className = "question-container question-"+this.props.index;
    return <div className={className}>
      <p>Over the last two weeks, how often have you been bothered by:</p>
      <p style={styles.questionText}>{questions[this.props.index]}</p>
      <form onSubmit={this._doSubmit}>
        <div style={styles.optionsContainer}>
          <div className="option" ref="option-0" onClick={this._doSelect} value="0" style={
            _.extend({}, styles.option, styles.optionFirst, (this.state.choice == 0) ? styles.optionSelected : null)
          }>Not at all</div>
          <div className="option" ref="option-1" onClick={this._doSelect} value="1" style={
            _.extend({}, styles.option, (this.state.choice == 1) ? styles.optionSelected : null)
          }>Several days</div>
          <div className="option" ref="option-2" onClick={this._doSelect} value="2" style={
            _.extend({}, styles.option, (this.state.choice == 2) ? styles.optionSelected : null)
          }>More than half the days</div>
          <div className="option" ref="option-3" onClick={this._doSelect} value="3" style={
            _.extend({}, styles.option, styles.optionLast, (this.state.choice == 3) ? styles.optionSelected : null)
          }>Nearly every day</div>
        </div>
        <div className="error-msg" ref="errorMsg" style={styles.errorMsg}>Please choose one of the options before continuing.</div>
        <div style={styles.buttonContainer}>
          {this.props.index > 0 ? <a className="btn btn-primary" style={styles.button} onClick={this._doBack}>Back</a> : null}
          <button className="btn btn-primary" style={styles.button}>Next</button>
        </div>
      </form>
    </div>;
  },
  // Called when the user selects one of the options.
  "_doSelect":function(e){
    var $target = $(e.target);
    this.setState({
      "choice":parseInt($target.attr("value"))
    });
    // Hide the error message
    $(this.refs.errorMsg.getDOMNode()).hide();
  },
  // Called when the user hits the "next" button to move to the next question.
  "_doSubmit":function(e){
    e.preventDefault();
    if (this.state.choice != null)
      actionCreator.answer(this.state.choice);
    else
      // User has not made a choice, show the error message
      $(this.refs.errorMsg.getDOMNode()).show();
  },
  // Called when the user hits the "back" button to move to the previous question.
  "_doBack":function(e){
    e.preventDefault();
    actionCreator.back(this.state.choice);
  }
});

/**
 * Component for showing a therapist's information. Used by Results component.
 * @private
 */
var Therapist = React.createClass({
  "render":function(){
    var therapist = this.props.therapist;
    var containerStyle = styles.therapist;
    if (this.props.selected)
      containerStyle = _.extend({},containerStyle,styles.optionSelected);
    return <div className="therapist" style={containerStyle} onClick={this._doSelect}>
      <div style={styles.photo}><img src={therapist.photo} /></div>
      <div style={styles.name}>{therapist.name}</div>
      <div style={styles.expertise}>{therapist.expertise}</div>
      <div style={{"clear":"left"}}></div>
    </div>;
  },
  // Called when this therapist is selected.
  "_doSelect":function(e){
    // Propagate the selection up to the parent component.
    this.props.onClick(this.props.index);
  }
});

/**
 * Component for the results screen.
 * @private
 * @requires Therapist
 */
var Result = React.createClass({
  "getInitialState":function(){
    return {};
  },
  "render":function(){
    var self = this;

    // Depression Severity: 0-4 none, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe.
    var score = _.reduce(this.props.answers, function(memo, choice){
      return memo + choice;
    }, 0);

    // Figure out the label and color to use when showing the result.
    var severity = (score >= 20) ? "Severe" :
      (score >= 15) ? "Moderately Severe" :
        (score >= 10) ? "Moderate" :
          (score >= 5) ? "Mild" :
            "None";
    var color = (score >= 20) ? "severe" :
      (score >= 15) ? "moderatelySevere" :
        (score >= 10) ? "moderate" :
          (score >= 5) ? "mild" :
            "none";

    // If the therapists property is passed in, render the therapists section.
    var therapists;
    if (this.props.therapists && this.props.therapists.length)
      therapists = <div className="therapists-container" style={{"marginTop":"20px"}}>
        <p>We recommend that you contact a therapist for further diagnosis. If you would like the convenience of having one of our highly-recommended therapists contact you, please select one of them from the list below.</p>
        <div className="therapists" style={styles.therapists}>{
          _.map(this.props.therapists,function(therapist,index){
            return <Therapist index={index} therapist={therapist} selected={index==self.state.selectedIndex} onClick={self._doSelect} />;
          })
        }</div>
        <div className="error-msg" ref="errorMsg" style={styles.errorMsg}>Please choose one of the therapist before continuing.</div>
      </div>;

    return <div className="result-container">
      <p>Your Result:</p>
      <h3 style={_.extend({},styles.result,styles.condition[color])}>{severity}</h3>
      {therapists}
      <div style={styles.buttonContainer}>
        <button className="btn btn-primary" style={styles.button} onClick={this._doBack}>Back</button>
        {
          (therapists) ? <button className="btn btn-primary" style={styles.button} onClick={this._doSubmit}>Submit</button> : null
        }
      </div>
    </div>;
  },
  // Called when the user selects one of the therapists. Persist the selected index to this component's state.
  "_doSelect":function(index){
    console.log("SELECT");
    if (this.props.therapists)
      this.setState({
        "selectedIndex":index
      });
    // Hide the error message
    $(this.refs.errorMsg.getDOMNode()).hide();
  },
  // Called when the user clicks the "back" button. Trigger the "back" action.
  "_doBack":function(e){
    e.preventDefault();
    actionCreator.back();
  },
  // Called when the user clicks the "submit" button. Trigger the "selectTherapist" and pass the selected therapist.
  "_doSubmit":function(e){
    e.preventDefault();
    if (this.state.selectedIndex != null)
      actionCreator.selectTherapist(this.state.selectedIndex);
    else
      // User has not made a choice, show the error message
      $(this.refs.errorMsg.getDOMNode()).show();
  }
});

/**
 * Component for the confirmation screen.
 * @private
 */
var Confirmation = React.createClass({
  "render":function(){
    return <div className="confirmation-container">
      <p>Thank you for filling out the Quartet Health depression questionnaire. Your therapist <strong>{this.props.therapist.name}</strong> will be in touch shortly.</p>
    </div>;
  }
});

/**
 * The main questionnaire component rendered by the UI.
 * @requires Intro
 * @requires Question
 * @requires Result
 * @requires Confirmation
 */
module.exports = React.createClass({
  "getInitialState":function(){
    if (typeof this.props.actionCreator != "object")
      throw new Error("Please pass in an ActionCreator as props for this component");
    else
      actionCreator = this.props.actionCreator;
    if (typeof this.props.store != "object")
      throw new Error("Please pass in a QuestionnaireStore as props for this component");

    var store = this.props.store;
    return {
      "current":store.current,
      "answers":store.answers,
      "therapists":store.therapists||[],
      "therapist":store.therapist
    };
  },
  "componentDidMount":function(){
    var self = this;
    var store = this.props.store;
    store.on("change",function(){
      self.setState({
        "current":store.current,
        "answers":store.answers,
        "therapists":store.therapists||[],
        "therapist":store.therapist
      });
    });
  },
  "render":function(){
    var self = this;

    // For each question, display a dot to show the user's progress.
    var dots = questions.map(function(question,index){
      var style;
      if (index == self.state.current)
        style = _.extend({},styles.dot,styles.current);
      else
        style = _.extend({},styles.dot);
      return <div style={style}></div>;
    });

    // Decide the content to render based on the state of the component
    var content;
    if (this.state.therapist)
      // user has chosen a therapist.
      content = <Confirmation therapist={this.state.therapist} />;
    else {
      switch (this.state.current) {
        case -1:
          // user is on the intro screen.
          content = <Intro />;
          break;
        case 9:
          // user has finished the questionnaire, but hasn't chosen a therapist.
          content = <Result answers={this.state.answers} therapists={this.state.therapists} />;
          break;
        default:
          // user is in the middle of the questionnaire.
          content = <Question index={this.state.current} choice={this.state.answers[this.state.current]} />;
      }
    }

    return <div style={{"textAlign":"center","minWidth":"22em"}}>
      <div style={styles.dotsContainer}>
        {dots}
        <div style={{"clear":"both"}}></div>
      </div>
      <div></div>
      <div style={styles.content}>{content}</div>
    </div>;
  }
});
