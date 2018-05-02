var viewLoader = require('../../index.js');
var embedMap = require('./embed-map');

var views = {}
views.embedMap = function(el, props) {
  embedMap(el, props);
};

viewLoader.execute(views);
