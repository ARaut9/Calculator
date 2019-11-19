// basic functions to operate on two numbers
function addition(a, b) {
    return +a + +b;
}

function subtract(a, b) {
    return +a - +b;
}

function multiply(a, b) {
    return +a * +b;
}

function divide(a, b) {
    // trying to divivde by zero alerts error
    if (a == "0" || b == "0") {
        alert("Can\'t Divide by Zero!");
    } else {
        return +a / +b;
    }
}

// performs correct operation based on operator and two numbers
function operate(operator, a, b) {
    if (operator == "+") {
        return addition(a, b);
    } else if (operator == "-") {
        return subtract(a, b);
    } else if (operator == "x") {
        return multiply(a, b);
    } else if (operator == "÷") {
        return divide(a, b);
    }
}

// event listeners to populate display depending on what button was pressed
const userInput = document.querySelector(".user-input");
const result = document.querySelector(".result");

let numberBtns = [];
for (let i = 0; i < 10; i++) {
    numberBtns[i] = document.getElementById(`${i}`);
    numberBtns[i].addEventListener("click", () => userInput.textContent += `${i}`);
}

const decPoint = document.getElementById("dec-point");
decPoint.addEventListener("click", () => {
    userInput.textContent += "."
});

const div = document.getElementById("div");
div.addEventListener("click", () => userInput.textContent += "÷");

const mul = document.getElementById("mul");
mul.addEventListener("click", () => userInput.textContent += "x");

const sub = document.getElementById("sub");
sub.addEventListener("click", () => userInput.textContent += "-");

const add = document.getElementById("add");
add.addEventListener("click", () => userInput.textContent += "+");

// evaluate expression if = button is clicked
const eval = document.getElementById("eval");
eval.addEventListener("click", evaluate);

function evaluate() {
    // split user input on operators to get numbers array
    let numbers = userInput.textContent.split(/[-+x÷]/);
    // match operator values to get operators array
    let operators = userInput.textContent.match(/[-+x÷]/g);

    // combine numbers and operators into expression array
    let expression = numbers;
    let i = 0;
    let j = 1;
    while (i < operators.length) {
        expression.splice(j, 0, operators[i]);
        i++;
        j = j + 2;
    }

    let operationResult = 0;
    let indexOfOperator;
    // loop until expression array only has one value i.e. result of all operations
    while (expression.includes("x") || expression.includes("÷")) {
        // iterate through expression to find multiplication and division operators and perform them
        expression.forEach(element => {
            if (element == "x" || element == "÷") {
                indexOfOperator = expression.indexOf(element);
                operationResult = operate(expression[indexOfOperator], expression[indexOfOperator - 1],
                    expression[indexOfOperator + 1]);
                // remove operator and two numbers and insert result of operation
                expression.splice(indexOfOperator - 1, 3, operationResult.toString());
            }
        });
    }

    while (expression.includes("-") || expression.includes("+")) {
        // iterate through expression to find addition and substraction operators and perform them
        expression.forEach(element => {
            if (element == "-" || element == "+") {
                indexOfOperator = expression.indexOf(element);
                operationResult = operate(expression[indexOfOperator], expression[indexOfOperator - 1],
                    expression[indexOfOperator + 1]);
                // remove operator and two numbers and insert result of operation
                expression.splice(indexOfOperator - 1, 3, operationResult.toString());
            }
        });
    }

    // round result to 2 decimal places and display
    result.textContent = `${Math.round(operationResult * 100) / 100}`;
    decPoint.disabled = false
}

// clear user input and result
const clear = document.getElementById("clear");
clear.addEventListener("click", clearDisplay);

function clearDisplay() {
    userInput.textContent = "";
    result.textContent = "";
}

// remove last character from user input
const backspace = document.getElementById("backspace");
backspace.addEventListener("click", clearCharacter);

function clearCharacter() {
    let str = userInput.textContent;
    str = str.substr(0, str.length - 1);
    userInput.textContent = `${str}`;
    decPoint.disabled = false;
}

// Keyboard Event Listeners
window.addEventListener("keydown", function (e) {
    e.preventDefault();

    if (e.key.match(/[\d-+.]/)) {
        userInput.textContent += `${e.key}`;
    } else if (e.key == "*") {
        userInput.textContent += "x";
    } else if (e.key == "/") {
        userInput.textContent += "÷";
    } else if (e.key == "=") {
        evaluate();
    } else if (e.shiftKey && e.key == "Backspace") {
        clearDisplay();
    } else if (e.key == "Backspace") {
        clearCharacter();
    }
});