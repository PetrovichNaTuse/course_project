const countBasket = document.querySelector('.shopping-cart__count-tovar');
const countBasketTovar = Object.keys(JSON.parse(window.localStorage.getItem('userBasket')) || {});
countBasket.innerText = countBasketTovar.length;
