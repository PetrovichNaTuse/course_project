/*то, что необходимо только после полной загрузки*/
var rectShopTop;

window.onload = function (event) {
    console.warn('Страница загрузилась за: ' + event.timeStamp + ' mc');
    
    console.log(document.querySelector(".desktop-menu").getBoundingClientRect().top);
    
    document.addEventListener("scroll", scrollDocumentMenu);
    
    function scrollDocumentMenu(event) {
        if (window.pageYOffset >= 191) {
            const headerMenu = document.querySelector(".header__menu");
            headerMenu.style.position = "fixed";
            headerMenu.style.top = "0";
            headerMenu.style.zIndex = "9999999";
            document.querySelector(".header").style.marginBottom = headerMenu.offsetHeight + "px";
            console.log(headerMenu.offsetHeight);
        }
        
        if (window.pageYOffset <= 191   ) {
            const headerMenu = document.querySelector(".header__menu");
            headerMenu.style.position = "";
            headerMenu.style.top = "";
            headerMenu.style.zIndex = "";
            document.querySelector(".header").style.marginBottom = "";
        }
    }
    
    /*shop-top__nav scroll*/
    rectShopTop = document.querySelector(".shop-top__nav").getBoundingClientRect().top + window.pageYOffset;
    
    
    document.addEventListener("scroll", scrollDocumentEvent);

    function scrollDocumentEvent(event) {
        let scrollDocumentY = window.pageYOffset;
        let heightWindow = document.documentElement.clientHeight;
        
        if ((scrollDocumentY + heightWindow) >= rectShopTop) {
            document.querySelector(".shop-top__tovar").classList.remove("shop-top__tovar_animate");
            document.removeEventListener("scroll", scrollDocumentEvent);
        }
    }
    /*END shop-top__nav scroll*/

}

/*END то, что необходимо только после полной загрузки*/

// тупая ссылка
document.querySelector('.feedback__login-create').addEventListener('click', () =>{
    window.location.assign('/reg')

    return false;
})

/*Slider*/
var homeSlider = document.querySelectorAll(".home-slider__wrapper");
var homeName = document.querySelector
let slide;
var setTimer;
var sliderCounter = 0;

//  Меняет слайды
function sliderSwap(slide) {

    let nextSlide;

    if (event) {
        if (event.target.classList.contains("slider__btn-next")) nextSlide = (slide === homeSlider[homeSlider.length - 1]) ? homeSlider[0] : slide.nextElementSibling;
        else if (event.target.classList.contains("slider__btn-prev")) nextSlide = (slide === homeSlider[0]) ? homeSlider[homeSlider.length - 1] : slide.previousElementSibling;
    } else nextSlide = (slide === homeSlider[homeSlider.length - 1]) ? homeSlider[0] : slide.nextElementSibling;

    /*nextSlide.style.visibility = "visible";
    nextSlide.style.opacity = "1";
    slide.style.opacity = "0";
    slide.style.visibility = "hidden";*/
    //    console.log(nextSlide);
    slide.classList.add("home-slider__wrapper_hidden");
    nextSlide.classList.remove("home-slider__wrapper_hidden");

    slideElement(slide, nextSlide);
}

//  Слайдирует элементы слайда
function slideElement(slider, nextSlide) {
    let sliderName, sliderOpisanie, sliderMore;

    sliderName = slider.querySelector(".home-slider__name");
    sliderOpisanie = slider.querySelector(".home-slider__opisanie");
    sliderMore = slider.querySelector(".slider__btn-more");

    slider.classList.add("active");
    nextSlide.classList.remove("active");
}

//  Останавливает через 36 смен слайдов
//  Ищет активный слайд
function slider() {


    for (let i = 0; i < homeSlider.length; i++) {
        slide = homeSlider[i];
        if (slide.getAttribute("data-slide") && getComputedStyle(slide).opacity !== "0") {
            break;
        }
    };

    sliderSwap(slide);

    if (sliderCounter === 35) {
        console.warn("stoped home-slide");
        clearInterval(setTimer);
        return;
    }

    sliderCounter++;
};
setTimer = setInterval(slider, 3000);

document.querySelector(".slider__btn-next").addEventListener("click", nextSlide);
document.querySelector(".slider__btn-prev").addEventListener("click", prevSlide);

function nextSlide(event) {
    event.preventDefault();


    clearInterval(setTimer);
    if (sliderCounter === 35) slider();
    else {
        slider();
        setTimer = setInterval(slider, 3000);
    }
}

function prevSlide(event) {
    event.preventDefault();

    clearInterval(setTimer);
    if (sliderCounter === 35) slider();
    else {
        slider();
        setTimer = setInterval(slider, 3000);
    }
}
/*END Slider*/

/*product-categories*/
var productCategories = document.querySelector(".product-categories");
console.log(productCategories.children.length);
for (let i = 0; i < productCategories.children.length; i++) {
    productCategories.children[i].addEventListener("mouseenter", categoriesEnterSlide);
    productCategories.children[i].addEventListener("mouseleave", categoriesLeaveSlide);
}

function categoriesEnterSlide(event) {
    let pcName = this.querySelector(".product-categories__name");
    let pcOpisanie = this.querySelector(".product-categories__opisanie");
    pcName.classList.add("product-categories__name_swap");
    pcOpisanie.classList.add("product-categories__opisanie_swap");

    setTimeout(function () {
        pcName.style.transition = ".3s ease-out";
        pcName.classList.remove("product-categories__name_swap");
        pcOpisanie.style.transition = ".3s ease-out";
        pcOpisanie.classList.remove("product-categories__opisanie_swap");
    }, 0);
}

function categoriesLeaveSlide(event) {
    this.querySelector(".product-categories__name").style.transition = "";
    this.querySelector(".product-categories__opisanie").style.transition = "";
}

/*END product-categories*/

//  check-list (значок раскрывающегося меню)
// document.querySelectorAll('.check-list').forEach(function(item) {
//     item.addEventListener('click', function(event) {
//         if (event.target.classList.contains('check-list')) {
//             this.classList.toggle('check-list_active');
//             this.classList.toggle('check-list__toggle_active');
//         }
//         
//     });
// });
//  END check-list (значок раскрывающегося меню)
