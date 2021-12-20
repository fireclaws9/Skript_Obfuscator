const {analyzeTextInput} = require("./analyzeTextInput.js");

module.exports = {obfuscateScriptGroupParent};

function obfuscateScriptGroupParent(scriptParentLine) {

    const groupParentLineParameters = scriptParentLine.match(/^(function|on|every|command|options)( |:)?/);
    let groupParentLineType, groupParentLineBaseIndention;

    switch(groupParentLineParameters[1].toUpperCase()) {

        case "FUNCTION":

            groupParentLineType = "FUNCTION";
            groupParentLineBaseIndention = 1;
            break;

        case "ON":

            groupParentLineType = "EVENT";
            groupParentLineBaseIndention = 1;
            break;

        case "EVERY":

            groupParentLineType = "EVENT";
            groupParentLineBaseIndention = 1;
            break;

        case "COMMAND":

            groupParentLineType = "COMMAND";
            groupParentLineBaseIndention = 2;
            break;

        case "OPTIONS":

            groupParentLineType = "OPTIONS";
            groupParentLineBaseIndention = 1;
            break;

        default:
            break;

    }

    if (groupParentLineType == "FUNCTION") {

        const groupParentLineFunctionParameters = scriptParentLine.match(/^function (\w+)\((.*)?\)(?: :: (\w+))?:$/);
        let inputStage = 0, inputGroups = []; // 0=VARIABLE 1=TYPE 2=DEFAULT_VALUE

        if (groupParentLineFunctionParameters[2]) {
            
            inputGroups.push(functionInputGroupExtend());

            for (let loopGroupParentLineInputCharacterIndex = 0; loopGroupParentLineInputCharacterIndex < groupParentLineFunctionParameters[2].length; loopGroupParentLineInputCharacterIndex++) {
                
                const loopGroupParentLineInputCharacter = groupParentLineFunctionParameters[2][loopGroupParentLineInputCharacterIndex];

                if (inputStage == 0 && loopGroupParentLineInputCharacter == ":") {

                    inputStage++;
                    loopGroupParentLineInputCharacterIndex++;
                    continue;

                } else if (inputStage == 1 && loopGroupParentLineInputCharacter == ",") {

                    inputStage = 0;
                    loopGroupParentLineInputCharacterIndex++;

                    inputGroups.push(functionInputGroupExtend());
                    continue;

                } else if (inputStage == 1 && loopGroupParentLineInputCharacter == "=") {

                    inputStage++;
                    loopGroupParentLineInputCharacterIndex++;

                    const previousStageRawCharactersLength = inputGroups[inputGroups.length - 1].stageRawCharacters[inputStage - 1].length;
                    inputGroups[inputGroups.length - 1].stageRawCharacters[inputStage - 1] = inputGroups[inputGroups.length - 1].stageRawCharacters[inputStage - 1].slice(0, previousStageRawCharactersLength - 1);
                    continue;

                } else if (inputStage == 2 && loopGroupParentLineInputCharacter == ",") {

                    inputStage = 0;
                    loopGroupParentLineInputCharacterIndex++;

                    inputGroups.push(functionInputGroupExtend());
                    continue;

                }

                if (loopGroupParentLineInputCharacter == "\"") {

                    const textInputData = analyzeTextInput(groupParentLineFunctionParameters[2].slice(loopGroupParentLineInputCharacterIndex, (groupParentLineFunctionParameters[2].length + 1)));

                    for (let loopTextInputLengthIndex = 0; loopTextInputLengthIndex < textInputData.input_length; loopTextInputLengthIndex++) {
                        inputGroups[inputGroups.length - 1].stageRawCharacters[inputStage].push(groupParentLineFunctionParameters[2][loopGroupParentLineInputCharacterIndex + loopTextInputLengthIndex]);
                    }

                    loopGroupParentLineInputCharacterIndex = loopGroupParentLineInputCharacterIndex + textInputData.input_length - 1;

                } else {

                    inputGroups[inputGroups.length - 1].stageRawCharacters[inputStage].push(loopGroupParentLineInputCharacter);

                }

            }

        }

        let organizedInputGroups = [];

        for (let loopInputGroupIndex = 0; loopInputGroupIndex < inputGroups.length; loopInputGroupIndex++) {

            organizedInputGroups.push({
                name: "_" + inputGroups[loopInputGroupIndex].stageRawCharacters[0].join(""),
                type: inputGroups[loopInputGroupIndex].stageRawCharacters[1].join(""),
                default: (inputGroups[loopInputGroupIndex].stageRawCharacters[2].length > 0 ? inputGroups[loopInputGroupIndex].stageRawCharacters[2].join("") : undefined)
            });

        }

        return {
            type: "FUNCTION",
            full_parameters: {

                function_name: groupParentLineFunctionParameters[1],
                function_input: groupParentLineFunctionParameters[2],
                function_return: groupParentLineFunctionParameters[3]

            },
            input: organizedInputGroups,
            base_line_indention: groupParentLineBaseIndention
        };

    } else {

        return {
            type: groupParentLineType,
            raw: scriptParentLine,
            base_line_indention: groupParentLineBaseIndention
        };

    }

}

function functionInputGroupExtend() {

    return {
        stageRawCharacters: {

            0: [],
            1: [],
            2: []

        }
    };

}