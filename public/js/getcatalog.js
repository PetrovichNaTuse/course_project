const shopTopLi = document.querySelector('.shop-top__tovar-item');
const shopTopUl = document.querySelector('.shop-top__tovar');

shopTopUl.innerHTML = '';

const xhr = new XMLHttpRequest();

xhr.onload = function() {
    
    const products = JSON.parse(xhr.responseText);

    const shopTop = document.querySelector('.shop-top');


    products.forEach(item => {
        //debugger;
        const pathImgProduct = item.fgimg.slice(item.fgimg.indexOf('/img/') + 1);
        const sale = (item.cena - (item.cena * (item.sale / 100))).toFixed(2);
        const li = shopTopLi.cloneNode(true);
        
        li.setAttribute('data-id', item._id);
        li.querySelector('button').setAttribute('data-id', item._id);
        li.querySelector('.shop-top__btn-add').setAttribute('data-id', item._id);
        li.querySelector('.shop-top__btn-add i').setAttribute('data-id', item._id);
        li.querySelector('img').src = pathImgProduct;
        li.querySelector('.shop-top__name').innerText = item.name;
        li.querySelector('.shop-top__cena').innerText = item.cena;
        if(item.sale) {
            li.querySelector('.shop-top__cena').innerHTML = `${sale} <del>${item.cena}</del> <span class="shop-top__cena-sale_proc">-${item.sale}%</span>`;
            li.classList.add('shop-top__tovar-item_sale');
        }

        shopTopUl.appendChild(li);
        document.querySelector('.shop-top__tovar-popular').appendChild(li);

    });
}

xhr.open('POST', '/getproducts');
xhr.send();
