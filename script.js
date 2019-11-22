const userInput = document.querySelector(".user-input");
const result = document.querySelector(".result");
const inputBtns = document.querySelectorAll("[data-value]");
const evalBtn = document.getElementById("eval");
const clearBtn = document.getElementById("clear");
const backspaceBtn = document.getElementById("backspace");

// basic functions to operate on two numbers
function addition(a, b) {
    return Number(a) + Number(b);
}

function subtract(a, b) {
    return Number(a) - Number(b);
}

function multiply(a, b) {
    return Number(a) * Number(b);
}

function divide(a, b) {
    return Number(a) / Number(b);
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

// validate whether certain input should be added to the expression
function validateInput(value) {
    const reverseExpression = userInput.textContent.split("").reverse();

    if (value === ".") {
        const lastNum = reverseExpression.join("").split(/[-+x÷]/)[0];
        if (lastNum.includes(".")) {
            return false;
        }
    } else if (value === "÷" || value === "x" || value === "-" || value === "+") {
        if (!reverseExpression[0].match(/\d/)) {
            return false;
        }
    }
    return true;
}

// add the user input to expression it's been successfully validated
function populateDisplay(type, value) {
    if (type === "input") {
        if (validateInput(value)) {
            userInput.textContent += value;
        }
    } else if (type === "result") {
        result.textContent = value;
    }
}

// reset both input and result to empty string
function clearDisplay() {
    userInput.textContent = "";
    result.textContent = "";
}

// remove last character from expression
function clearCharacter() {
    let str = userInput.textContent;
    str = str.substr(0, str.length - 1);
    userInput.textContent = `${str}`;
}

// evaluate expression
function evaluate() {
    // split user input on operators to get numbers array
    let numbers = userInput.textContent.split(/[-+x÷]/);
    // match operator values to get operators array
    let operators = userInput.textContent.match(/[-+x÷]/g);

    // remove leading zeroes
    numbers = numbers.map(number => {
        return Number(number).toString();
    });

    // if the expression doesn't have any operators i.e. it's just a single number then return that number as result
    if (!operators) {
        return populateDisplay("result", numbers[0]);
    }

    // combine numbers and operators into expression array
    let expression = numbers;
    let i = 0;
    let j = 1;
    while (i < operators.length) {
        expression.splice(j, 0, operators[i]);
        i++;
        j = j + 2;
    }

    // throw divivde by zero error if user tries to divide by zero
    if (expression.join("").includes("÷0")) {
        return populateDisplay("result", "Can't divide by zero");
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
    return populateDisplay("result", Math.round(operationResult * 100) / 100);
}

// event listeners to populate display depending on what button was pressed
inputBtns.forEach(btn => btn.addEventListener("click", () => populateDisplay("input", btn.dataset.value)));

// evaluate expression if = button is clicked
evalBtn.addEventListener("click", evaluate);

// clear user input and result
clearBtn.addEventListener("click", clearDisplay);

// remove last character from user input
backspaceBtn.addEventListener("click", clearCharacter);

// Keyboard Event Listeners
window.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            e.preventDefault();
            populateDisplay("input", Number(e.key))
            break;

        case "+":
        case "-":
        case ".":
            e.preventDefault();
            populateDisplay("input", e.key)
            break;

        case "*":
            e.preventDefault();
            populateDisplay("input", "x")
            break;

        case "/":
            e.preventDefault();
            populateDisplay("input", "÷")
            break;

        case "=":
            e.preventDefault();
            evaluate();
            break;

        case "Backspace":
            e.preventDefault();
            if (e.shiftKey) {
                clearDisplay();
                break;
            }
            clearCharacter();
            break;

        default:
            break;
    }
});