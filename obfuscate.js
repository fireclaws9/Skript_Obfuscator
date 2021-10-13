/*

Only Enabled During Development

const fileSystem = require("fs");

*/

const {ObfuscateData} = require("./objects/obfuscateData.js");
const {obfuscateScriptGroupChildren} = require("./system/obfuscateScriptGroupChildren.js");
const {obfuscateScriptGroupParent} = require("./system/obfuscateScriptGroupParent.js");
const {reformatScriptGroupChildren} = require("./system/reformatScriptGroupChildren.js");
const {reformatScriptGroupParent} = require("./system/reformatScriptGroupParent.js");
const {removeComments} = require("./system/removeComments.js");
const {shuffleArray} = require("./system/shuffleArray.js");

module.exports = {obfuscateScript};

/*

Only Enabled During Development

async function obfuscateFile() {

    const scriptReaderStream = fileSystem.createReadStream("./script.txt");

    const script = await new Promise((resolve, reject) => {

        scriptReaderStream.on("data", data => {
            resolve(data.toString());
        })

    });

    const obfuscated = obfuscateScript(script);
    fileSystem.writeFileSync("./obfuscated.txt", obfuscated);

}

*/

function obfuscateScript(script) {

    const obfuscateSettings = {
        overwrite_function_prefix: "",
        avoid_overwrite: {

            variables: [],
            functions: []

        },
        overwrite_function_parameters_type: true,
        overwrite_function_return_type: true
    }

    let scriptLines = script.replace(/\r/g, "").split("\n");
    scriptLines = removeComments(scriptLines);
    let scriptTemporaryGroup = [], scriptGroup = [], obfuscatedScriptGroups = [], scriptLinesValidBegin = 0;

    for (let loopScriptLineIndex = 0; loopScriptLineIndex < scriptLines.length; loopScriptLineIndex++) {

        const loopScriptLine = scriptLines[loopScriptLineIndex];

        if (loopScriptLine != "") {
            scriptLinesValidBegin = loopScriptLineIndex;
            loopScriptLineIndex = scriptLines.length; // exit
        }

    }

    for (let loopScriptLineIndex = scriptLinesValidBegin; loopScriptLineIndex < scriptLines.length; loopScriptLineIndex++) {

        const loopScriptLine = scriptLines[loopScriptLineIndex];
        
        if (loopScriptLine.match(/^(function|on|every|command|options)( |:)?/) && scriptTemporaryGroup.length > 0) {
            scriptGroup.push(scriptTemporaryGroup);
            scriptTemporaryGroup = [];
        }

        scriptTemporaryGroup.push(loopScriptLine);

    }

    scriptGroup.push(scriptTemporaryGroup);

    for (let loopScriptGroupIndex = 0; loopScriptGroupIndex < scriptGroup.length; loopScriptGroupIndex++) {
        obfuscatedScriptGroups.push(obfuscateScriptGroup(scriptGroup[loopScriptGroupIndex], obfuscateSettings).join("\n"));
    }

    return obfuscatedScriptGroups.join("\n");

}

function obfuscateScriptGroup(scriptGroup, obfuscateSettings) {

    let newScriptGroup = [];
    const obfuscateData = new ObfuscateData();
    const groupParentData = obfuscateScriptGroupParent(scriptGroup[0], obfuscateData);

    if (groupParentData.type == "OPTIONS") {
        return scriptGroup;
    }

    if (groupParentData.input) {
        for (let loopGroupParentInputIndex = 0; loopGroupParentInputIndex < groupParentData.input.length; loopGroupParentInputIndex++) {
            obfuscateData.registered_namespace.push(groupParentData.input[loopGroupParentInputIndex].name);
        }
    }
    
    let groupChildrenData = [];

    for (let loopGroupChildrenLineIndex = 0; loopGroupChildrenLineIndex < (scriptGroup.length - 1); loopGroupChildrenLineIndex++) {

        const loopGroupChildrenLine = scriptGroup[loopGroupChildrenLineIndex + 1];
        const loopGroupChildrenData = obfuscateScriptGroupChildren(loopGroupChildrenLine);

        groupChildrenData.push(loopGroupChildrenData);

        for (let loopGroupChildrenLineVariableIndex = 0; loopGroupChildrenLineVariableIndex < loopGroupChildrenData.variables.length; loopGroupChildrenLineVariableIndex++) {
            const loopGroupChildrenLineVariable = loopGroupChildrenData.variables[loopGroupChildrenLineVariableIndex];
            obfuscateData.registered_namespace.push(loopGroupChildrenLineVariable);
        }

        for (let loopGroupChildrenLineTextGroupIndex = 0; loopGroupChildrenLineTextGroupIndex < loopGroupChildrenData.text_groups.length; loopGroupChildrenLineTextGroupIndex++) {
            const loopGroupChildrenLineTextGroup = loopGroupChildrenData.text_groups[loopGroupChildrenLineTextGroupIndex];
            obfuscateData.registered_text_group.push(loopGroupChildrenLineTextGroup);
        }

    }

    obfuscateData.obfuscate_prefix = obfuscateSettings.overwrite_function_prefix;
    obfuscateData.obfuscateRegisteredNamespaces();
    newScriptGroup.push(reformatScriptGroupParent(groupParentData, obfuscateData, obfuscateSettings));

    let insertedTextGroupLine = (obfuscateData.obfuscated_text_group_all.length > 0 ? false : true);

    for (let loopGroupChildrenLineIndex = 0; loopGroupChildrenLineIndex < (scriptGroup.length - 1); loopGroupChildrenLineIndex++) {

        const newScriptGroupChildren = reformatScriptGroupChildren(groupChildrenData[loopGroupChildrenLineIndex], obfuscateData);

        if (insertedTextGroupLine == false) {

            let newScriptGroupChildrenIndentionCount = 0;

            for (let loopNewScriptGroupChildrenCharacterIndex = 0; loopNewScriptGroupChildrenCharacterIndex < newScriptGroupChildren.length; loopNewScriptGroupChildrenCharacterIndex++) {

                const loopNewScriptGroupChildrenCharacter = newScriptGroupChildren[loopNewScriptGroupChildrenCharacterIndex];
    
                if (loopNewScriptGroupChildrenCharacter == "\t") {
                    continue;
                }
    
                newScriptGroupChildrenIndentionCount = loopNewScriptGroupChildrenCharacterIndex;
                loopNewScriptGroupChildrenCharacterIndex = newScriptGroupChildren.length;
    
            }

            if (newScriptGroupChildrenIndentionCount >= groupParentData.base_line_indention) {

                const insertTextGroupLines = getTextGroupInsertionLines(groupParentData.base_line_indention, obfuscateData);

                for (let loopInsertTextGroupLineIndex = 0; loopInsertTextGroupLineIndex < insertTextGroupLines.length; loopInsertTextGroupLineIndex++) {
                    newScriptGroup.push(insertTextGroupLines[loopInsertTextGroupLineIndex]);
                }

                insertedTextGroupLine = true;

            }

        }

        newScriptGroup.push(newScriptGroupChildren);

    }

    return newScriptGroup;

}

function getTextGroupInsertionLines(baseIndentions, obfuscateData) {

    let insertLines = [];

    const obfuscatedTextGroupShuffled = shuffleArray(obfuscateData.obfuscated_text_group_all);
    let obfuscatedTextGroupProcessed = [];

    for (let loopObfuscatedTextGroupShuffledIndex = 0; loopObfuscatedTextGroupShuffledIndex < obfuscatedTextGroupShuffled.length; loopObfuscatedTextGroupShuffledIndex++) {
        const loopObfuscatedTextGroupShuffled = obfuscatedTextGroupShuffled[loopObfuscatedTextGroupShuffledIndex];
        obfuscatedTextGroupProcessed.push("\"" + loopObfuscatedTextGroupShuffled.namespace + "\" and \"" + loopObfuscatedTextGroupShuffled.value + "\"");
    }

    insertLines.push("\t".repeat(baseIndentions) + "set {_" + obfuscateData.obfuscated_text_group_variable_namespaces.data + "::*} to " + obfuscatedTextGroupProcessed.join(" and "));
    insertLines.push("\t".repeat(baseIndentions) + "loop ((amount of {_" + obfuscateData.obfuscated_text_group_variable_namespaces.data + "::*}) / 2) times:");
    insertLines.push("\t".repeat(baseIndentions + 1) + "set {_" + obfuscateData.obfuscated_text_group_variable_namespaces.process_loop_id + "} to ((loop-number * 2) - 1)");
    insertLines.push("\t".repeat(baseIndentions + 1) + "set {_" + obfuscateData.obfuscated_text_group_variable_namespaces.process_loop_value + "} to (loop-number * 2)");
    insertLines.push("\t".repeat(baseIndentions + 1) + "set {_%{_" + obfuscateData.obfuscated_text_group_variable_namespaces.data + "::%{_" + obfuscateData.obfuscated_text_group_variable_namespaces.process_loop_id + "}%}%} to {_" + obfuscateData.obfuscated_text_group_variable_namespaces.data + "::%{_" + obfuscateData.obfuscated_text_group_variable_namespaces.process_loop_value + "}%}");

    return insertLines;

}

/*

Only Enabled During Development

console.log("\n".repeat(100));
obfuscateFile({});

*/