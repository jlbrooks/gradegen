var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var marked = require('marked');
var _ = require('underscore');

function generateMarkdown(sections) {
  var complete = "Title\n=======\n\n";
  sections.forEach(function(section) {
    complete += "#### " + section.name + " (" + section.total + "/" + section.possible + ")\n\n";

    section.deductions.forEach(function(deduction) {
      if (deduction.checked) {
        complete += "* " + String(deduction.amount) + ", " + deduction.text + "\n\n";
      }
    });
  });

  return complete;
}

var testingDeductions = [
  {id: 1, amount:-10, text: "Did not write tests", checked: false},
  {id: 2, amount: -2, text: "Did not use mocks", checked: true}
];
var correctnessDeductions = [
  {id: 1, amount:-10, text: "No correct outputs", checked: false},
  {id: 2, amount: -4, text: "Partially incorrect outputs", checked: false}
];

var testData = [
  {id: 1, possible: 10, total: 6, name:"Testing", deductions:testingDeductions},
  {id: 2, possible: 20, total: 15, name:"Correctness", deductions:correctnessDeductions}
];

var Deduction = React.createClass({
  getInitialState: function(e) {
    return {
      amount: this.props.amount,
      text: this.props.text,
      checked: this.props.checked,
      id: this.props.id
    };
  },
  handleCheckChange: function(e) {
    var checked = e.target.checked;
    this.setState({checked: e.target.checked});
    this.props.onCheckChange(this.state.id, checked);
  },
  render: function() {
    var text = this.state.amount + ", " + this.state.text;
    return (
      <label>
        <input type="checkbox" onChange={this.handleCheckChange} checked={this.state.checked}/>
        {text}
      </label>
    );
  }
});

var DeductionForm = React.createClass({
  getInitialState: function() {
    return {amount: '', text: ''};
  },
  handleAmountChange: function(e) {
    this.setState({amount: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var amount = this.state.amount.trim();
    var text = this.state.text.trim();
    // Must be filled out
    if (!text || !amount) {
      return;
    }
    // Callback in the parent
    this.props.onNewDeduction({amount: amount, text: text});
    // Reset the state
    this.setState({amount: '', text: ''});
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={this.state.amount}
          onChange={this.handleAmountChange}/>
        <input
          type="text"
          placeholder="New deduction..."
          value={this.state.text}
          onChange={this.handleTextChange}/>
        <input type="submit" value="Add" />
      </form>
    );
  }
});

var Section = React.createClass({
  getInitialState: function() {
    return {
      possible: this.props.possible,
      name: this.props.name,
      total: this.props.total,
      deductions: this.props.deductions
    }
  },
  onNewDeduction: function(deduction) {
    var deductions = this.state.deductions;
    deductions.push(deduction);
    this.setState({deductions: deductions});
  },
  onCheckChange: function(dedId, checked) {
    this.props.onCheckChange(this.props.id, dedId, checked)
  },
  render: function() {
    var deductionNodes = this.state.deductions.map(function(deduction) {
      return (
        <Deduction 
          amount={deduction.amount}
          text={deduction.text}
          checked={deduction.checked}
          id={deduction.id}
          key={deduction.id}
          onCheckChange={this.onCheckChange}>
        </Deduction>
      );
    }.bind(this));
    return (
      <div>
        <h3>{this.state.name} ({this.state.total}/{this.state.possible})</h3>
        <div>
          {deductionNodes}
        </div>
        <DeductionForm onNewDeduction={this.onNewDeduction} />
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
                 total={section.total}
                 name={section.name}
                 id={section.id}
                 key={section.id}
                 onCheckChange={this.props.onCheckChange}>
        </Section>
      );
    }.bind(this))
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
  onCheckChange: function(secId, dedId, checked) {
    var sections = this.state.sections;
    // Find the correct section
    var section = _.find(sections, function(sec) {return (sec.id == secId)});
    // Find the section array index
    var secIndex = _.indexOf(sections, section);
    if (secIndex < 0) return; // Should never happen

    // Find the deduction with the current key
    var ded = _.find(section.deductions, function(ded) {return (ded.id == dedId)});
    var dedIndex = _.indexOf(section.deductions, ded);
    if (dedIndex < 0) return; // Should never happen
    // Set the checked value for the deduction
    section.deductions[dedIndex].checked = checked
    // Set the state with the new section
    sections[secIndex] = section;
    this.setState({sections: sections});
  },
  render: function() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <SectionList 
          data={this.state.sections}
          onCheckChange={this.onCheckChange} />
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