// 1. Функционал перемещения по карточкам, вперед и назад
// 2. Проверка на ввод данных
// 3. Получение (сбор) данных с карточек
// 4. Записывать все введенные данные
// 5. Реализовать работу прогресс бара
// 6. Посветка рамки для радио и чекбоксов

// Объект с сохраненными ответами
var answers = {
    2: null,
    3: null,
    4: null,
    5: null
};

// Движение вперед
var btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button) {
    button.addEventListener("click", function() {
        var thisCard = this.closest("[data-card]");

        if (thisCard.dataset.validate == "novalidate") {
            console.log("NOVALIDATE");
            navigate("next", thisCard);
        } else {
            console.log("VALIDATE");
            navigate("next", thisCard);
        }
    });
});

// Движение назад
var btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button) {
    button.addEventListener("click", function() {
        var thisCard = this.closest("[data-card]");
        navigate("prev", thisCard);
    });
});

// Функция для навигации вперед и назад
function navigate(direction, thisCard) {
    var thisCardNumber = parseInt(thisCard.dataset.card);
    var nextCard;

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

// Функция сбора заполненных данных с карточки
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

    var question;
    var result = [];

    // Находим карточку по номеру и data-атрибуту
    var currentCard = document.querySelector(`[data-card="${number}"]`);

    // Находим главный вопрос карточки
    question = currentCard.querySelector("[data-question]").innerText;

    // 1. Находим все заполненные значения из радио кнопок
    var radioValues = currentCard.querySelectorAll('[type="radio"]');
    // console.log("gatherCardData -> radioValues", radioValues)
    radioValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    // 2. Находим все заполненные значения из чекбоксов
    var checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function(item){
        console.dir(item);
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    })

    // 3. Находим все заполненные значения из инпутов
    var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(function(item){
        itemValue = item.value;
        if ( itemValue.trim() != "" ) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    })

    console.log(result);

    var data = {
        question: question,
        answer: result
    };

    return data;
}
