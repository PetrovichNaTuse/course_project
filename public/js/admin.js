document.querySelector('.select-menu').onclick = function(event) {
    const targ = event.target;

    for(let i = 0; i < this.children.length; i++) {
        const item = this.children[i];
        document.querySelector('.' + item.getAttribute('data-block')).classList.remove('show-block');
    }

    if(targ.tagName.toLowerCase() !== 'li') return;

    const block = targ.getAttribute('data-block');
    document.querySelector('.' + block).classList.add('show-block');
}


const switchBlock = function(event) {
    const targ = event.target;

    if(targ.tagName.toLowerCase() !== 'h2') return;

    const block = targ.getAttribute('data-switch');
    document.querySelector('.' + block).classList.toggle('show-block');
}
document.querySelector('.product-block').addEventListener('click', switchBlock);

document.forms.addproduct.onsubmit = function(event) {
    event.preventDefault();
    const _that = this;
    
    const xhr = new XMLHttpRequest();

    // insert input
    const data = {};
    for(let i = 0; i < this.elements.length; i++) {
        const item = this.elements[i];
        const name = item.getAttribute('name');
        if(item.tagName.toLowerCase() === 'button') continue;

        data[name] = item.value;
    }
    data['label'] = [];
    data['reviews'] = [];

    xhr.onload = xhr.onerror = function() {
        console.log('Send data and status: ' + this.status + ' text: ' + this.statusText);
        
        if(this.status === 208) return alert('Такой товар уже существует');
        
        if(this.status === 204) return alert('Нет данных, пожалуйста повторите!');

        if(this.status == 200) {
            console.log('Данные успешно отправлены');

            const xhrImg = new XMLHttpRequest();

            xhrImg.onload = xhrImg.onerror = function() {
                console.log('Upload and status: ' + this.status + ' text: ' + this.statusText);

                if(this.status === 200) {
                    console.log('Изображение успешно загружено');
                    alert('Товар добавлен');
                    window.location.reload();
                }       
            }
            
            xhrImg.open('POST', '/uploadimg', true);
            xhrImg.setRequestHeader('file-name', data.name);
            xhrImg.send(_that.elements.fgimg.files[0]);
        }
    }
    xhr.open('POST', '/addproduct');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

}
