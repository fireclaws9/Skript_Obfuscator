module.exports = {reformatScriptGroupParent};

function reformatScriptGroupParent(groupParentData, obfuscateData, obfuscateSettings) {

    if (groupParentData.type == "FUNCTION") {

        let obfuscatedInput = [];

        if (groupParentData.input[0]) {
            for (let loopObfuscateDataInputIndex = 0; loopObfuscateDataInputIndex < groupParentData.input.length; loopObfuscateDataInputIndex++) {

                const loopObfuscateDataInput = groupParentData.input[loopObfuscateDataInputIndex];
                const obfuscatedParameterType = (obfuscateSettings.overwrite_function_parameters_type ? anyToObject(loopObfuscateDataInput.type) : loopObfuscateDataInput.type);

                obfuscatedInput.push(obfuscateData.obfuscated_namespace[loopObfuscateDataInput.name].id + ": " + obfuscatedParameterType + (loopObfuscateDataInput.default == undefined ? "" : " = " + loopObfuscateDataInput.default));
            
            }
        }

        const rawReturn = [
            "function " + groupParentData.full_parameters.function_name,
            "(" + obfuscatedInput.join(", ") + ")",
            (groupParentData.full_parameters.function_return ? " :: " + (obfuscateSettings.overwrite_function_return_type ? anyToObject(groupParentData.full_parameters.function_return) : groupParentData.full_parameters.function_return) : "") + ":"
        ];

        return rawReturn.join("");

    } else {

        return groupParentData.raw;

    }

}

function anyToObject(objectText) {

    const oldMatchMultiple = objectText.match(/(.)$/);
    return (oldMatchMultiple[1] == "s" ? "objects" : "object");

}