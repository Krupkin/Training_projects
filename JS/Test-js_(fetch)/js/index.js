"use strict";

const USERDATA = {
    name: "User",
    email: "User",
    difficulty: "Easy",
    testCategory: "General Knowlege",
    counterCorect: 0,
    curentTestNumber: 0,
    curentCorectValue: ""
};

let questionArr = [];

const mainBlock = document.querySelector("main");

const startForm = document.querySelector(".choise-form");

const nameData = startForm.querySelector(".form-name");
const mailData = startForm.querySelector(".form-email");
const category = startForm.querySelector(".category");
const difficulty = startForm.querySelector(".difficulty");
const formButton = startForm.querySelector(".form-button");


const testCont = document.querySelector(".test-cont")
const testBlock = testCont.querySelector(".test-block");


function isFormValid(){
    if(nameData.checkValidity() && mailData.checkValidity() && category.value >= 2 && difficulty.value >= 2){
        formButton.removeAttribute("disabled");
        formButton.classList.add("active")
        startForm.classList.add("active-form")
    } else {
        formButton.setAttribute("disabled", "disabled");
        formButton.classList.remove("active")
    }
}

function showData (evt){
    const selectValue = evt.target.value
    if(selectValue >= 2){
        evt.target.classList.add("active");
    }
    else if (selectValue < 2){
        evt.target.classList.remove("active");
    }
}



function questionMixer(correct, incorrect){
    USERDATA.curentCorectValue = correct;
    const newArr = incorrect;
    newArr.push(correct);
    return newArr.sort()
}



function checkAnswer(evt){
    if(evt.target.nodeName === "LI"){
        switch (evt.target.textContent){
            case USERDATA.curentCorectValue: 
                evt.target.classList.add('anwer-item-correct', 'animated', 'pulse', 'delay-0.1s')
                USERDATA.counterCorect += 1;
                setTimeout(()=> {
                    testCont.classList.add('animated', 'bounceOutLeft', 'delay-0.2s');
                }, 300)
                setTimeout(()=> {
                    testCont.firstElementChild.remove();
                    testCont.classList.remove("active-test");
                    testCont.classList.remove('animated', 'bounceOutLeft', 'delay-0.2s');
                    dataOperator()
                }, 1000)
            break;
            default: {
                evt.target.classList.add('anwer-item-incorrect', 'animated', 'shake', 'delay-0.2s')
                setTimeout(()=> {
                    testCont.classList.add('animated', 'bounceOutLeft', 'delay-0.2s');
                }, 300)
            
                setTimeout(()=> {
                    testCont.firstElementChild.remove();
                    testCont.classList.remove("active-test");
                    testCont.classList.remove('animated', 'bounceOutLeft', 'delay-0.2s');
                    dataOperator()
                }, 1000)
            }
            break;
        }
    }
}



function createTestStructure({question, correct_answer, incorrect_answers}){
    const sortedArr = questionMixer(correct_answer, incorrect_answers);
    const newElement = `<div class="test-block">
                                <div class="question-block">
                                    <span class="question">${question}</span>
                                </div>
                                <ol class="answer-block">
                                    <li class="anwer-item">${sortedArr[0]}</li>
                                    <li class="anwer-item">${sortedArr[1]}</li>
                                    <li class="anwer-item">${sortedArr[2]}</li>
                                    <li class="anwer-item">${sortedArr[3]}</li>
                                </ol>
                        </div>`
    testCont.insertAdjacentHTML('beforeend', newElement);
    const answerBlock = testCont.querySelector(".answer-block");
    answerBlock.addEventListener("click", checkAnswer)
}

function showResult(){
    let way = "./img/122.jpg";
    if (USERDATA.counterCorect < 5){
        way = "./img/1222.jpg"
    }
    const newElement = `<div class="result">
                            <div class="result-image">
                                <img src=${way} alt="result">
                            </div>
                            <h4 class="result-title">Your result:</h4>
                            <span class="result-text">you answered ${USERDATA.counterCorect} questions correctly</span>
                        </div>`
    mainBlock.insertAdjacentHTML('beforeend', newElement);
    const result = mainBlock.querySelector("result");
    result.classList.add('animated', 'bounceInUp', 'delay-0.2s');
}


function dataOperator(data){
    questionArr = data ? data : questionArr;
    if(USERDATA.curentTestNumber <= 11){
        createTestStructure(questionArr[USERDATA.curentTestNumber])
        USERDATA.curentTestNumber += 1;
        setTimeout(()=> {
            testCont.classList.add("active-test");
            testCont.classList.add('animated', 'bounceInRight', 'delay-0.2s');
        }, 400)
    } else {
        showResult()
    }

}

function dataCaptere(){
    USERDATA.name = nameData.value;
    USERDATA.email = mailData.value;
    USERDATA.category = category.value;
    
    switch(difficulty.value){
        case "2":
            USERDATA.difficulty = "easy";
        break;
        case "3":
            USERDATA.difficulty = "medium";
        break;
        case "4":
            USERDATA.difficulty = "hard";
        break;
    }
    fetch(`https://opentdb.com/api.php?amount=12&category=${USERDATA.category}&difficulty=${USERDATA.difficulty}&type=multiple`)
    .then(response => response.json())
    .then(data => dataOperator(data.results))
    .catch(error => console.log(error));
}

function startTest(evt){
    evt.preventDefault();
    startForm.classList.add('animated', 'bounceOutLeft', 'delay-0.4s');

    dataCaptere();
    setTimeout(()=> {
        startForm.setAttribute("style", "display: none");

    }, 400)
}

category.addEventListener("change", showData);
difficulty.addEventListener("change", showData);
startForm.addEventListener("change", isFormValid);
formButton.addEventListener("click", startTest);