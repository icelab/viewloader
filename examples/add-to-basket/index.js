const basketItemViews = {
  remove: function remove(el) {
    el.addEventListener("click", function() {
      el.parentNode.remove();
    });
  },

  addToBasket: function addToBasket(el, props) {
    el.addEventListener("click", function() {
      fetch(props.file)
        .then(res => res.text())
        .then(data => {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = data;
          const container = document.querySelector(`.${props.target}`);
          container.appendChild(wrapper);

          viewloader.execute(views, wrapper, true);
        })
        .catch(err => console.log(err));
    });
  }
};

viewloader.execute(basketItemViews);
