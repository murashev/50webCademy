// ? 1. Функционал перемещения по карточкам, вперед и назад
// ? 2. Проверка на ввод данных
// ? 3. Получение (сбор) данных с карточек
// ? 4. Записывать все введенные данные
// ? 5. Реализовать работу прогресс бара
// ? 6. Посветка рамки для радио и чекбоксов

// ! Объект с сохраненными ответами
let answers = {
    2: null,
    3: null,
    4: null,
    5: null
};

// ! Движение вперед
let btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function (button) {
    button.addEventListener("click", function () {
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card);

        if (thisCard.dataset.validate == "novalidate") {
            navigate("next", thisCard);
            updateProgressBar("next", thisCardNumber);
        } else {
            // ! при движении вперёд, данные сохраняются в объект
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));
            // ! валидация на заполненность
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate("next", thisCard);
                updateProgressBar("next", thisCardNumber);
            } else {
                alert("дайте ответ!");
            }
        }
    });
});

// ! Движение назад
let btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function (button) {
    button.addEventListener("click", function () {
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card);
        navigate("prev", thisCard);
        updateProgressBar("prev", thisCardNumber);
    });
});

// ! Функция для навигации вперед и назад
function navigate(direction, thisCard) {
    let thisCardNumber = parseInt(thisCard.dataset.card);
    let nextCard;

    if (direction == "next") {
        nextCard = thisCardNumber + 1;
    } else if (direction == "prev") {
        nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add("hidden");
    document
        .querySelector(`[data-card="${nextCard}"]`)
        .classList.remove("hidden");
}

// ! Функция сбора заполненных данных с карточки
function gatherCardData(number) {
    /*
    {
        question: "Ваши любимые блюда",
        answer:
            [
                { name: "pirogi", value: "Пироги" },
                { name: "salati", value: "Салаты" }
            ]
    }
    */

    let question;
    let result = [];

    // ! Находим карточку по номеру и data-атрибуту
    let currentCard = document.querySelector(`[data-card="${number}"]`);

    // ! Находим главный вопрос карточки
    question = currentCard.querySelector("[data-question]").innerText;

    // ! 1. Находим все заполненные значения из радио кнопок
    let radioValues = currentCard.querySelectorAll('[type="radio"]');
    radioValues.forEach(function (item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    // ! 2. Находим все заполненные значения из чекбоксов
    let checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function (item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    })

    // ! 3. Находим все заполненные значения из инпутов
    let inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(function (item) {
        // ??? нужен ли здесь let?    
        itemValue = item.value;
        if (itemValue.trim() != "") {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    })

    let data = {
        question: question,
        answer: result
    };

    return data;
}

// ! Функция записи ответов в объект с ответами
function saveAnswer(number, data) {
    answers[number] = data;
}

// ! Функция проверки на заполненность
function isFilled(number) {
    if (answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}


// ! Функция для проверки email

function validateEmail(email) {
    let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}
// ! Функция проверки на заполненность обязательных полей и инпутов с email

function checkOnRequired(number) {
    let currentCard = document.querySelector(`[data-card="${number}"]`);
    let requiredFields = currentCard.querySelectorAll("[required]");
    let isValidArray = [];

    requiredFields.forEach(function (item) {
        if (item.type == "checkbox" && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == "email") {
            if (validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false;
    }
}

// ! подсвечиваем рамку у радиокнопок
document.querySelectorAll(".radio-group").forEach(function (item) {
    item.addEventListener("click", function (e) {
        // проверяем где произошел клик - внутри тега label или нет
        let label = e.target.closest("label");
        if (label) {
            // отменяем активный класс у неактивных лейблов
            label.closest(".radio-group").querySelectorAll("label").forEach(function (item) {
                item.classList.remove("radio-block--active");
            })
            // добавляем активный класс к лейблу на который кликнули
            label.classList.add("radio-block--active");
        }
    })
})

// ! подсвечиваем рамку у чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function (item) {
    item.addEventListener('change', function () {
        //если чекбокс проставлен
        if (item.checked) {
            // добавляем активный класс
            item.closest("label").classList.add("checkbox-block--active");
        } else {
            //убираем активный класс
            item.closest("label").classList.remove("checkbox-block--active");
        }
    })
})


// ! Отображение прогресс бара
function updateProgressBar(direction, cardNumber) {
    // ! Расчет всего кол-ва карточек // 10
    let cardsTotalNumber = document.querySelectorAll("[data-card]").length;

    // ! Текущая карточка
    // ! Проверка направления перемещения
    if (direction == "next") {
        cardNumber = cardNumber + 1;
    } else if (direction == "prev") {
        cardNumber = cardNumber - 1;
    }

    // ! Расчет % прохождения
    let progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();

    // ! Находим и обновляем прогресс бар
    let progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress");
    if (progressBar) {
        // ! Обновить число прогресс бара
        progressBar.querySelector(".progress__label strong").innerText = `${progress}%`;

        // ! Обновить полоску прогресс бара
        progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`;
    }
}
