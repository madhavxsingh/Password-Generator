const lengthSlider = document.querySelector('[data-LengthSlider]');
const lengthDisplay = document.querySelector('[data-LengthNumber]');

const passwordDisplay = document.querySelector('[passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generate-Button');
const allCheckbox = document.querySelectorAll('input[type=checkbox]');

const symbols = '~`!@#$%^&*()_+=-<>?:":{}[];,./|';

let password ="";
let passwordLength = 10;
let checkCount = 1;

handleSlider();

setIndicator("#ccc");

function handleSlider(){
    lengthSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = lengthSlider.min;
    const max = lengthSlider.max;

    lengthSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min))+ "% 100%";
}

function setIndicator(color){
    indicator.style.background = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){

    return Math.floor( Math.random() * (max - min)) + min;

}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateSymbols(){
    const randomNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randomNum);
}

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumber = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(symbolsCheck.checked) hasSymbol = true;
    if(numbersCheck.checked) hasNumber = true;
    

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }

    else if(
       ( hasLower || hasUpper) &&
       (hasNumber || hasSymbol) &&
       passwordLength >= 6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
    
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed"; 
    }

    // adding a class to copyMsg
    copyMsg.classList.add("active");

    setTimeout(  () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i +1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange(){
    checkCount = 1;
    allCheckbox.forEach((checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    // Special Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

}


allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})

lengthSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
       copyContent();

})


generateBtn.addEventListener('click', () => {
    // none of the checkbox is selected

    if(checkCount == 0)
    return;


    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }


    // let's start the a journey to find new password

    password = "";


    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);
        
        
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    // compulsory addition
    
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    console.log('compulsory done');

    // remaining addition

    for( let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log('remaining done');
    
    // Shuffle Password
    
    password = shufflePassword(Array.from(password));
    
    
    console.log('Shuffle done');
    // Show on UI

    passwordDisplay.value = password;

    // Calculate Strength
    calStrength(); 

})
