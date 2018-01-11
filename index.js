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
  return viewFunction.call(this, el, parseProps(el.getAttribute(viewAttr)));
}

/**
 * Viewloader
 *
 * @param {Object} views Named key pairs for each view function
 * @param {Node/NodeList} scopeElements Element/list of elements to scope
 * selection to.
 * @param {Boolean} includeScopeElements Include any scopeElements in the set of
 * possible matching nodes.
 */
function Viewloader(views, scopeElements, includeScopeElements) {
  this.initializedViews = [];
  this.setViews(views, scopeElements, includeScopeElements);
}

/**
 * Set views
 *
 * @param {Object} views Named key pairs for each view function
 * @param {Node/NodeList} scopeElements Element/list of elements to scope
 * selection to.
 * @param {Boolean} includeScopeElements Include any scopeElements in the set of
 * possible matching nodes.
 */
Viewloader.prototype.setViews = function(
  views,
  scopeElements,
  includeScopeElements
) {
  this.views = views;
  this.scopeElements = scopeElements;
  this.includeScopeElements = includeScopeElements || false;
};

/**
 * Call view functions based on the current instance values
 *
 * Find data-attributes in the DOM matching the dasherized function name of
 * views. If found, call the associated function, passing it the matching
 * element and any props derived from its attribute value.
 */
Viewloader.prototype.callViews = function() {
  var _this = this;
  for (var view in this.views) {
    var dashView = dasherize(view);
    var viewAttr = "data-view-" + dashView;
    var elements = [];

    if (this.scopeElements) {
      if (this.scopeElements.length) {
        Array.prototype.forEach.call(this.scopeElements, function(node) {
          var nodes = checkElement(node, viewAttr, this.includeScopeElements);
          elements = elements.concat(nodes);
        });
      } else {
        var nodes = checkElement(
          this.scopeElements,
          viewAttr,
          this.includeScopeElements
        );
        elements = elements.concat(nodes);
      }
    } else {
      elements = getElements(document, viewAttr);
    }

    // for each value in `elements`, call `callViewFunction`
    this.initializedViews = this.initializedViews.concat(
      Array.prototype.map.call(elements, function(element) {
        return callViewFunction(_this.views[view], viewAttr, element);
      })
    );
  }
  // Resolve any Promises returned from views
  this.initializedViews.forEach(function(returnValue, i) {
    if (returnValue && returnValue.then) {
      returnValue.then(function(r) {
        _this.initializedViews[i] = r;
      });
    }
  });
};

/**
 * Reset views
 *
 * Call `.reset` method for any initialised views
 */
Viewloader.prototype.resetViews = function() {
  this.initializedViews.forEach(function(view) {
    if (view != null && view.reset) {
      view.reset();
    }
  });
};

/**
 * Destroy views
 *
 * Call `.destroy` method for any initialised views
 */
Viewloader.prototype.destroyViews = function() {
  this.initializedViews.forEach(function(view) {
    if (view != null && view.destroy) {
      view.destroy();
    }
  });
  this.initializedViews = [];
};

/**
 * Return new viewloader instance
 *
 * @param {Object} views Named key pairs for each view function
 * @param {Node/NodeList} scopeElements Element/list of elements to scope
 * selection to.
 * @param {Boolean} includeScopeElements Include any scopeElements in the set of
 * possible matching nodes.
 */
module.exports = function(views, scopeElements, includeScopeElements) {
  return new Viewloader(views, scopeElements, includeScopeElements);
};
