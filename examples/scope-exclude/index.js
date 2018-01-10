var viewLoader = require('../../index.js');

function myPage (el, props) {
  console.log(el, props);
  // ignored
}

function myArticle (el, props) {
  console.log(el, props);
  // ignored
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

// scope to `data-view-article`, but exclude the scoped element
var scope = document.querySelector('[data-view-article]');
var manager = viewLoader(views, scope, false);
manager.callViews();
