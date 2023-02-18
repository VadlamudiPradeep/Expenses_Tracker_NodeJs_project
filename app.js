var num1Element = document.getElementById('numb1');
var num2Element = document.getElementById('numb2');
var buttonElement = document.querySelector('button');
var numResults = [];
var textResult = [];
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + '' + num2;
    }
    return +num1 + +num2;
}
function printResult(resultObj) {
    console.log(resultObj.val);
}
buttonElement.addEventListener('click', function () {
    var num1 = num1Element.value;
    var num2 = num2Element.value;
    var result = add(+num1, +num2);
    numResults.push(result);
    var stringResults = add(num1, num2);
    textResult.push(stringResults);
    printResult({ val: result, timestamp: new Date() });
    console.log(numResults, textResult);
});
