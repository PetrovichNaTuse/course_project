const cartProduct = document.querySelector('.cart-product');
const cartProductWrapper = document.querySelector('.cart-product__wrapper');
const alertWarning = document.querySelector('.alert-warning');
const basket = window.localStorage.getItem('userBasket');
const basketNameProduct = Object.keys(JSON.parse(basket) || {});
const info = {};

cartProduct.removeChild(cartProductWrapper);

const totalPrice = (price, qty) => {
    return +price.innerText * +qty.innerText;
}
const totalProducts = () => {
    let count = 0;
    document.querySelectorAll('.cart-product__total').forEach(item => {
        count += Number(item.innerText);
    });
    return count;
}
const total = () => {
    if(+document.querySelector('.cost-product').innerText === 0) return 0;
    return +document.querySelector('.cost-product').innerText + +document.querySelector('.cost-shipping').innerText;
}

const nextStage = () => {
    if(!window.localStorage.getItem('storageKey')) return alert('Для продолжения войдите пожалуйста');
    const first = document.querySelector('.first');
    const second = document.querySelector('.second');
    const third = document.querySelector('.third');
    const four = document.querySelector('.four');
    const last = document.querySelector('.last');

    if(!third.closest('.order-step__item_complete')) {
        if(+document.querySelector('.cost').innerText === 0) return alert('Вы ничего не заказали');
        info['idUser'] = JSON.parse(window.localStorage.getItem('storageKey'))._id;
        info['products'] = JSON.parse(window.localStorage.getItem('userBasket'));
        info['countPrice'] = +document.querySelector('.cost').innerText;
        
        second.classList.add('order-step__item_complete');
        third.classList.add('order-step__item_complete');
        document.querySelector('.shopping-cart__detail').style.display = 'none';
        document.querySelector('.shopping-cart__address').style.display = 'block';
        console.log(info);
        return;
    }
    if(!four.closest('.order-step__item_complete')) {
        const address =  document.querySelector('.shopping-cart__address-input');
        if(address.value == '') return alert('Заполните поле');
        if(address.value.length < 5) return alert('Слишком короткий адрес');
        info['address'] = address.value;

        four.classList.add('order-step__item_complete');
        document.querySelector('.shopping-cart__address').style.display = '';
        document.querySelector('.shopping-cart__delivery').style.display = 'block';
        console.log(info);
        return;
    }    

}
document.querySelector('.shopping-cart__checkout').addEventListener('click', nextStage);

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
        if(xhr.status !== 200) {
            alert(xhr.statusText);
            return;
        }
        if(xhr.status === 200) {
            const basketProd = JSON.parse(xhr.responseText);
            if(basketNameProduct.length === 0) {
                alertWarning.style.display = 'block';
                document.querySelector('.shopping-cart__detail-navigate').style.display = 'none';
                return;
            }
            document.querySelector('.shopping-cart__detail').style.display = 'block';

            JSON.parse(xhr.response).forEach(item => {
                const pathImgProduct = item.fgimg.slice(item.fgimg.indexOf('/img/') + 1);
                const sale = (item.cena - (item.cena * (item.sale / 100))).toFixed(2);
                const cloneLi = cartProductWrapper.cloneNode(true);

                cloneLi.querySelector('.cart-product__photo').innerHTML = `<img src="${pathImgProduct}">`;
                cloneLi.querySelector('.cart-product__description').innerText = item.description;
                cloneLi.querySelector('.cart-product__avial');
                cloneLi.querySelector('.cart-product__price').innerText = item.cena;
                cloneLi.querySelector('.cart-product__qty').innerHTML = `
                    <b>${JSON.parse(basket)[item._id]}</b>
                    <div>
                        <button class="cart-product__qty-down"><i class="far fa-minus-square"></i></button>
                        <button class="cart-product__qty-up"><i class="far fa-plus-square"></i></button>
                    </div>
                `;

                if(item.sale) {
                    cloneLi.querySelector('.cart-product__price').innerHTML = `
                        <span class="new-price">${sale}</span><br>
                        <span class="percent-price">-${item.sale}%</span><br>
                        <span class="old-price">${item.cena}</span>
                    `;
                    //li.classList.add('shop-top__tovar-item_sale');
                }
                cloneLi.querySelector('.cart-product__total').innerText = totalPrice((item.sale) ? cloneLi.querySelector('.new-price') : cloneLi.querySelector('.cart-product__price'), cloneLi.querySelector('.cart-product__qty b'));
                cartProduct.appendChild(cloneLi);
                cloneLi.querySelector('.cart-product__qty').addEventListener('click', function(event) {
                    const targ = event.target;
                    if(targ.tagName.toLowerCase() !== 'i') return;

                    const b = this.querySelector('b');
                    const basket = JSON.parse(window.localStorage.getItem('userBasket'));

                    if(targ.closest('.cart-product__qty-up')) {
                        b.innerText = +b.innerText + 1;
                        basket[item._id] += 1;
                    }
                    if(targ.closest('.cart-product__qty-down')) {
                        if(+b.innerText === 0) return;
                        b.innerText = +b.innerText - 1;
                        basket[item._id] -= 1;
                    }

                    window.localStorage.setItem('userBasket', JSON.stringify(basket));
                    const liCart = this.parentNode;
                    cloneLi.querySelector('.cart-product__total').innerText = totalPrice(
                        (liCart.querySelector('.new-price')) ? liCart.querySelector('.new-price') : liCart.querySelector('.cart-product__price'), liCart.querySelector('.cart-product__qty b')
                    );
                    document.querySelector('.cost-product').innerText = totalProducts();
                    document.querySelector('.cost').innerText = total();
                });
                cloneLi.querySelector('.cart-product__del').addEventListener('click', function(event) {
                    const targ = event.target;
                    if(targ.tagName.toLowerCase() !== 'i') return;

                    cloneLi.parentNode.removeChild(cloneLi);
                    const liCart = this.parentNode;
                    cloneLi.querySelector('.cart-product__total').innerText = totalPrice(
                        (liCart.querySelector('.new-price')) ? liCart.querySelector('.new-price') : liCart.querySelector('.cart-product__price'), liCart.querySelector('.cart-product__qty b')
                    );
                    document.querySelector('.cost-product').innerText = totalProducts();
                    document.querySelector('.cost').innerText = total();

                    const basket = window.localStorage.getItem('userBasket');
                    const newBasket = JSON.parse(basket)
                    delete newBasket[item._id];
                    window.localStorage.setItem('userBasket', JSON.stringify(newBasket));
                })

            });
            document.querySelector('.cost-product').innerText = totalProducts();
            document.querySelector('.cost').innerText = total();

        }
    });

    xhr.open('POST', '/getUserBasket');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(basketNameProduct));
