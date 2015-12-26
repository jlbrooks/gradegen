var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var marked = require('marked');

function generateMarkdown(sections) {
  var complete = "Title\n=======\n\n";
  sections.forEach(function(section) {
    complete += "#### " + section.name + " (" + section.total + "/" + section.possible + ")\n\n";

    section.deductions.forEach(function(deduction) {
      complete += "* " + String(deduction.amount) + ", " + deduction.text + "\n\n";
    });
  });

  return complete;
}

var testingDeductions = [
  {id: 1, amount:-10, text: "Did not write tests"},
  {id: 2, amount: -2, text: "Did not use mocks"}
];
var correctnessDeductions = [
  {id: 1, amount:-10, text: "No correct outputs"},
  {id: 2, amount: -4, text: "Partially incorrect outputs"}
];

var testData = [
  {id: 1, possible: 10, total: 6, name:"Testing", deductions:testingDeductions},
  {id: 2, possible: 20, total: 15, name:"Correctness", deductions:correctnessDeductions}
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
  getInitialState: function() {
    return {newAmount: '', newText: ''};
  },
  handleAmountChange: function(e) {
    this.setState({newAmount: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({newText: e.target.value});
  },
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
        <form>
          <input
            type="number"
            placeholder="Amount"
            value={this.state.newAmount}
            onChange={this.handleAmountChange}/>
          <input
            type="text"
            placeholder="New deduction..."
            value={this.state.newText}
            onChange={this.handleTextChange}/>
        </form>
      </div>
    );
  }
});

var SectionList = React.createClass({
  render: function() {
    var sectionNodes = this.props.data.map(function(section) {
      return (
        <Section possible={section.possible} 
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
    return {total: '', name: ''};
  },
  handleAmountChange: function(e) {
    this.setState({total: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var total = this.state.total.trim();
    var name = this.state.name.trim();
    // Must be filled out
    if (!name || !total) {
      return;
    }
    // Callback in the parent
    this.props.onNewSection({total: total, possible: total, name: name, deductions:[]});
    // Reset the state
    this.setState({total: '', name: ''});
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h4>New Section</h4>
        <input
          type="number"
          placeholder="Point value"
          value={this.state.total} 
          onChange={this.handleAmountChange}/>
        <input
          type="name"
          placeholder="Explanation"
          value={this.state.name}
          onChange={this.handleTextChange}/>
        <input type="submit" value="Add Section" />
      </form>
    );
  }
});

var GradeSheetOutput = React.createClass({
  rawMarkup: function() {
    var raw = marked(this.props.markdown, {sanitize: true});
    return { __html: raw };
  },

  render: function() {
    return (
      <div>
        <h1>Markdown Output:</h1>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var GradeSheet = React.createClass({
  getInitialState: function() {
    return {sections: testData};
  },
  onSectionAdded: function(section) {
    var currentSections = this.state.sections;
    currentSections.push(section);
    this.setState({sections: currentSections});
  },
  render: function() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <SectionList data={this.state.sections}/>
        <SectionForm onNewSection={this.onSectionAdded} />
        <GradeSheetOutput markdown={generateMarkdown(this.state.sections)} />
      </div>
    );
  }
});

ReactDOM.render(
  <GradeSheet title="HW2"/>,
  document.getElementById('content')
);