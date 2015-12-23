var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');

var GradeSheet = React.createClass({
  render: function() {
    return (
      <div>
        <h1>{this.props.title}</h1>
      </div>
    );
  }
});

ReactDOM.render(
  <GradeSheet title="HW2"/>,
  document.getElementById('content')
);