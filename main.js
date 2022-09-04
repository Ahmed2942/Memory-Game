let cardsContainer = document.querySelector(".card").parentElement;
let cards = Array.from(document.querySelectorAll(".card"));
let flippingNum = 0;
let failNum = 0;
let greetingBox = document.querySelector('.postInfo .postName output');
let failedTrialsBox = document.querySelector('.postInfo .postFailed output');
let splashScreen = document.querySelector(".splash");
let startButton = document.querySelector(".splash span");
let shuffleButton = document.querySelector("button.shuffle");
let resetButton = document.querySelector("button.reset");
let counterBox = document.querySelector(".count-down output");
let myTimer;
let failAudio = new Audio("audio/fail.wav");
let successAudio = new Audio("audio/success.mp3");

startButton.onclick = function(){
    resetData();
    cards = shuffle(cards, cardsContainer);
    splashScreen.style.opacity = "0";
    setTimeout(function(){
        splashScreen.style.display = "none";
    }, 1000);
}

shuffleButton.addEventListener("click", function(){
    removeAllflipped();
    console.log(cards);
    cards = shuffle(cards, cardsContainer);
    console.log(cards);
}, false)

resetButton.addEventListener("click", function(){
    removeAllflipped();
    resetData();
    cards = shuffle(cards, cardsContainer);
}, false)

for(let i=0; i<cards.length; i++){
    cards[i].addEventListener('click', gameCheck, false);
}

function removeAllflipped() {
    let flippedCards = cards.filter(card => card.classList.contains("flipped") || card.classList.contains("match"));
    flippedCards.forEach(card => {
        card.classList.remove("flipped");
        card.classList.remove("match");
    })
    flippingNum = 0;
}

function resetData(){
    failNum = 0;
    failedTrialsBox.textContent = failNum;
    let name = prompt("My name is : ") || "Unknown";
    greetingBox.textContent = name;
    clearInterval(myTimer);
    countDown();
}

function countDown() {
    'use strict';
    let counter = 30;
    counterBox.textContent = counter;
    myTimer = setInterval(() => {
        if(counter > 0) {
            counter--;
            counterBox.textContent = counter; 
        }
        else {
            alert("Game Over");
            removeAllflipped();
            cards = shuffle(cards, cardsContainer);
            resetData();
        }
        
    }, 1000);
}

function shuffle(arr, container) {
    'use strict';
    let num = arr.length;
    let randomItems = [];
    let randNum;
    for(let i=0; i<num; i++) {
        randNum = Math.floor(Math.random() * arr.length);
        randomItems.push(arr[randNum]);
        console.log(arr[randNum]);
        container.removeChild(arr[randNum]);
        arr.splice(randNum, 1);
    }
    console.log(randomItems);
    for(let i=0; i<num; i++) {
        container.appendChild(randomItems[i]);
    }
    animateShuffle(randomItems, container);
    return randomItems;
}
function gameCheck() {
    'use strict';
    let currentCard = this;
    if(currentCard.classList.contains("card") && !(currentCard.classList.contains("flipped"))){
        currentCard.classList.add('flipped');
        flippingNum++;
        if(flippingNum == 2) {
            let flippingCards = cards.filter(card => card.classList.contains("flipped"));
            disableClickEvent();
            setTimeout(function() {
                if(flippingCards[0].dataset.content != flippingCards[1].dataset.content){
                    flippingCards.forEach(card => card.classList.remove("flipped"));
                    failNum++;
                    failedTrialsBox.textContent = failNum;
                    failAudio.play();
                }
                else {
                    flippingCards.forEach(card => card.classList.add("match"));
                    flippingCards.forEach(card => card.classList.remove("flipped"));
                    successAudio.play();
                }
                resettingClickEvent();
                flippingNum = 0;
            }, 500)
        }
    }
    
}
function disableClickEvent (){
    cards.forEach((card) => {
        card.classList.add("disabled");
    })
}
function resettingClickEvent (){
    cards.forEach((card) => {
        card.classList.remove("disabled");
    })
}
function animateShuffle(items, container) {
    containerHeight = container.offsetHeight;
    console.log(containerHeight);
    container.style.height = containerHeight + "px";
    items.forEach(card => {
        let topPos = card.offsetTop-5;
        let leftPos = card.offsetLeft-5;
        card.style.top = topPos + "px";
        card.style.left = leftPos + "px";
    })
    items.forEach(card => card.style.position = "absolute");
    items.forEach(card => card.classList.add("animate"));
    setTimeout(() => {
        items.forEach(card => card.classList.remove("animate"));
        items.forEach(card => card.style.position = "static");
        container.style.overflowY = "visible";
    }, 1000)
}