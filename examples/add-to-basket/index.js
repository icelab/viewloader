const basketItemViews = {
  remove: function remove(el) {
    el.addEventListener("click", function() {
      el.parentNode.remove();
    });
  },

  addToBasket: function addToBasket(el, props) {
    const container = document.querySelector(`.${props.target}`);

    el.addEventListener("click", function() {
      fetch(props.file)
        .then(res => res.text())
        .then(data => {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = data;
          container.appendChild(wrapper);
          viewloader.execute(basketItemViews, wrapper, true);
        })
        .catch(err => console.log(err));
    });
  }
};

viewloader.execute(basketItemViews);
