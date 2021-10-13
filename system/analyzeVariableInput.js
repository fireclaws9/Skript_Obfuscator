module.exports = {analyzeVariableInput};

//console.log(analyzeVariableInput(scriptInput))

function analyzeVariableInput(scriptInput) {

    let insertStage = 0; stageVariableStatus = [];

    for (let loopScriptInputCharacterIndex = 0; loopScriptInputCharacterIndex < scriptInput.length; loopScriptInputCharacterIndex++) {

        const loopScriptInputCharacter = scriptInput[loopScriptInputCharacterIndex];

        if (loopScriptInputCharacterIndex == 0) {
            insertStage++;
            continue;
        }

        if (loopScriptInputCharacter == "}") {
            stageVariableStatus[insertStage]--;
        } else if (loopScriptInputCharacter == "{") {
            stageVariableStatus[insertStage] = (stageVariableStatus[insertStage] ? stageVariableStatus[insertStage] + 1 : 1);
        } else if (loopScriptInputCharacter == "%") {

            if (stageVariableStatus[insertStage] && stageVariableStatus[insertStage] > 0) {
                insertStage++;
            } else {
                insertStage--;

                if (insertStage <= 0) {
                    return {
                        variable_length: loopScriptInputCharacterIndex + 1
                    };
                }
            }
            
        }

    }

}