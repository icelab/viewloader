var viewLoader = require('../../index.js');
var embedMap = require('./embed-map');

var views = {}
views.embdMap = function(el, props) {
  embedMap(el, props);
};

viewLoader.execute(views);
