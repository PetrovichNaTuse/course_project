//  проверка полей
//document.querySelectorAll
const checkValidInput = (form) => {

    for (let i = 0; i < form.elements.length; i++) {
        let elem = form.elements[i];

        if (elem.value == '' && elem.tagName.toLowerCase() === 'input') {
            elem.classList.add('incorrect-input');
            return false;
        } else elem.classList.remove('incorrect-input');
    }
    return true;
}
//  END проверка полей 
