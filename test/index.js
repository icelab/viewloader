"use strict";

var test = require("tape");
var viewloader = require("../");
var createEl = require("./fixtures/create-element.js");
var createNodes = require("./fixtures/create-nodes.js");
var createDOM = require("./fixtures/create-dom.js");

test("should call function when data-attribute is found and ...", function(nest) {
  nest.test("... parse JSON", function(assert) {
    createDOM();
    var el = createEl("data-view-basic", '{"data":[1,2,3]}', false);
    document.appendChild(el);

    function myModuleFunction(el, props) {
      var expected = { data: [1, 2, 3] };
      assert.deepEqual(props, expected);
      assert.ok((el.textContent = expected));
      assert.end();
    }

    var views = {};
    views.basic = function(el, props) {
      myModuleFunction(el, props);
    };

    var manager = viewloader(views);
    manager.callViews();
  });

  nest.test("... return String", function(assert) {
    createDOM();
    var el = createEl("data-view-basic", "basic example", false);
    document.appendChild(el);

    function myModuleFunction(el, props) {
      var expected = "basic example";
      assert.equal(props, expected);
      assert.ok((el.textContent = expected));
      assert.end();
    }

    var views = {};
    views.basic = function(el, props) {
      myModuleFunction(el, props);
    };

    var manager = viewloader(views);
    manager.callViews();
  });
});

test("should target data-attributes with scope and ...", function(nest) {
  nest.test("... exclude scope element", function(assert) {
    createDOM();
    var el = createEl("data-view-scoped-exclude", "scoped-exclude", true);
    document.appendChild(el);

    function myParentFunction() {
      assert.ok(false);
    }

    function myChildFunction(el, props) {
      var expected = "child";
      assert.equal(props, expected);
      assert.ok((el.textContent = expected));
      assert.end();
    }

    var views = {};
    views.scopedExclude = function(el, props) {
      myParentFunction(el, props);
    };

    views.child = function(el, props) {
      myChildFunction(el, props);
    };

    var scopedElement = document.querySelector("[data-view-scoped-exclude]");
    var manager = viewloader(views, scopedElement, false);
    manager.callViews();
  });

  nest.test("... include scope element", function(assert) {
    createDOM();
    var el = createEl("data-view-scoped-include", "scoped-include", true);
    document.appendChild(el);

    function myParentFunction(el, props) {
      var expected = "scoped-include";
      assert.equal(props, expected);
      assert.ok((el.textContent = expected));
    }

    function myChildFunction(el, props) {
      var expected = "child";
      assert.equal(props, expected);
      assert.ok((el.textContent = expected));
      assert.end();
    }

    var views = {};
    views.scopedExclude = function(el, props) {
      myParentFunction(el, props);
    };

    views.child = function(el, props) {
      myChildFunction(el, props);
    };

    var scopedElement = document.querySelector("[data-view-scoped-exclude]");
    var manager = viewloader(views, scopedElement, true);
    manager.callViews();
  });
});

test("should call function for each data-attribute in nodelist", function(assert) {
  createDOM();
  var nodes = createNodes("data-view-scope-nodelist", "scope-nodelist", 3);
  document.appendChild(nodes);

  var count = 0;

  function myChildFunction() {
    count++;
  }

  var views = {};
  views.child = function(el, props) {
    myChildFunction(el, props);
  };

  var nodelist = document.querySelectorAll("[data-view-scope-nodelist]");
  var manager = viewloader(views, nodelist, false);
  manager.callViews();

  assert.equal(count, 3);
  assert.end();
});

test("should allow the views to be set ...", function(nest) {
  nest.test("... setupViews", function(assert) {
    assert.plan(2);
    createDOM();
    var basicEl = createEl("data-view-basic", "true", false);
    var notBasicEl = createEl("data-view-not-basic", "true", false);
    basicEl.appendChild(notBasicEl);
    document.appendChild(basicEl);

    var views = {};
    views.basic = function() {
      assert.ok(true);
    };

    var manager = viewloader(views);
    manager.callViews();

    views = {};
    views.notBasic = function() {
      assert.ok(true);
    };

    manager.setViews(views);
    manager.callViews();

    assert.end();
  });
});

test("should call the view instance methods ...", function(nest) {
  nest.test("... reset", function(assert) {
    createDOM();
    var el = createEl("data-view-basic", "true", false);
    document.appendChild(el);

    var views = {};
    views.basic = function() {
      return {
        reset: function() {
          assert.ok(true);
          assert.end();
        }
      };
    };

    var manager = viewloader(views);
    manager.callViews();
    manager.resetViews();
  });

  nest.test("... destroy", function(assert) {
    createDOM();
    var el = createEl("data-view-basic", "true", false);
    document.appendChild(el);

    var views = {};
    views.basic = function() {
      return {
        destroy: function() {
          assert.ok(true);
        }
      };
    };

    var manager = viewloader(views);
    manager.callViews();
    manager.destroyViews();
    assert.ok(manager.initializedViews.length === 0);
    assert.end();
  });
});
