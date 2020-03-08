var selectStyle = document.getElementById('select-style');
var selectStyleClose = document.getElementById('select-style__close');
var selectFont = document.getElementById('switch-select');
var selectStyleReset = document.getElementById('select-style__reset');

//  применяет цветовую тему при загрузке страницы
window.addEventListener('load', function (event) {
    const de = document.documentElement;
    const colorTheme = window.localStorage.getItem('colorTheme');
    
    if (colorTheme) {
        if (de.classList.contains(colorTheme)) return;
        
        for (let i = de.classList.length; i != 0; i--) {
            de.classList.remove(de.classList[i - 1]);
        }
        de.classList.add(localStorage.getItem('colorTheme'))
    }
});

//  Сброс темы на default
selectStyleReset.onclick = function (event) {
    event.preventDefault();
    
    document.documentElement.classList.remove(localStorage.getItem('colorTheme'));
    
    localStorage.clear();
}

selectStyleClose.addEventListener('click', closeSelect);

function closeSelect(event) {
    selectStyle.classList.toggle('select-style__toggle');
}

selectStyle.addEventListener('click', selectedTheme);

function selectedTheme(event) {
    var target = event.target;
    
    while (target) {
        if (target.classList.contains('switch-color__item')) break;
        target = target.parentNode;
    }
    
    let newDocumentTheme = target.getAttribute('data-class');
    let oldDocumentTheme = document.documentElement.classList[0];
    
    document.documentElement.classList.remove(oldDocumentTheme);
    document.documentElement.classList.add(newDocumentTheme);
    
    localStorage.setItem('colorTheme', newDocumentTheme);
    console.log(localStorage.getItem('colorTheme'));
}

selectFont.addEventListener('click', selectDocumentColor);

function selectDocumentColor(event) {
    let target = event.target;
        console.log(target)
    
    if (target.tagName.toLowerCase === 'option') {
    } else return;
}

