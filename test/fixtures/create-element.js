/**
 * createElement
 * Create a <div> and apply a data-attribute and value
 * @param  {String} attr  data-view-something
 * @param  {String} value "foo"
 * @return {Element}
 */

function createElement (attr, value, hasChild) {
  var el = document.createElement("div");
  el.setAttribute(attr, value);
  el.textContent = value;

  if (hasChild) {
    var child = createElement("data-view-child", "child", false);
    el.appendChild(child);
  }

  return el;
}

module.exports = createElement;
