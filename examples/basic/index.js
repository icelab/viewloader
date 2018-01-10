var viewLoader = require('../../index.js');
var myBarChart = require('./bar-chart');

var views = {};
views.myBarChart = function(el, props) {
  myBarChart(el, props);
};

viewLoader(views).callViews();
