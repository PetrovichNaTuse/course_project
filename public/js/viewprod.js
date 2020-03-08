document.querySelector('.shop-top__nav').onclick = function(event) {
    event.preventDefault();
    const targ = event.target;

    if(targ.tagName.toLowerCase() != 'a') return;

    document.querySelector('.shop-top__link_active').classList.remove('shop-top__link_active');
    targ.classList.add('shop-top__link_active');
    
    const label = targ.getAttribute('data-label');
    document.querySelectorAll('.shop-top__tovar').forEach(item => {
        if(item.closest('.shop-top__tovar_animate')) return;
        item.classList.add('shop-top__tovar_animate');
        document.querySelector('.shop-top__tovar-' + label).classList.remove('shop-top__tovar_animate');
    })
};

const shopTopLi = document.querySelector('.shop-top__tovar-item');
const shopTopUl = document.querySelector('.shop-top__tovar');

//shopTopUl.removeChild(shopTopLi);
shopTopUl.innerHTML = '';
//document.querySelector('.shop-top__tovar-popular').appendChild(shopTopLi);

const xhr = new XMLHttpRequest();

xhr.onload = function() {
    
    const products = JSON.parse(xhr.responseText);
    console.log(products);

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

        //shopTopUl.appendChild(li);
        //document.querySelector('.shop-top__tovar-popular').appendChild(li);

        item.label.forEach(label => {
            const liClone = li.cloneNode(true);
            const nodeLabel = document.querySelector('.shop-top__tovar-' + label);

            if(nodeLabel.children.length === 4) return;
            switch(label) {
                case 'popular':
                    nodeLabel.appendChild(liClone);
                    console.log(1);
                    break;
                case 'new':
                    nodeLabel.appendChild(liClone);
                    console.log(2);
                    break;
                case 'top':
                    nodeLabel.appendChild(liClone);
                    console.log(3);
                    break;
                case 'sale':
                    nodeLabel.appendChild(liClone);
                    console.log(4);
                    break;
                default: alert('Ошибка сервера');
            }
        });
    });
}

xhr.open('POST', '/getproducts');
xhr.send();
