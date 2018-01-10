# viewloader

A tiny DOM bootstrapper.

## Installation
```
% npm install --save viewloader
```

## Development
To build a standalone version:
```
% npm run build
```

## Example

```html
<div data-view-my-bar-chart='{"data":[1,2,3]}'></div>
```

```js
// bar-chart.js

module.exports = function myBarChart (el, props) {
  console.log(el, props); //=> div {data: [1,2,3]}
  return {
    reset: function() { ... },
    destroy: function() { ... }
  }
};
```

```js
// index.js

var viewloader = require('viewloader');
var myBarChart = require('./bar-chart');
var myLineChart = require('./line-chart');

var views = {};

views.myBarChart = function(el, props) {
  return myBarChart(el, props);
};

views.myLineChart = function(el, props) {
  return myLineChart(el, props);
};

// Create the instance
var manager = viewloader(views);
// Call the view functions
manager.callViews();
// Call the `reset` methods of each view function
manager.resetViews();
// Call the `destroy` methods of each view function
manager.resetViews();
```

[More examples here](examples).

## API

### viewloader(views, scope, includeScope);

  * **views**: An `object` of view functions mapped to `data-view-[name]` attributes. (Required)
  * **scope**: An `element` or `nodelist` to scope the view loader to. (Optional. Defaults to `document`)
  * **includeScope**: A `boolean` to indicate if the scoped element should be included in the scoped views. (Optional: Defaults to `false`)
