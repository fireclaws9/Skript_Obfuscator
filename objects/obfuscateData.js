const {regroupTextInput} = require("../system/regroupTextInput");

class ObfuscateData {

    constructor() {

        this.used_namespace = {};
        this.obfuscate_prefix = "";

        this.obfuscated_text_group_variable_namespaces = {

            data: newNamespace(16, this),
            process_loop_id: newNamespace(16, this),
            process_loop_value: newNamespace(16, this)

        };

        this.registered_namespace = [];
        this.obfuscated_namespace = {};
        this.registered_text_group = [];
        this.obfuscated_text_group = {};
        this.obfuscated_text_group_all = [];
    }

    obfuscateRegisteredNamespaces() {

        this.obfuscated_namespace = {};

        for (let loopRegisteredNamespaceIndex = 0; loopRegisteredNamespaceIndex < this.registered_namespace.length; loopRegisteredNamespaceIndex++) {

            const loopRegisteredNamespace = this.registered_namespace[loopRegisteredNamespaceIndex];
            const registeredNamespaceTypeMatch = loopRegisteredNamespace.match(/^(.)(\w*)$/);

            if (registeredNamespaceTypeMatch[1].match(/[^_]/)) {

                const globalVariableNameSplit = regroupTextInput(loopRegisteredNamespace, 3);

                for (let loopGlobalVariableNameSplitIndex = 0; loopGlobalVariableNameSplitIndex < globalVariableNameSplit.length; loopGlobalVariableNameSplitIndex++) {

                    const loopGlobalVariableNameSplit = globalVariableNameSplit[loopGlobalVariableNameSplitIndex];

                    if (loopGlobalVariableNameSplit.type == "text") {
                        this.registered_text_group.push(loopGlobalVariableNameSplit.value);
                    }

                }

            } else {

                let randomObfuscatedNamespace = newNamespace(16, this);

                this.obfuscated_namespace[loopRegisteredNamespace] = {

                    id: this.obfuscate_prefix + randomObfuscatedNamespace,
                    full: registeredNamespaceTypeMatch[1] + this.obfuscate_prefix + randomObfuscatedNamespace

                };

            }

        }

        this.obfuscated_text_group = {};
        let processedTextGroupNamespaces = [];

        for (let loopRegisteredTextGroupIndex = 0; loopRegisteredTextGroupIndex < this.registered_text_group.length; loopRegisteredTextGroupIndex++) {

            const loopRegisteredNamespace = this.registered_text_group[loopRegisteredTextGroupIndex];

            if (processedTextGroupNamespaces[loopRegisteredNamespace] == true) {
                continue;
            }

            let randomNamespace = newNamespace(16, this);

            processedTextGroupNamespaces[loopRegisteredNamespace] = true;
            this.obfuscated_text_group[loopRegisteredNamespace] = randomNamespace;
            this.obfuscated_text_group_all.push({

                namespace: randomNamespace,
                value: loopRegisteredNamespace
                
            });

        }

    }

}


function newNamespace(length, obfuscateData) {

    let selectedNamespace = randomString(length);

    while (obfuscateData.used_namespace[selectedNamespace] == true) {
        selectedNamespace = randomString(length)
    }

    obfuscateData.used_namespace[selectedNamespace] = true;

    return selectedNamespace;

}

function randomString(length) {

    const availableCharacters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let chosenCharacters = [];

    for (let loopCharacterIndex = 0; loopCharacterIndex < length; loopCharacterIndex++) {
        chosenCharacters.push(availableCharacters[Math.floor(Math.random() * availableCharacters.length)]);
    }

    return chosenCharacters.join("");

}

module.exports = {ObfuscateData};