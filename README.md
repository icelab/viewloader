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

export default function myBarChart (el, props) {
  console.log(el, props); //=> div {data: [1,2,3]}
  return {
    reset: () => { ... },
    destroy: () => { ... }
  }
};
```

```js
// index.js

import viewloader from "viewloader";
import myBarChart from "./bar-chart";
import myLineChart from "./line-chart";

const views = {
  myBarChart,
  myLineChart
};

// Create the instance
const manager = viewloader(views);
// Call the view functions
manager.callViews();
// Call the `reset` methods of each view function
manager.resetViews();
// Call the `destroy` methods of each view function
manager.resetViews();
```

[More examples here](examples).

## API

```
viewloader(views, scope, includeScope);
```

  * **views** — An `object` of view functions mapped to `data-view-[name]` attributes. (Required)
  * **scope** — An `element` or `nodelist` to scope the view loader to. (Optional. Defaults to `document`)
  * **includeScope** — A `boolean` to indicate if the scoped element should be included in the scoped views. (Optional: Defaults to `false`)

## Promises

Viewloader supports view functions that return a `Promise`, automatically setting the resolved return value from any promises once that value is resolved. This means you can call viewloader synchronously with underlying code in your views that is asynchronous:

```js
import viewloader from "viewloader";

const views = {
  asyncView: (el, props) => {
    return import("./async-import")
      .then((asyncImport) => {
        return asyncImport(el, props);
      });
  }
}