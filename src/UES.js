export class UES {
  UESToString (value) {
    try {
      return value.toString()
    } catch {
      if (value === null) return 'null'
      else if (value === undefined) return 'undefined'
    }
  }

  // This function recieves uncommented code and lexes it. Returns js:array
  Lexer (code) {
    const codeLength = code.length; let store = ''/* stores characters and acts as a buffer */; let doubleQuoteFlag = false; let singleQuoteFlag = false; const tokenStream = []// Array to store the tokens
    // List containing all seperators
    const opFirstChars = ['=', '+', '-', '*', '/', '%', '&', '|', '!', '~', '>', '<', ';', ':', ',', '[', ']', '{', '}', '==', '===', '!=', '!==', '++', '--', '<<', '>>', '<=>', '<=', '>=', '(', ')', '><', '**', '??']
    // for loop running through the whole "code string"
    let i
    for (i = 0; i < codeLength; i++) {
      if (singleQuoteFlag || doubleQuoteFlag) { // checks if the present character is inside a string. If it is, it ignores all the rules.
        store += code[i] // and adds the character to the storage buffer
        // The following code checks if the string has been ended
        if (singleQuoteFlag && code[i] === '\'' && code[i - 1] !== '\\') {
          if (store !== '') tokenStream.push(store)
          store = ''
          singleQuoteFlag = false
        } else if (doubleQuoteFlag && code[i] === '"' && code[i - 1] !== '\\') {
          if (store !== '') tokenStream.push(store)
          store = ''
          doubleQuoteFlag = false
        }
      } else { // if the present character is not inside string
        // The first three conditions checks if any seperators (from opFirstChars) starts at i or not (length 3-1)
        if (opFirstChars.includes(code.substring(i, i + 3))) {
          if (store !== '') tokenStream.push(store)
          store = ''
          tokenStream.push(code.substring(i, i + 3))
          i += 2
        } else if (opFirstChars.includes(code.substring(i, i + 2))) {
          if (store !== '') tokenStream.push(store)
          tokenStream.push(code.substring(i, i + 2))
          store = ''
          i++
        } else if (opFirstChars.includes(code[i])) {
          if (store !== '') tokenStream.push(store)
          store = ''
          tokenStream.push(code.substring(i, i + 1))
        } else if (code[i] === '\'' || code[i] === '"') { // Checks if new string has been started
          if (code[i] === '\'') {
            singleQuoteFlag = true

            if (store !== '') tokenStream.push(store)
            store = "'"
          } else {
            doubleQuoteFlag = true

            if (store !== '') tokenStream.push(store)
            store = '"'
          }
        } else if (code[i] === ' ' || code[i] === ' ') { // Checks for <space> or <tab> seperators
          if (store !== '') tokenStream.push(store)
          store = ''
        } else { // if no conditions apply, the present character is added to the storage buffer
          store += code[i]
        }
      }
    }
    if (store !== '') tokenStream.push(store) // Cleans the storage buffer
    return tokenStream // Returns token array
  }

  toOwnDataType (argument) {
    if (typeof argument === 'string') {
      if (argument === 'true') { return true } else if (argument === 'false') { return false } else if (argument === 'null') { return null } else if (argument === 'undefined') { return undefined } else if (argument[0] === '\'' && argument[argument.length - 1] === '\'') {
        let store = ''; let i; const argumentLength = argument.length
        for (i = 1; i < (argumentLength - 1); i++) {
          store += argument[i]
        }
        return store
      } else if (argument[0] === '"' && argument[argument.length - 1] === '"') {
        let store = ''; let i; const argumentLength = argument.length
        for (i = 1; i < (argumentLength - 1); i++) {
          if (argument[i] === '\\' && ['s', '\'', '"'].includes(argument[i + 1])) {
            if (argument[i + 1] === 's') store += '\\'
            else store += argument[i + 1]
            i++
          } else {
            store += argument[i]
          }
        }
        return store
      } else { return parseFloat(argument) }
    } else { return argument }
  }

  evaluateOp (argument1, operator, argument2) {
    argument1 = this.toOwnDataType(argument1)
    argument2 = this.toOwnDataType(argument2)
    switch (operator) {
      case '><': // Concatation Operator
        return this.UESToString(argument1) + this.UESToString(argument2)
      case '+': // Addition Operator
        return parseFloat(argument1) + parseFloat(argument2)
      case '-': // Subtraction Operator
        return parseFloat(argument1) - parseFloat(argument2)
      case '*': // Multiplication Operator
        return parseFloat(argument1) * parseFloat(argument2)
      case '/': // Division Operator
        return parseFloat(argument1) / parseFloat(argument2)
      case '%': // Modulo Operator
        return parseFloat(argument1) % parseFloat(argument2)
      case '>': // Greater Than Operator
        return parseFloat(argument1) > parseFloat(argument2)
      case '<': // Less Than Operator
        return parseFloat(argument1) < parseFloat(argument2)
      case '>=': // Greater Than or Equal To Operator
        return parseFloat(argument1) >= parseFloat(argument2)
      case '<=': // Less Than or Equal To Operator
        return parseFloat(argument1) <= parseFloat(argument2)
      case '<=>': // Spaceship Operator
        if (argument1 > argument2) return 1
        else if (argument1 < argument2) return -1
        else if (argument1 === argument2) return 0
        else return 2
      case '>>': // Bitwise right-shift Operator
        return parseInt(argument1) >> parseInt(argument2)
      case '<<': // Bitwise left-shift Operator
        return parseInt(argument1) << parseInt(argument2)
      case '>>>': // Unsigned right-shift Operator
        return parseInt(argument1) >>> parseInt(argument2)
      case '==': // Equal to Operator
        return argument1 == argument2
      case '!=': // Not Equal to Operator
        return argument1 != argument2
      case '===': // Strict Equal Operator
        return argument1 === argument2
      case '!==': // Strict Not Equal Operator
        return argument1 !== argument2
      case '&&': // Logical AND Operator
        return argument1 && argument2
      case '||': // Logical OR Operator
        return argument1 || argument2
      case '&':// Bitwise AND Operator
        return argument1 & argument2
      case '|': // Bitwise OR Operator
        return argument1 | argument2
      case '**': // Exponentiation Operator
        return argument1 ** argument2
      case '??': // Nullish coalescing Operator
        return argument1 ?? argument2
      default : // Exception Handeling
        console.log('operator = ' + operator)
        throw new Error('Unexpected Character')
    }
  }

  getFirstPrecedence (precedenceValue, operators) {
    const opPrecedence = [['**'], ['*', '/', '%'], ['+', '-', '><'], ['<<', '>>', '>>>'], ['<', '<=', '>', '>='], ['==', '!=', '===', '!=='], ['<=>'], ['&'], ['^'], ['|'], ['&&'], ['||'], ['??']]
    const opPrecedenceLength = opPrecedence[precedenceValue].length
    let index = Infinity; let i
    for (i = 0; i < opPrecedenceLength; i++) {
      if (operators.includes(opPrecedence[precedenceValue][i])) {
        if (operators.indexOf(opPrecedence[precedenceValue][i]) < index) index = operators.indexOf(opPrecedence[precedenceValue][i])
      }
    }
    return index
  }

  solveUesExpression (opArray) {
    let precedence
    for (precedence = 0; precedence < 13; precedence++) {
      while (true) {
        const opAt = this.getFirstPrecedence(precedence, opArray)
        if (opAt === Infinity) break
        const operator = opArray[opAt]
        const argument1 = opArray[opAt - 1]
        const argument2 = opArray[opAt + 1]
        opArray.splice(opAt - 1, 3)
        opArray.splice(opAt - 1, 0, this.evaluateOp(argument1, operator, argument2))
      }
    }
    return opArray
  }
}
