const calcForm = document.querySelector('.calc__form'),
    cityChoice = document.querySelector('.calc__city-choice'),
    userName = document.querySelector('#name'),
    userSurname = document.querySelector('#surname'),
    userPhone = document.querySelector('#phone'),
    userComment = document.querySelector('#comment'),
    cargoWidth = document.querySelector('#width'),
    cargoHeight = document.querySelector('#height'),
    cargoWeight = document.querySelector('#weight'),
    calcCargo = document.querySelector('.calc__cargo'),
    calcWeight = document.querySelector('.calc__weight'),
    deliveryDate = document.querySelector('#date'),
    deliveryTime = document.querySelector('#time'),
    priceSum = document.querySelector('.calc__sum'),
    calcBtn = document.querySelector('.calc__calc'),
    submitBtn = document.querySelector('.calc__submit'),
    resetBtn = document.querySelector('.calc__reset');

const overlay = document.querySelector('.overlay'),
    modal = document.querySelector('.modal'),
    modalSubmit = document.querySelector('.modal__submit');

    //Select city 
fetch("https://raw.githubusercontent.com/pensnarik/russian-cities/master/russian-cities.json")
.then(response => {
    return response.json();
})
.then(json => {
    json.forEach((item) => {
        console.log(item)
        let option = document.createElement('option');
        option.textContent = item.name;
        option.setAttribute('value', item.name);
        cityChoice.append(option);
    });
    //Choises
    const choices = new Choices(cityChoice, {
        searchEnabled: true,
        searchChoices: true,
        noResultsText: 'Ничего не найдено',
        itemSelectText: 'Выбрать'
        });
})
.catch(err => {
	console.error(err);
});



//IMask
const maskOptions = {
    mask: '+{7}(000)000-00-00',
    lazy: false,
    placeholderChar: '0'
};
const mask = IMask(userPhone, maskOptions);

//Cargo pic
function generateImage(width, height, weight) {
    width.addEventListener('change', () => {
        if (width.value > 10) {
            width.value = 10;
        }
        calcCargo.style.width = `${width.value * 10}px`;
        calcCargo.style.border = '1px solid var(--warning)';
        calculatePrice(cargoWidth, cargoHeight, cargoWeight);
    });
    height.addEventListener('change', () => {
        if (height.value > 10) {
            height.value = 10;
        }
        calcCargo.style.height = `${height.value * 10}px`;
        calcCargo.style.border = '1px solid var(--warning)';
        calculatePrice(cargoWidth, cargoHeight, cargoWeight);
    });
    weight.addEventListener('change', () => {
        calcWeight.textContent = `${weight.value}кг`;
        calculatePrice(cargoWidth, cargoHeight, cargoWeight);
    });

}

generateImage(cargoWidth, cargoHeight, cargoWeight);

//Calculating price

function calculatePrice(width, height, weight) {
    let price = (Math.round(width.value) * 1000) + (Math.round(height.value) * 1200);
    if (weight.value > 250) {
        price += 3500;
    }
    //Price dependence about the region. Add cases for regions :)
    switch(cityChoice.value) {
        case 'Москва':
            price += 5000;
            break;
        case 'Санкт-Петербург':
            price += 3000;
            break;
        case 'Владивосток':
            price += 15000;
            break;
        default:
            price = price;
    }
    price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    priceSum.innerHTML = `
                          <p class="calc__result">
                              ${price} рублей
                          </p>
                          `;
}
cityChoice.addEventListener('change', () =>{
    calculatePrice(cargoWidth, cargoHeight, cargoWeight);
});
// calcBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     calculatePrice(cargoWidth, cargoHeight, cargoWeight);
// })

// Reset
resetBtn.addEventListener('click', () => {
    priceSum.innerHTML = '';
    calcWeight.textContent = '';
    calcCargo.style.width = 0;
    calcCargo.style.height = 0;
    calcCargo.style.border = 'none';
});

//Modal

submitBtn.addEventListener('click', (e) => {
    if (userName.value && userSurname.value && userPhone.value && cargoWidth.value && cargoHeight.value) {
        e.preventDefault();
        calculatePrice(cargoWidth, cargoHeight, cargoWeight);
        modal.innerHTML = `
              <span class="modal__close">&#10008;</span>
              <h2 class="title">Детали заказа:</h2>
              <p class="modal__name">Желаемый регион: <span>${cityChoice.value}</span></p>
              <p class="modal__name">Имя отправителя: <span>${userName.value}</span></p>
              <p class="modal__surname">Фамилия отправителя: <span>${userSurname.value}</span></p>
              <p class="modal__phone">Телефон отправителя: <span>${userPhone.value}</span></p>
              <p class="modal__comment">Комментарий: <span>${userComment.value}</span></p>
              <p class="modal__width">Ширина груза: <span>${cargoWidth.value}м.</span></p>
              <p class="modal__height">Высота груза: <span>${cargoHeight.value}м.</span></p>
              <p class="modal__date">Дата доставки: <span>${deliveryDate.value}</p>
              <p class="modal__time">Время доставки: <span>${deliveryTime.value}</span></p>
              <p class="modal__price">Стоимость доставки: <span>${document.querySelector('.calc__result').textContent}</span></p>
              <button class="btn modal__submit">Подтвердить</button>
          `;
        overlay.style.display = 'block';
    }
});
const modalClose = document.querySelector('.modal__close');
overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === modalClose || e.target === modalSubmit) {
        modalClose.addEventListener('click', () => {
            overlay.style.display = "none";
        });
    }
    overlay.style.display = 'none';
})

