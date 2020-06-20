const socket = io.connect('http://localhost:3076');

socket.on('truck_pending', () => console.log('truck_pending'));
socket.on('truck_fulfilled', console.log);

// document.body.onclick = event => {
//     socket.emit('truck_start', { col: 6, row: 7 });
// };


// Truck
const truckCols = Array(7).fill(false);
const truckCeils =  truckCols.map(() => Array(12).fill(false));
const truckBlock = document.querySelector('.truck-block');
const truckBlockH1 = document.createElement('h1');
truckBlockH1.innerText = 'Склад';
truckBlock.appendChild(truckBlockH1);

truckCeils.forEach((row, i) => {
    const r = document.createElement('div');
    r.classList.add('truck-block_row');
    truckBlock.appendChild(r);
    row.forEach((col, j) => {
        const c = document.createElement('div');
        c.classList.add('truck-block_col');
        c.setAttribute('row', 7 - i);
        c.setAttribute('col', 12 - j);

        r.addEventListener('click', (event) => {
            const target = event.target;
            const col = +target.getAttribute('col');
            const row = +target.getAttribute('row');

            // Срабатывает 12 событий на одно нажатие, надо пофиксить
            // if (truckCeils[row - 1][col - 1]) return alert('Ячейка уже занята');

            socket.emit('truck_start', { col, row, target })


            // TEMP
            const factor = 0.006012024048096192;
            const positionY = ((row + 1) * 50) - 55;
            const positionX = ((col + 1) * (145 / 3)) - ((145 / 3) - 5);
            const distance = positionX + positionY;
            const time = Math.abs(distance * factor) + 1;
            setTimeout(() => {
                target.classList.add('block_used')
            }, time * 900);


            truckCeils[row - 1][col - 1] = true;
        });

        r.appendChild(c);
    });
});


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
