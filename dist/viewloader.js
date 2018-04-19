(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * getElements
 * Return an array of elements, or an empty array;
 * @param  {Element} node - an element to scope the query to
 * @param  {String} attr
 * @return {Array}
 */

function getElements(node, attr) {
  return Array.prototype.slice.call(node.querySelectorAll("[" + attr + "]"));
}

/**
 * dasherize
 * Replace a camelCased string to dashed-case
 * @param  {String} str
 * @return {String} str
 */

function dasherize(str) {
  var pattern = /([a-z0-9])([A-Z])/g;
  return str.replace(pattern, "$1-$2").toLowerCase();
}

/**
 * parseProps
 * Return the value of the data-attribute
 * Parse the value if it looks like an object
 * @param  {String} value
 * @return {String} value
 */

function parseProps(value) {
  var pattern = /^{/;
  if (pattern.test(value)) {
    value = JSON.parse(value);
  }
  return value;
}

/**
 * checkElement
 * Get an array of elements for a node.
 * return elements
 * @param  {Element} node
 * @param  {String} attr
 * @param  {Boolean} includeScope
 * @return {Array}
 */

function checkElement(node, attr, includeScope) {
  var elements = getElements(node, attr);

  if (includeScope && node.hasAttribute(attr)) {
    elements.push(node);
  }

  return elements;
}

/**
 * callViewFunction
 * Call the associated function for this specific view
 * Passing in the element and the value of the data attribute
 * @param  {Function} viewFunction
 * @param  {String} viewAttr - data view attribute name: data-view-my-bar-chart
 * @param  {Element} el
 */

function callViewFunction(viewFunction, viewAttr, el) {
  viewFunction.call(this, el, parseProps(el.getAttribute(viewAttr)));
}

/**
 * execute
 * Take an object of view functions.
 * Find data-attributes in the DOM matching the dasherized function name.
 * If found, call the associated function, passing it the matching element & it's
 * data-attribute value.
 * @param  {Object} views
 * @param  {Element/Nodelist} scope
 * @param  {Boolean} includeScope
 */

function execute(views, scope, includeScope) {

  for (var view in views) {
    var dashView = dasherize(view);
    var viewAttr = "data-view-" + dashView;
    var elements = [];

    if (scope) {
      if (scope.length) {
        Array.prototype.forEach.call(scope, function (node) {
          var nodes = checkElement(node, viewAttr, includeScope);
          elements = elements.concat(nodes);
        });
      } else {
        var nodes = checkElement(scope, viewAttr, includeScope);
        elements = elements.concat(nodes);
      }
    } else {
      elements = getElements(document, viewAttr);
    }

    // for each value in `elements`, call `callViewFunction`
    Array.prototype.forEach.call(elements, function (element) {
      callViewFunction(views[view], viewAttr, element);
    });
  }
}

module.exports = {
  execute: execute
};

},{}]},{},[1]);
