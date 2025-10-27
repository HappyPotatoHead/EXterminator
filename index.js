import { getApiKey, setApiKey, clearApiKey, hasApiKey } from "./apiKeyManager.js";

// Hamburger
const hamburger = document.getElementById('hamburger');
const firstLine = document.getElementById('line-1');
const secondLine = document.getElementById('line-2');
const thirdLine = document.getElementById('line-3');

const sideBar = document.getElementById('sidebar');

hamburger.addEventListener('click', () => {
    firstLine.classList.toggle('rotate-45');
    firstLine.classList.toggle('translate-y-2');

    secondLine.classList.toggle('opacity-0');
    secondLine.classList.toggle('translate-x-5');
    secondLine.classList.toggle('-translate-x-5');
    
    thirdLine.classList.toggle('-rotate-45'); 
    thirdLine.classList.toggle('-translate-y-1');

    if (sideBar.classList.contains('-translate-x-48')){ 
        sideBar.classList.remove('-translate-x-48');
        sideBar.classList.add('translate-x-0');
    } else {
        sideBar.classList.add('-translate-x-48');
        sideBar.classList.remove('translate-x-0');
    }
});


// Toggling dark mode
const toggleModeBtn = document.getElementById('toggle-mode');
const sun = document.getElementById('sun-icon');
const moon = document.getElementById('moon-icon');

toggleModeBtn.addEventListener('click', () => {
    if (!sun.classList.contains('opacity-0')) {
        sun.classList.add('opacity-0', '-rotate-90');
        moon.classList.remove('opacity-0', 'rotate-90');
        if (!document.documentElement.classList.contains('dark')){
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', true);
        }
        // moon.classList.remove('hidden');
        // document.body.classList.remove('dark');
    }
    else {
        sun.classList.remove('opacity-0', '-rotate-90');
        moon.classList.add('opacity-0', 'rotate-90');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', false);
    }
    // document.body.classList.add('dark');
});

if (localStorage.getItem('darkMode') === 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.querySelector('html').classList.add('dark');
    sun.classList.add('opacity-0', '-rotate-90');
    moon.classList.remove('opacity-0', 'rotate-90');
} else {
    document.querySelector('html').classList.remove('dark');
}

const apiInput = document.getElementById("apiInput");
const apiContainer = document.getElementById('giveMeYourAPIContainer');
const apiCard = document.getElementById("giveMeYourAPI");
const apiKeyInput = document.getElementById('apiKeyInput');
const apiDesc = document.getElementById('apiDesc');
const currentApiKey = getApiKey();

apiDesc.innerHTML += `<br><span class="text-sm text-gray-400"> Current Key: ${currentApiKey}</span>`

apiContainer.addEventListener("click", (event) => {
  if (event.target === apiContainer) {
    apiContainer.classList.add("hidden");
  }
});


window.addEventListener("load", () => { 
    if (hasApiKey()){
        apiContainer.classList.add('hidden');
    }
});

apiInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        const userAPI = apiInput.value.trim();
        if (userAPI) {
            setApiKey(userAPI);
            // localStorage.setItem("userAPI", userAPI);
            apiContainer.classList.add('hidden');
            apiInput.value='';
        }
    }
});

apiKeyInput.addEventListener("click", () => {
    // clearApiKey();
    apiContainer.classList.toggle("hidden");
    
    // else
    //     cardContainers.classList.remove('hidden'); 
    // }; 
});


let cardContainers = document.getElementById('cardContainer');
let isDragging = false;
let startX = 0;
let currentCard = null;
let selectedPersonality = null;

const cardColors = [
  "#b2df8a",
  "#a6cee1",
  "#1f78b4",
  "#33a02b",
  "#fc9a99",
  "#e21a1c",
  "#fdbe70",
  "#ff7f00",
  "#cab2d6",
  "#000000",
];

const personalityList = {
    // Davinci
    1: {
        name: "Davinci",
        description: "Davinki",
        imageSource: "./assets/images/davinki.jpg",
    },
    2: {
        name:"Bob",
        description: "I think his name is Bob",
        imageSource: "./assets/images/bob.jpg"
    },
    3: {
        name: "Charlie",
        description: "Unemployed",
        imageSource: "./assets/images/charlie.jpg",
    },
    4: {
        name: "Toh-May-Toh Toh-Mah-Toh",
        description: "Really likes tomatoes",
        imageSource: "./assets/images/tomato.jpg",
    },
}

const createCards = () => {
    for (let i in personalityList) {
        const card = document.createElement('div');
        card.className = `
            card
            absolute w-full h-full rounded-[10px] flex flex-col
            justify-center  text-4xl font-bold text-white 
            shadow-lg select-none transition-transform duration-300 ease-in-out`;
        card.innerHTML = `
            <div class="h-[200px] w-full pb-4 -mt-20">
                <img class="w-full h-full object-contain rounded-lg" src="${personalityList[i].imageSource}" alt="${personalityList[i].name}" draggable="false">
            </div>
            <h1 class = "absolute text-2xl ps-6 left-0 bottom-20 text-black">${personalityList[i].name}</h1>
            <p class = "absolute left-0 bottom-10 text-lg ps-6 text-black">${personalityList[i].description}</p>
            <footer class="absolute bottom-2 left-0 w-full px-4 flex justify-between ml-auto">
                <p class="text-xs text-slate-600">\<-Next</p>
                <p class="text-xs text-slate-600">Choose -\></p> 
            </footer>
        `;
        card.setAttribute("personality", i);
        card.style.backgroundColor = cardColors[i];
        cardContainers.appendChild(card);
    }
};

const personalities = document.getElementById("personalities");
personalities.addEventListener("click", ()=>{
    if (!cardContainers.classList.contains('hidden')) cardContainers.classList.toggle("hidden");
    else{     
        createCards();
        cardContainers.classList.remove('hidden'); 
    }; 
});

window.addEventListener("load", () => { 
    createCards(); 
    localStorage.removeItem("selectedPersonality");
});

const getTopCard = () => {
    return cardContainers.querySelector('.card:last-child');
};

// Mouse events for desktop
cardContainers.addEventListener('mousedown', (e) => {
    currentCard = getTopCard();
    if (!currentCard) return;
    isDragging = true;
    startX = e.clientX;
    currentCard.style.transition = 'none';
});

cardContainers.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentCard) return;
    const deltaX = e.clientX - startX;
    currentCard.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
});

cardContainers.addEventListener('mouseup', (e) => {
    if (!isDragging || !currentCard) return;
    const deltaX = e.clientX - startX;
    handleSwipe(deltaX);
});

// Touch events for mobile
cardContainers.addEventListener('touchstart', (e) => {
    currentCard = getTopCard();
    if (!currentCard) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    currentCard.style.transition = 'none';
});

cardContainers.addEventListener('touchmove', (e) => {
    if (!isDragging || !currentCard) return;
    const deltaX = e.touches[0].clientX - startX;
    currentCard.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
});

cardContainers.addEventListener('touchend', (e) => {
    if (!isDragging || !currentCard) return;
    const deltaX = e.changedTouches[0].clientX - startX;
    handleSwipe(deltaX);
});

const handleSwipe = (deltaX) => {
    const sensitivity = 50;
    if (Math.abs(deltaX) > sensitivity) {
        if (deltaX > 0){
            currentCard.style.transition = `transform 0.4s ease, opacity 0.4s ease`;
            currentCard.style.transform = `translateX(1000px) rotate(45deg)`;
            currentCard.style.opacity = '0';

            selectedPersonality = currentCard.getAttribute("personality");
            localStorage.setItem("selectedPersonality", selectedPersonality);

            window.dispatchEvent(
                new CustomEvent("personalityChanged", { detail : selectedPersonality })
            );

            setTimeout(() => {
                while (cardContainers.firstChild)cardContainers.removeChild(cardContainers.firstChild);
                currentCard = null;
            }, 0);
            cardContainers.classList.add("hidden");
        }
        else{
            currentCard.style.transition = `transform 0.4s ease, opacity 0.4s ease`;
            currentCard.style.transform = `translateX(-1000px) rotate(-45deg)`;
            currentCard.style.opacity = '0';

            setTimeout(() => {
                currentCard.style.transition = 'none';
                currentCard.style.transform = 'translateX(0) rotate(0)';
                currentCard.style.opacity = '1';
                
                cardContainers.insertBefore(currentCard, cardContainers.firstChild);
                currentCard = null;
        }, 0);
        }
    } else {
        currentCard.style.transition = 'transform 0.3s ease';
        currentCard.style.transform = 'translateX(0) rotate(0)';
    }
    isDragging = false;
};