const info_block = document.querySelector('.info-block');
const regForm = document.forms.registration;

regForm.onsubmit = function(event) {
    event.preventDefault();

    if(!checkValidInput(this)) return;

    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if(this.readyState != 4) return;

        console.log(xhr.responseText)
        if(xhr.responseText === 'ok') {
            document.registration.sub.disabled = true;
            info_block.style.display = 'block';
            setTimeout(() => {window.location.assign('/')}, 5000);
        }
    }

    let data = {
        name: this.name.value,
        dob: this.dob.value,
        phone: this.phone.value,
        email: this.email.value,
        login: this.login.value,
        password: this.password.value,
        dor: Date.now(),
        basket: {},
        reviews: [],
        storageKey: ''
    }

    xhr.open('POST', '/reg');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    return false;
}
