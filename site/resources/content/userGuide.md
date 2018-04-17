# Viewloader

Viewloader is teensy package that simplifies the process of binding DOM nodes to JavaScript functions. It does this by creating a convention for mapping between the DOM and your JS and ensures that _only_ the functions for the components in the DOM are executed.

Let’s create a "Hello, World!" component:

```HTML
// Add a `data-view-*` attribute
<input data-view-hello-world>

<script>
  import viewloader from "viewloader";
  // Create an object to hold our views
  const views = {
    // Create a camelCased key matching the dasherized data-view-hello-world
    // from our HTML: data-view-hello-world -> helloWorld
    helloWorld: (el, props) => {
      // The DOM node is passed here as `el` so we can do stuff!
      el.value = "Hello, World!";
    }
  }
  // Call viewloader with our "views" object whenever the DOM is ready
  viewloader.execute(views);

</script>
```

This simple approach:

* Lets you stop worrying about if your JS is going to be called — if there’s a `data-view-*` in the DOM it will be.
* Establishes a clear convention for binding JS to the DOM — makes it easy to find where in your codebase behaviour is originating from.
* Encourages (though doesn’t force) you to encapsulate behaviour within the context of a component’s DOM node.

💅🏽 Viewloader has one extra trick up its sleeve that makes it an incredibly powerful pattern: the value of the `data-view-*` attribute will be passed to your matching JS function as a second argument.

``` HTML
<input data-view-hello-world="Angela Merkel">

<script>
  import viewloader from "viewloader";

  const views = {
    helloWorld: (el, name) => {
      // Our attribute is available here!
      el.value = `Hello, ${name}!`;
    }
  }

  viewloader.execute(views);

</script>
```

And for additional ✨ it’ll parse JSON-encoded values from that attribute into a proper object for you:

```HTML
<input
    data-view-hello-world='{"greeting":\"Guten tag",\"name\":\"Angela Merkel\"}'>

<script>
  import viewloader from "viewloader";

  const views = {
    helloWorld: (el, props) => {
      // Our attribute is available here!
      el.value = `${props.greeting}, ${props.name}!`;
    }
  }

  viewloader.execute(views);

</script>
```

This gives you the power to create reusable components that can be "called" from your HTML with their own properties.

At the end of the day Viewloader it's just Javascript, don't be afraid of it.
No restrictions on what you can do, but no checks on what you do (so be careful!).


### Installation

* Using npm
* Using yarn
* Using unpkgd (we’ll need to add a built file for this)

### API
#### viewloader.execute(views, scope, includeScope)

- views: An object of view functions mapped to data-view-[name] attributes. (Required)

- scope: An element or nodelist to scope the view loader to. (Optional. Defaults to document)

- includeScope: A boolean to indicate if the scoped element should be included in the scoped views. (Optional: Defaults to false)


### Detailed examples

#### Customization with per-instance props

You can customize and reuse Viewloader components by providing different properties to each instance, through the data-view attribute.

On this example we have components that change the background color of another element. Since color is the only thing that changes, we can send the color in as a parameter and use the same component multiple times.

* Let's create the color changer Viewloader component.


```JavaScript
// change-color.js
module.exports = function changeColor(el, color) {
  el.style.backgroundColor = color

  const container = document.querySelector('.color-box')

  el.addEventListener('mouseover', function (e) {
    container.style.backgroundColor = color
  })

  el.addEventListener('mouseout', function (e) {
    container.style.backgroundColor = '#fff'
  })
}
```

* Now we need to setup the component. We are using the domready library to guarantee everything will be in place.

```JavaScript
// index.js
import domready from 'domready';
import viewloader from 'viewloader';
import changeColor from './components/change-color';

var views = {
  changeColor
}

domready(() => viewloader.execute(views))

```

* Finally we bind the component to the DOM nodes, by adding the data-view attributes with the various colors.

```HTML
<!-- index.html -->
<div class="color-box">
  <div class="box box1" data-view-change-color='#5C526F'>1</div>
  <div class="box box2" data-view-change-color='#7CBB97'>2</div>
  <div class="box box3" data-view-change-color='#E78A37'>3</div>
  <div class="box box4" data-view-change-color='#F05051'>4</div>
  <div class="box box5" data-view-change-color='#5C526F'>5</div>
  <div class="box box6" data-view-change-color='#E4E0C7'>6</div>
  <div class="box box7" data-view-change-color='#D4AE89'>7</div>
  <div class="box box8" data-view-change-color='#CD6C40'>8</div>
  <div class="box box9" data-view-change-color='#414547'>9</div>
  <div class="box box10" data-view-change-color='#10BFAB'>10</div>
</div>
```
That's it! You can see a live version of this example [ here ].

#### Show me the scope

Viewloader execution can be scoped to specific elements, allowing it to be used
only in specific parts of the template or to be applied only to new DOM elements.

You can pass in a  `boolean` flag as the third parameter to indicate
if the scope gets included or not in the Viewloader execution.

`viewloader.execute(views, scope, boolean)`


Let's create an example showing how to scope things with Viewloader, it's very simple :)

We gonna have two boxes, a "main" box and an inner box. The inner box represents the "target" element.

Let's create a simple Viewloader component that is going to change the border color of our boxes.

``` JavaScript
// change-border.js
module.exports = function changeBorder(el, borderColor) {
  el.addEventListener('mouseover', function (e) {
    el.style.border = `10px solid ${borderColor}`
  })

  el.addEventListener('mouseout', function (e) {
    el.style.border = '5px solid black'
  })
}
```

Now we need to setup the component and execute it, passing the scope. First we select the element to be the starting point of our scope (in that case our main box) and pass it as the second argument to the Viewloader execute function. The third argument is a boolean indicating if the element is included in the scope or not.


It is worth remembering that the false scope is the default Viewloader behavior.

```JavaScript
// index.js
import domready from 'domready';
import viewloader from 'viewloader';
import changeBorder from './components/change-border';

var views = {
  changeBorder
}

var scope_true = document.querySelector('.scope-true')
var scope_false = document.querSelector('.scope-false')


// include the scoped element
domready(() => viewloader.execute(views, scope_true, true))

//exclude the scoped element
domready(() => viewloader.execute(views, scope_false, false))

// default false
domready(() => viewloader.execute(views, scope_false))

```

Last but not least, let's add the data-view attributes passing the border color. If it's gonna change or not depend on the scope you pass! Scopes are very handy and you can easily apply it, it's up to you now.

``` HTML
<!-- index.html -->

<!-- First set of boxes -->
<div data-view-change-border=''>Not affected by Viewloader</div>

<div class="scope-main-box scope-true" data-view-change-border='#10BFAB'>
  initialized by Viewloader

  <div class="scope-inner-box" data-view-change-border='#F05051'>
    initialized by Viewloader
  </div>
</div>

<!-- Second set of Boxes -->
<div data-view-change-border=''>Not affected by Viewloader</div>

<div class="scope-main-box scope-false" data-view-change-border='#10BFAB'>
  not affected by Viewloader

  <div class="scope-inner-box" data-view-change-border='#F05051'>
    initialized by Viewloader
  </div>
</div>
```
