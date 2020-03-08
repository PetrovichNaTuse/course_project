const product = document.querySelector('.shop-top__tovar-wrapper');

const addProductToBasket = (bask, prod) => {
    if(bask.hasOwnProperty(prod)) bask[prod] +=1;
    else bask[prod] = 1;
}

product.onclick = function(event) {
    event.preventDefault();
    const targ = event.target;

    if(targ.closest('.shop-top__btn-add')) {
        const user = window.localStorage.getItem('storageKey');
        const idProduct = targ.getAttribute('data-id');
        const userBasket = window.localStorage.getItem('userBasket');
        
        if(!userBasket) {
            let basket = {};
            addProductToBasket(basket, idProduct);
            window.localStorage.setItem('userBasket', JSON.stringify(basket));
        }
        const basket = JSON.parse(userBasket);
        addProductToBasket(basket, idProduct);
        window.localStorage.setItem('userBasket', JSON.stringify(basket));

        if(user) {
            const parseuser = JSON.parse(user);
            parseuser['basket'] = basket;

            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                console.log(user);
            }
            

            xhr.open('POST', '/userBasket');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(parseuser));
        }
        
    }
    if(targ.closest('.shop-top__link-img_fast-view')) console.log('я кнопка как кнопка');
}
