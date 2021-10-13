const {analyzeVariableInput} = require("./analyzeVariableInput.js");

module.exports = {regroupTextInput};

function regroupTextInput(textInput, maximumTextGroupCapacity) {

    let currentTextInputCharacterGroupIndex = 0;
    let textInputCharacterGroups = [];
    let futureCharactersAsPlainText = 0;

    for (let loopTextInputCharacterIndex = 0; loopTextInputCharacterIndex < textInput.length; loopTextInputCharacterIndex++) {

        const loopTextInputCharacter = textInput[loopTextInputCharacterIndex];

        if (futureCharactersAsPlainText > 0) {

            futureCharactersAsPlainText--;

        } else if (loopTextInputCharacter == "%" && futureCharactersAsPlainText <= 0) {

            if (textInput[loopTextInputCharacterIndex + 1] == "%") {

                futureCharactersAsPlainText = 1;

            } else {

                const variableData = analyzeVariableInput(textInput.slice(loopTextInputCharacterIndex, textInput.length));

                if (textInputCharacterGroups[currentTextInputCharacterGroupIndex]) {
                    currentTextInputCharacterGroupIndex++;
                }

                textInputCharacterGroups[currentTextInputCharacterGroupIndex] = {
                    type: "variable",
                    value: textInput.slice(loopTextInputCharacterIndex, loopTextInputCharacterIndex + variableData.variable_length)
                };

                currentTextInputCharacterGroupIndex++;
                loopTextInputCharacterIndex = loopTextInputCharacterIndex + variableData.variable_length - 1;
                continue;

            }

        }

        if (textInputCharacterGroups[currentTextInputCharacterGroupIndex] && textInputCharacterGroups[currentTextInputCharacterGroupIndex].value.length >= maximumTextGroupCapacity) {

            let lastTextInputCharacterGroupInsertAmount = 0;

            for (let loopTextInputCharacterGroupCharacterIndex = 0; loopTextInputCharacterGroupCharacterIndex < textInputCharacterGroups[currentTextInputCharacterGroupIndex].value.length; loopTextInputCharacterGroupCharacterIndex++) {

                if (textInputCharacterGroups[currentTextInputCharacterGroupIndex].value[loopTextInputCharacterGroupCharacterIndex] == "%") {
                    lastTextInputCharacterGroupInsertAmount++;
                }

            }

            if (Math.floor(lastTextInputCharacterGroupInsertAmount / 2) == (lastTextInputCharacterGroupInsertAmount / 2)) {
                currentTextInputCharacterGroupIndex++;
            }
    
        }

        textInputCharacterGroups[currentTextInputCharacterGroupIndex] = {
            type: "text",
            value: (textInputCharacterGroups[currentTextInputCharacterGroupIndex] ? textInputCharacterGroups[currentTextInputCharacterGroupIndex].value + loopTextInputCharacter : loopTextInputCharacter)
        };
        
    }

    return textInputCharacterGroups;

}