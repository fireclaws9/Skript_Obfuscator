module.exports = {analyzeTextInput};

function analyzeTextInput(scriptInput) {

    if (scriptInput[0] == "\"") {

        for (let loopScriptCharacterUntilQuoteEndIndex = 1; loopScriptCharacterUntilQuoteEndIndex < scriptInput.length; loopScriptCharacterUntilQuoteEndIndex++) {

            if (scriptInput[loopScriptCharacterUntilQuoteEndIndex] != "\"") {
                continue;
            }

            if (scriptInput[loopScriptCharacterUntilQuoteEndIndex + 1] != "\"") {
                return {
                    input_length: (loopScriptCharacterUntilQuoteEndIndex + 1)
                };
            } else {
                loopScriptCharacterUntilQuoteEndIndex++;
            }

        }

    }

}