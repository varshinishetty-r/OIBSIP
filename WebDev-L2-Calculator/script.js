const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

const buttons = document.querySelectorAll("button");

let expression = "";
let resultShown = false;


// Check if the value is an operator
function isOperator(value) {

    return value === "+" ||
           value === "-" ||
           value === "*" ||
           value === "/";

}


// Update expression on screen
function updateExpressionDisplay() {

    let visibleExpression = expression;

    visibleExpression = visibleExpression.replace(/\*/g, " × ");
    visibleExpression = visibleExpression.replace(/\//g, " ÷ ");
    visibleExpression = visibleExpression.replace(/\+/g, " + ");
    visibleExpression = visibleExpression.replace(/-/g, " − ");

    expressionDisplay.textContent = visibleExpression;
}


// Add numbers and decimal point
function addNumber(value) {

    if (resultShown) {

        expression = "";
        resultDisplay.textContent = "0";
        resultShown = false;
    }

    expression += value;

    updateExpressionDisplay();
}


// Add an operator
function addOperator(operator) {

    if (resultDisplay.textContent === "Error") {
        return;
    }

    if (expression === "") {
        return;
    }

    let lastCharacter =
        expression[expression.length - 1];

    if (isOperator(lastCharacter)) {

        expression =
            expression.slice(0, -1);
    }

    expression += operator;

    resultShown = false;

    updateExpressionDisplay();
}


// Calculate the result
function calculate() {

    if (expression === "") {
        return;
    }

    let lastCharacter =
        expression[expression.length - 1];

    if (isOperator(lastCharacter)) {
        return;
    }

    let numbers = [];
    let operators = [];
    let currentNumber = "";


    for (let i = 0; i < expression.length; i++) {

        let character = expression[i];

        if (isOperator(character)) {

            numbers.push(
                parseFloat(currentNumber)
            );

            operators.push(character);

            currentNumber = "";

        } else {

            currentNumber += character;
        }
    }


    numbers.push(
        parseFloat(currentNumber)
    );


    // Check for invalid numbers
    for (let i = 0; i < numbers.length; i++) {

        if (isNaN(numbers[i])) {

            showError();
            return;
        }
    }


    // Handle multiplication and division
    let newNumbers = [numbers[0]];
    let newOperators = [];


    for (let i = 0; i < operators.length; i++) {

        let operator = operators[i];
        let nextNumber = numbers[i + 1];


        if (operator === "*") {

            let previousNumber =
                newNumbers[newNumbers.length - 1];

            newNumbers[newNumbers.length - 1] =
                previousNumber * nextNumber;

        }

        else if (operator === "/") {

            if (nextNumber === 0) {

                showError();
                return;
            }

            let previousNumber =
                newNumbers[newNumbers.length - 1];

            newNumbers[newNumbers.length - 1] =
                previousNumber / nextNumber;

        }

        else {

            newOperators.push(operator);
            newNumbers.push(nextNumber);
        }
    }


    // Handle addition and subtraction
    let answer = newNumbers[0];


    for (let i = 0; i < newOperators.length; i++) {

        let operator = newOperators[i];
        let nextNumber = newNumbers[i + 1];


        if (operator === "+") {

            answer =
                answer + nextNumber;

        }

        else if (operator === "-") {

            answer =
                answer - nextNumber;
        }
    }


    answer =
        Number(answer.toFixed(10));


    updateExpressionDisplay();

    resultDisplay.textContent = answer;

    resultShown = true;
}


// Display an error
function showError() {

    resultDisplay.textContent = "Error";

    resultShown = true;
}


// Clear calculator
function clearCalculator() {

    expression = "";

    expressionDisplay.textContent = "";

    resultDisplay.textContent = "0";

    resultShown = false;
}


// Remove the last character
function backspace() {

    if (resultShown) {

        clearCalculator();
        return;
    }

    expression =
        expression.slice(0, -1);

    updateExpressionDisplay();


    if (expression === "") {

        resultDisplay.textContent = "0";
    }
}


// Add event listeners to buttons
buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        const value =
            button.getAttribute("data-value");


        if (value === "C") {

            clearCalculator();

        }

        else if (value === "backspace") {

            backspace();

        }

        else if (value === "=") {

            calculate();

        }

        else if (isOperator(value)) {

            addOperator(value);

        }

        else {

            addNumber(value);
        }

    });

});
