$ = jQuery = require('jquery');
var React = require('react');
var ExampleComponent = require('./components/ExampleComponent.js');

(function() {
  "use strict";

  var App = React.createClass({

    render: function() {
      return (
        <ExampleComponent />
      );
    }
  });

React.render(<App />, document.getElementById('app'));
})();
