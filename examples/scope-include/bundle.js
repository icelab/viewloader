(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var viewLoader = require('../../index.js');

function myPage (el, props) {
  console.log(el, props);
  // ignored
}

function myArticle (el, props) {
  console.log(el, props);
  // div ""Scope to this article and include me""
}

function myArticleStatsChart (el, props) {
  console.log(el, props);
  //=> div "Some amazing JSON stats"
}

var views = {};

views.page = function (el, props) {
  myPage(el, props);
};

views.article = function (el, props) {
  myArticle(el, props);
};

views.articleStats = function (el, props) {
  myArticleStatsChart(el, props);
};

// scope to `data-view-article` and include the scoped element
var scope = document.querySelector('[data-view-article]');
viewLoader.execute(views, scope, true);

},{"../../index.js":2}],2:[function(require,module,exports){
/**
 * getElements
 * Return an array of elements, or an empty array;
 * @param  {Element} node - an element to scope the query to
 * @param  {String} selector
 * @return {Array}
 */

function getElements (node, selector) {
  return Array.prototype.slice.call(node.querySelectorAll(selector))
}

/**
 * matches
 * Return a boolean if DOM element matches a given selector.
 * @param  {Element el
 * @param  {String} selector
 * @return {Boolean}
 */

function matches (el, selector) {
  var matches = el.matches || el.msmatches;
  return matches.call(el, selector);
}

/**
 * dasherize
 * Replace a camelCased string to dashed-case
 * @param  {String} str
 * @return {String} str
 */

function dasherize (str) {
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

function parseProps (value) {
  var pattern = /^{/;

  if (pattern.test(value)) {
    var fragment = document.createElement("div");
    fragment.innerHTML = value;
    value = JSON.parse(fragment.innerHTML);
  }

  return value;
}

/**
 * checkElement
 * Get an array of elements for a node.
 * return elements
 * @param  {Element} node
 * @param  {String} selector
 * @param  {Boolean} includeScope
 * @return {Array}
 */

function checkElement(node, selector, includeScope) {
  var elements = getElements(node, selector);

  if (includeScope && matches(node, selector)) {
    elements.push(node);
  }

  return elements;
}

/**
 * callViewFunction
 * Call the associated function for this specific view
 * Passing in the element and the value of the data attribute
 * @param  {Function} viewFunction
 * @param  {dashView} dashView - dasherized view name: my-bar-chart
 * @param  {Element} el
 */

function callViewFunction(viewFunction, dashView, el) {
  viewFunction.call(this, el, parseProps(el.getAttribute("data-view-" + dashView)));
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

  for(var view in views) {
    var dashView = dasherize(view);
    var selector = "[data-view-" + dashView + "]";
    var elements = [];

    if (scope) {
      if (scope.length) {
        Array.prototype.forEach.call(scope, function (node) {
          var nodes = checkElement(node, selector, includeScope);
          elements = elements.concat(nodes);
        });
      } else {
        var nodes = checkElement(scope, selector, includeScope);
        elements = elements.concat(nodes);
      }
    } else {
      elements = getElements(document, selector);
    }

    // for each value in `elements`, call `callViewFunction`
    Array.prototype.forEach.call(elements, function (element) {
      callViewFunction(views[view], dashView, element);
    });
  }
}

module.exports = {
  execute: execute
}

},{}]},{},[1]);
