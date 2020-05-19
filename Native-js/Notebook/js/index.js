"use strict"



let DATAARR = []



const inputForm = document.querySelector(".form-block");

const textBlock = inputForm.querySelectorAll(".inputScript");

const formTitle = inputForm.querySelector(".title-area");
const formText = inputForm.querySelector(".text-area");
const formButton = inputForm.querySelector(".form-button");
const noteCloseBtn = document.querySelectorAll(".btn-close");
const notesBlock = document.querySelector(".notes-block");


const updateView = function () {
    if(localStorage.getItem("data") === null){
        return
    }
    const objectFromLS = JSON.parse(localStorage.getItem("data"))
    const arrFromLS = objectFromLS.arr;
    arrFromLS.forEach(data => {
        DATAARR.push(data);
        createBlock(data);
    })
};

const getTime = function(){
    const date = new Date;
    const year = date.getFullYear();
    const month = date.getMonth();
    const day =date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const newTime = `${hour}:${minutes}:${seconds}  ${day}/${month}/${year}`;
    return newTime
}

const createBlock = function(data){
    const newElement = ` <div class="notes-item" data-id="${data.ID}">
                                <div class="comand-panel">
                                    <button class="btn-edit">&#8613;</button>
                                    <button class="btn-close">X</button>
                                </div>
                                <div class="message-section">
                                    <h6 class="notes-item-title">${data.title}</h6>
                                    <span class="notes-item-text">${data.text}</span>
                                </div>
                                <div class="time section">
                                <span class="last-time">last edit  ${data.time}</span>
                                </div>
                        </div>`
    notesBlock.insertAdjacentHTML('beforeend', newElement);
    const lasElement = notesBlock.lastElementChild;
    const buttonClose = lasElement.querySelector('.btn-close');
    buttonClose.addEventListener("click", closeBlock)
}

const saveToLocalHost = function(data){
    const localStorageObject = {
        name: "write blocks",
        arr: DATAARR
    }
    localStorage.setItem('data', JSON.stringify(localStorageObject));
}

const clearArea = function(){
    formTitle.value = "";
    formText.value = "";
    checkInput();
}

const checkInput = function(evt){
    if (formText.value.length > 1 && formTitle.value.length > 1) {
        formButton.classList.add('active');
        formButton.removeAttribute("disabled")
    }
        else {
            formButton.classList.remove('active');
        }
}

const saveInfo = function(evt){
    evt.preventDefault();
    const randomID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newObj = {
        title: formTitle.value,
        text: formText.value,
        time: getTime(),
        ID: randomID
    }
    DATAARR.push(newObj);
    createBlock(newObj);
    saveToLocalHost(newObj);
    clearArea()
}

const deleteBlock = function(ID){
    DATAARR = DATAARR.filter(elem => elem.ID !== ID)
    localStorage.clear()
    updateView()
}

const closeBlock = function(evt){
    const ID = evt.target.parentNode.parentNode.dataset.id;
    evt.target.parentNode.parentNode.remove()
    deleteBlock(ID)
}

updateView()

noteCloseBtn.forEach(button => button.addEventListener("click", closeBlock))
textBlock.forEach(input => input.addEventListener("keydown", checkInput))
formButton.addEventListener("click", saveInfo);

