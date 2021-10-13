const {regroupTextInput} = require("./regroupTextInput.js");
const {splitTextInput} = require("./splitTextInput.js");

module.exports = {reformatScriptGroupChildren};

function reformatScriptGroupChildren(scriptChildrenData, obfuscateData) {

    let scriptChildrenLineSplitByVariables = scriptChildrenData.full_script;

    for (let loopScriptChildrenLineVariableIndex = 0; loopScriptChildrenLineVariableIndex < Math.floor((scriptChildrenLineSplitByVariables.length - 1) / 2); loopScriptChildrenLineVariableIndex++) {

        const loopGroupChildrenLineVariableIndexInList = ((loopScriptChildrenLineVariableIndex * 2) + 1);
        const loopGroupChildrenLineVariable = scriptChildrenLineSplitByVariables[loopGroupChildrenLineVariableIndexInList];

        if (obfuscateData.obfuscated_namespace[loopGroupChildrenLineVariable]) {

            scriptChildrenLineSplitByVariables[loopGroupChildrenLineVariableIndexInList] = obfuscateData.obfuscated_namespace[loopGroupChildrenLineVariable].full;

        } else {

            const globalVariableNameSplit = regroupTextInput(loopGroupChildrenLineVariable, 3);
            let globalVariableNameSplitFinal = [];

            for (let loopGlobalVariableNameSplitIndex = 0; loopGlobalVariableNameSplitIndex < globalVariableNameSplit.length; loopGlobalVariableNameSplitIndex++) {

                const loopGlobalVariableNameSplit = globalVariableNameSplit[loopGlobalVariableNameSplitIndex];

                if (loopGlobalVariableNameSplit.type == "text") {
                    globalVariableNameSplitFinal.push("%{_" + obfuscateData.obfuscated_text_group[loopGlobalVariableNameSplit.value] + "}%")
                } else {
                    globalVariableNameSplitFinal.push(loopGlobalVariableNameSplit.value);
                }

            }

            scriptChildrenLineSplitByVariables[loopGroupChildrenLineVariableIndexInList] = globalVariableNameSplitFinal.join("");

        }

    }

    const afterVariableObfuscationScriptChildrenLine = scriptChildrenLineSplitByVariables.join("");
    let scriptChildrenLineTextInputSplit = splitTextInput(afterVariableObfuscationScriptChildrenLine);

    for (let loopScriptChildrenLineCharacterInputIndex = 0; loopScriptChildrenLineCharacterInputIndex < Math.floor(scriptChildrenLineTextInputSplit.length / 2); loopScriptChildrenLineCharacterInputIndex++) {

        const loopScriptChildrenLineCharacterInputFullIndex = (loopScriptChildrenLineCharacterInputIndex * 2 + 1);
        const loopScriptChildrenLineCharacterInput = scriptChildrenLineTextInputSplit[loopScriptChildrenLineCharacterInputFullIndex];
        const textInputData = regroupTextInput(loopScriptChildrenLineCharacterInput, 3);

        let loopScriptChildrenLineCharacterInputObfuscatedGroups = [];

        for (let loopTextInputDataIndex = 0; loopTextInputDataIndex < textInputData.length; loopTextInputDataIndex++) {

            const loopTextInputData = textInputData[loopTextInputDataIndex];

            if (loopTextInputData.type == "text") {
                loopScriptChildrenLineCharacterInputObfuscatedGroups.push("%{_" + obfuscateData.obfuscated_text_group[loopTextInputData.value] + "}%");
            } else {
                loopScriptChildrenLineCharacterInputObfuscatedGroups.push(loopTextInputData.value);
            }

        }

        scriptChildrenLineTextInputSplit[loopScriptChildrenLineCharacterInputFullIndex] = loopScriptChildrenLineCharacterInputObfuscatedGroups.join("");

    }

    return scriptChildrenLineTextInputSplit.join("");

}