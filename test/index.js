"use strict";

var test = require("tape");
var viewLoader = require("../");
var createEl = require("./fixtures/create-element.js");
var createNodes = require("./fixtures/create-nodes.js");
var createDOM = require("./fixtures/create-dom.js");

test("should call function when data-attribute is found and ...", function (nest) {
  nest.test("... parse JSON", function (assert) {
    createDOM();
    var el = createEl("data-view-basic", '{"data":[1,2,3]}', false);
    document.appendChild(el);

    function myModuleFunction (el, props) {
      var expected = {data: [1,2,3]};
      assert.deepEqual(props, expected);
      assert.ok(el.textContent = expected);
      assert.end();
    }

    var views = {};
    views.basic = function(el, props) {
      myModuleFunction(el, props);
    };

    viewLoader.execute(views);
  });

  nest.test("... return String", function (assert) {
    createDOM();
    var el = createEl("data-view-basic", "basic example", false);
    document.appendChild(el);

    function myModuleFunction (el, props) {
      var expected = "basic example";
      assert.equal(props, expected);
      assert.ok(el.textContent = expected);
      assert.end();
    }

    var views = {};
    views.basic = function(el, props) {
      myModuleFunction(el, props);
    };

    viewLoader.execute(views);
  });
});


test('should target data-attributes with scope and ...', function (nest) {
  nest.test("... exclude scope element", function (assert) {
    createDOM();
    var el = createEl("data-view-scoped-exclude", "scoped-exclude", true);
    document.appendChild(el);

    function myParentFunction () {
      assert.ok(false);
    }

    function myChildFunction (el, props) {
      var expected = "child";
      assert.equal(props, expected);
      assert.ok(el.textContent = expected);
      assert.end();
    }

    var views = {};
    views.scopedExclude = function (el, props) {
      myParentFunction(el, props);
    };

    views.child = function (el, props) {
      myChildFunction(el, props);
    };

    var scopedElement = document.querySelector('[data-view-scoped-exclude]');
    viewLoader.execute(views, scopedElement, false);
  });

  nest.test("... include scope element", function (assert) {
    createDOM();
    var el = createEl("data-view-scoped-include", "scoped-include", true);
    document.appendChild(el);

    function myParentFunction (el, props) {
      var expected = "scoped-include";
      assert.equal(props, expected);
      assert.ok(el.textContent = expected);
    }

    function myChildFunction (el, props) {
      var expected = "child";
      assert.equal(props, expected);
      assert.ok(el.textContent = expected);
      assert.end();
    }

    var views = {};
    views.scopedExclude = function (el, props) {
      myParentFunction(el, props);
    };

    views.child = function (el, props) {
      myChildFunction(el, props);
    };

    var scopedElement = document.querySelector('[data-view-scoped-exclude]');
    viewLoader.execute(views, scopedElement, true);
  });
});

test("should call function for each data-attribute in nodelist", function (assert) {
  createDOM();
  var nodes = createNodes("data-view-scope-nodelist", "scope-nodelist", 3);
  document.appendChild(nodes);

  var count = 0;

  function myChildFunction () {
    count++;
  }

  var views = {};
  views.child = function(el, props) {
    myChildFunction(el, props);
  };

  var nodelist = document.querySelectorAll('[data-view-scope-nodelist]');
  viewLoader.execute(views, nodelist, false);

  assert.equal(count, 3);
  assert.end();
});
