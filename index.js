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
    value = JSON.parse(value);
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
