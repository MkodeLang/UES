let UES = (expression) => {
    
}

class uesOperator {
    constructor (value, type) {
        this.opValue = value;
        this.opType = (type)?'Number':'Operator';
    }
}

let simpleExpression = (expression) => {
    var opList = [], store = '', expLength = expression.length;
    var opStartChars = ['+','-','*','/','%'/*,'>','<','=','@','|','&','~','!'*/];
    for (i = 0; i < expLength; i++) {
        if (opStartChars.includes(expression[i])) {
            opList.push(new uesOperator(store, true));
            opList.push(new uesOperator(expression[i], false));
            store = '';
        } else {
            store += expression[i];
        }
    }
    opList.push(new uesOperator(store, true));
    return opList;
}

let solveUesExpression = (opArray) => {
    var opArrayLength = opArray.length;
    for (i = 1; i < opArrayLength; i++) {
        
    }
}

console.log(solveUesExpression(simpleExpression('50*7/2+3-1%52')));