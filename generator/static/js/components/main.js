var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');

var testingDeductions = [
  {id: 1, amount:-10, text: "Did not write tests"},
  {id: 2, amount: -2, text: "Did not use mocks"}
];
var correctnessDeductions = [
  {id: 1, amount:-10, text: "No correct outputs"},
  {id: 2, amount: -4, text: "Partially incorrect outputs"}
];

var testData = [
  {id: 1, total: 10, name:"Testing", deductions:testingDeductions},
  {id: 2, total: 20, name:"Correctness", deductions:correctnessDeductions}
];

var Deduction = React.createClass({
  render: function() {
    var text = this.props.amount + ", " + this.props.text;
    return (
      <label>
        <input type="checkbox" value={this.props.key} />
        {text}
      </label>
    );
  }
});

var Section = React.createClass({
  render: function() {
    var deductionNodes = this.props.deductions.map(function(deduction) {
      return (
        <Deduction amount={deduction.amount} text={deduction.text} key={deduction.id}>
        </Deduction>
      );
    });
    return (
      <div>
        <h3>{this.props.name}</h3>
        <div>
          {deductionNodes}
        </div>
      </div>
    );
  }
});

var SectionList = React.createClass({
  render: function() {
    var sectionNodes = this.props.data.map(function(section) {
      return (
        <Section total={section.total} 
                 deductions={section.deductions}
                 name={section.name}
                 key={section.id}>
        </Section>
      );
    });
    return (
      <div>
        {sectionNodes}
      </div>
    );
  }
});

var SectionForm = React.createClass({
  getInitialState: function() {
    return {amount: '', text: ''};
  },
  handleAmountChange: function(e) {
    this.setState({amount: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  render: function() {
    return (
      <form>
        <input
          type="number"
          placeholder="Point value"
          value={this.state.amount} 
          onChange={this.handleAmountChange}/>
        <input
          type="text"
          placeholder="Explanation"
          value={this.state.text}
          onChange={this.handleTextChange}/>
      </form>
    );
  }
});

var GradeSheet = React.createClass({
  render: function() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <SectionList data={testData}/>
        <SectionForm />
      </div>
    );
  }
});

ReactDOM.render(
  <GradeSheet title="HW2"/>,
  document.getElementById('content')
);