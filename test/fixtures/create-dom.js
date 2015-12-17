var jsdom = require("jsdom");

/**
 * createDocument
 * Return a fake DOM in an iFrame to test with
 */

function createDocument () {
  var html = "<!doctype html><html><body></body></html>";
  var doc = jsdom.jsdom(html);
  var iframe = doc.createElement("iframe");

  var document = global.document = iframe.contentDocument;
  global.window = iframe.contentWindow;
  doc.body.appendChild(iframe);

  return document;
}

module.exports = createDocument;
