const listAc = ['Мои заказы', 'Мои возвраты', 'Мои кредитные квитанции', 'Мои адреса', 'Моя информация', 'Моё избранное'];

document.querySelector('.feedback__login-create').addEventListener('click', () =>{
    window.location.assign('/reg')
    return false;
});

document.querySelector('.feedback__login-form').addEventListener('submit', function() {
    event.preventDefault();

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(this.readyState != 4) return;

        if(xhr.status !== 200 && xhr.responseText === 'User not found') return alert('Нет такого пользователя');
        if(xhr.status === 400 && xhr.responseText === 'Invalid password') return alert('Неверный пароль');
        if(xhr.status === 200) {
            //const keyStore;
            
            const user = JSON.parse(xhr.responseText);
            const array = new Uint32Array(10);
            window.crypto.getRandomValues(array);
            const keyStore = array[3] + user._id.slice(8, -6) + array[8];

            const dataKey = {
                _id: user._id,
                key: keyStore
            };

            const xhrAddKey = new XMLHttpRequest();

            xhrAddKey.onreadystatechange = function() {
                if(this.readyState != 4) return;

                if(xhrAddKey.status != 200) return alert('Ошибка сервера');

                window.localStorage.setItem('storageKey', JSON.stringify(dataKey));
                console.log(xhrAddKey.response)
                if(Object.keys(JSON.parse(xhrAddKey.response)).length === 0) {
                    const xhrAddBasket = new XMLHttpRequest();

                    xhrAddBasket.open('POST', '/userBakset');
                    xhrAddBasket.setRequestHeader('Content-Type', 'application/json');
                    xhrAddBasket.send(JSON.stringify({_id: user._id, basket: JSON.parse(window.localStorage.getItem('userBasket'))}));
                    
                } else window.localStorage.setItem('userBasket', xhrAddKey.responseText);
                window.location.reload();

            }
            xhrAddKey.open('POST', '/autentication/addkey');
            xhrAddKey.setRequestHeader('Content-Type', 'application/json');
            xhrAddKey.send(JSON.stringify(dataKey));
        }
    }

    const data = {
        email: this.email.value,
        passwd: this.password.value
    };

    xhr.open('POST', '/authentication');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    //return false;
})

window.addEventListener('DOMContentLoaded', function(event) {
    const storageKey = window.localStorage.getItem('storageKey');

    if(!storageKey) return;

    const xhrCheckKey = new XMLHttpRequest();

    xhrCheckKey.onreadystatechange = function() {
        if(this.readyState !== 4) return;

        if(xhrCheckKey.status === 426) {
            window.localStorage.removeItem('storageKey');
            alert('Ошибка идентификации. Пожалйста, авторизуйтесь повторно');
            return;
        }
        if(xhrCheckKey.status === 200) {
            const account = document.querySelector('.feedback__login');
            const accountList = document.querySelector('.check-list__toggle');
            const accountBtn = document.createElement('button');

            account.innerText = 'Учетная запись';
            accountList.innerHTML = '';
            accountBtn.innerHTML = '<i class="fas fa-unlock-alt"></i> Выйти';
            accountBtn.setAttribute('type', 'button');
            accountBtn.classList.add('feedback-login__goout');
            listAc.forEach(item => {
                const span = document.createElement('span');
                span.innerText = item;
                accountList.appendChild(span);
                account.appendChild(accountList);
            });
            accountList.appendChild(accountBtn);
            document.querySelector('.feedback-login__goout').addEventListener('click', () => {
                const xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function() {
                    if(this.readyState != 4) return;

                    if(xhr.status === 200) {
                        window.localStorage.removeItem('storageKey');
                        window.localStorage.removeItem('userBasket');
                        window.location.reload();
                    }
                }

                xhr.open('POST', '/logout')
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(window.localStorage.getItem('storageKey'));

            });
        }

    }

    xhrCheckKey.open('POST', '/checkKey');
    xhrCheckKey.setRequestHeader('Content-Type', 'application/json');
    xhrCheckKey.send(window.localStorage.getItem('storageKey'));

});


// делегированием отменить по умолчанию только для ссылки
document.querySelectorAll('.check-list').forEach(function(item) {
    item.addEventListener('click', function(event) {
        if (event.target.classList.contains('check-list')) {
            this.classList.toggle('check-list_active');
            this.classList.toggle('check-list__toggle_active');
        }
    });
});
