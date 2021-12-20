const {analyzeTextInput} = require("./analyzeTextInput.js");

module.exports = {splitTextInput};

function splitTextInput(scriptLine) {

    let lastScriptChildrenLineCharacterIndex = 0, scriptChildrenLineTextInputSplit = [];

    for (let loopScriptChildrenLineCharacterIndex = 0; loopScriptChildrenLineCharacterIndex < scriptLine.length; loopScriptChildrenLineCharacterIndex++) {

        const loopScriptChildrenLineCharacter = scriptLine[loopScriptChildrenLineCharacterIndex];

        if (loopScriptChildrenLineCharacter == "\"") {

            if (lastScriptChildrenLineCharacterIndex < loopScriptChildrenLineCharacterIndex) {
                scriptChildrenLineTextInputSplit.push(scriptLine.slice(lastScriptChildrenLineCharacterIndex, loopScriptChildrenLineCharacterIndex + 1));
            }

            const textInputData = analyzeTextInput(scriptLine.slice(loopScriptChildrenLineCharacterIndex, scriptLine.length));

            scriptChildrenLineTextInputSplit.push(scriptLine.slice(loopScriptChildrenLineCharacterIndex + 1, loopScriptChildrenLineCharacterIndex + textInputData.input_length - 1));
            lastScriptChildrenLineCharacterIndex = loopScriptChildrenLineCharacterIndex + textInputData.input_length - 1;
            loopScriptChildrenLineCharacterIndex = loopScriptChildrenLineCharacterIndex + textInputData.input_length - 1;

        }

    }

    if (lastScriptChildrenLineCharacterIndex < scriptLine.length) {
        scriptChildrenLineTextInputSplit.push(scriptLine.slice(lastScriptChildrenLineCharacterIndex, scriptLine.length));
    }

    return scriptChildrenLineTextInputSplit;

}