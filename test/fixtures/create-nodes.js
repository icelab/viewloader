/**
 * createNodes
 * Create a <div> and populate that with child elements
 * @param  {String} attr  data-view-something
 * @param  {String} value "foo"
 * @param  {Number} length
 * @return {Element}
 */

var createElement = require("./create-element");

function createNodes (attr, value, length) {
  var parent = document.createElement("div");

  for (var i = 0; i < length; i++) {
    var el = createElement(attr, value, true);
    parent.appendChild(el);
  }

  return parent;
}

module.exports = createNodes;
