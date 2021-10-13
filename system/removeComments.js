module.exports = {removeComments};

function removeComments(scriptLines) {

    for (let loopScriptLineIndex = 0; loopScriptLineIndex < scriptLines.length; loopScriptLineIndex++) {

        const loopScriptLine = scriptLines[loopScriptLineIndex];
        let lastFoundScriptCharacterIndex = -1;

        for (let loopScriptLineCharacterIndex = 0; loopScriptLineCharacterIndex < loopScriptLine.length; loopScriptLineCharacterIndex++) {

            if (loopScriptLine[loopScriptLineCharacterIndex] == "#") {

                if (loopScriptLine[loopScriptLineCharacterIndex + 1] == "#") {
                    lastFoundScriptCharacterIndex = loopScriptLineCharacterIndex + 1;
                    loopScriptLineCharacterIndex++;
                } else {
                    scriptLines[loopScriptLineIndex] = loopScriptLine.slice(0, lastFoundScriptCharacterIndex + 1);
                    loopScriptLineCharacterIndex = loopScriptLine.length; // exit
                }

            } else if (loopScriptLine[loopScriptLineCharacterIndex].match(/^[^ \t]$/)) {

                lastFoundScriptCharacterIndex = loopScriptLineCharacterIndex;

            }

        }

    }

    return scriptLines;

}