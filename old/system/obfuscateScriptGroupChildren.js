const {regroupTextInput} = require("./regroupTextInput.js");
const {splitTextInput} = require("./splitTextInput.js");

module.exports = {obfuscateScriptGroupChildren};

function obfuscateScriptGroupChildren(scriptChildrenLine) {

    const scriptChildrenLineTextInputSplit = splitTextInput(scriptChildrenLine); // text surrounded
    let scriptChildrenLineVariableSplitRaw = [];

    for (let loopScriptChildrenLineTextInputSplitIndex = 0; loopScriptChildrenLineTextInputSplitIndex < scriptChildrenLineTextInputSplit.length; loopScriptChildrenLineTextInputSplitIndex++) {

        const loopScriptChildrenLineTextInputSplit = scriptChildrenLineTextInputSplit[loopScriptChildrenLineTextInputSplitIndex];

        if (Math.floor((loopScriptChildrenLineTextInputSplitIndex + 1) / 2) == ((loopScriptChildrenLineTextInputSplitIndex + 1) / 2)) {

            // texts
            const textInputRegroupData = regroupTextInput(loopScriptChildrenLineTextInputSplit, 999999999999999);
            let loopTextInputRegroupProcessedGroups = [];

            for (let loopTextInputRegroupDataIndex = 0; loopTextInputRegroupDataIndex < textInputRegroupData.length; loopTextInputRegroupDataIndex++) {
                const loopTextInputRegroupData = textInputRegroupData[loopTextInputRegroupDataIndex];

                if (loopTextInputRegroupData.type == "variable") {
                    loopTextInputRegroupProcessedGroups = loopTextInputRegroupProcessedGroups.concat(scriptSplitByVariables(loopTextInputRegroupData.value));
                } else {
                    loopTextInputRegroupProcessedGroups.push(loopTextInputRegroupData);
                }
            }

            scriptChildrenLineVariableSplitRaw = scriptChildrenLineVariableSplitRaw.concat(loopTextInputRegroupProcessedGroups);

        } else {
            // non-text (scripts)
            scriptChildrenLineVariableSplitRaw = scriptChildrenLineVariableSplitRaw.concat(scriptSplitByVariables(loopScriptChildrenLineTextInputSplit));
        }

    }

    let scriptChildrenLineVariableSplit = [], scriptChildrenLineVariables = [], lastLoopScriptChildrenLineVariableSplitRawType = "variable";

    for (let loopScriptChildrenLineVariableSplitRawIndex = 0; loopScriptChildrenLineVariableSplitRawIndex < scriptChildrenLineVariableSplitRaw.length; loopScriptChildrenLineVariableSplitRawIndex++) {

        const loopScriptChildrenLineVariableSplitRaw = scriptChildrenLineVariableSplitRaw[loopScriptChildrenLineVariableSplitRawIndex];

        if (loopScriptChildrenLineVariableSplitRaw.type == "variable") {
            scriptChildrenLineVariables.push(loopScriptChildrenLineVariableSplitRaw.value);
        }

        if (lastLoopScriptChildrenLineVariableSplitRawType == loopScriptChildrenLineVariableSplitRaw.type && lastLoopScriptChildrenLineVariableSplitRawType == "text") {
            scriptChildrenLineVariableSplit[scriptChildrenLineVariableSplit.length - 1] = (scriptChildrenLineVariableSplit[scriptChildrenLineVariableSplit.length - 1] ? scriptChildrenLineVariableSplit[scriptChildrenLineVariableSplit.length - 1] + loopScriptChildrenLineVariableSplitRaw.value : loopScriptChildrenLineVariableSplitRaw.value);
        } else {
            scriptChildrenLineVariableSplit.push(loopScriptChildrenLineVariableSplitRaw.value);
        }

        lastLoopScriptChildrenLineVariableSplitRawType = loopScriptChildrenLineVariableSplitRaw.type;

    }

    let scriptChildrenLineTextInputGroups = [];

    for (let loopScriptChildrenLineCharacterInputIndex = 0; loopScriptChildrenLineCharacterInputIndex < Math.floor(scriptChildrenLineTextInputSplit.length / 2); loopScriptChildrenLineCharacterInputIndex++) {

        const loopScriptChildrenLineCharacterInputFullIndex = (loopScriptChildrenLineCharacterInputIndex * 2 + 1);
        const loopScriptChildrenLineCharacterInput = scriptChildrenLineTextInputSplit[loopScriptChildrenLineCharacterInputFullIndex];
        const textInputData = regroupTextInput(loopScriptChildrenLineCharacterInput, 3);

        for (let loopTextInputDataIndex = 0; loopTextInputDataIndex < textInputData.length; loopTextInputDataIndex++) {
            const loopTextInputData = textInputData[loopTextInputDataIndex];

            if (loopTextInputData.type == "text") {
                scriptChildrenLineTextInputGroups.push(loopTextInputData.value);
            }
        }

    }

    return {
        full_script: scriptChildrenLineVariableSplit,
        variables: scriptChildrenLineVariables,
        text_groups: scriptChildrenLineTextInputGroups
    };

}

function scriptSplitByVariables(script) {

    const validVariables = script.matchAll(/{([^@]?\w+)(?:}|::)/g);
    let scriptVariableSplit = [];
    scriptLastAppendIndex = 0;

    for (const loopValidVariable of validVariables) {

        if (scriptLastAppendIndex < loopValidVariable.index) {
            scriptVariableSplit.push({
                type: "text",
                value: script.slice(scriptLastAppendIndex, loopValidVariable.index + 1)
            });
        }

        const nextIndex = (loopValidVariable.index + loopValidVariable[1].length + 1);
        scriptVariableSplit.push({
            type: "variable",
            value: script.slice(loopValidVariable.index + 1, nextIndex)
        });
        scriptLastAppendIndex = nextIndex;

    }

    scriptVariableSplit.push({
        type: "text",
        value: script.slice(scriptLastAppendIndex, script.length)
    });

    return scriptVariableSplit;

}