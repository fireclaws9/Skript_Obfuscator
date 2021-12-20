module.exports = {shuffleArray};

function shuffleArray(arrayObject) {

    for (let loopArrayObjectIndex = 0; loopArrayObjectIndex < arrayObject.length; loopArrayObjectIndex++) {

        const loopArrayObjectReverseIndex = arrayObject.length - loopArrayObjectIndex - 1;
        const randomArrayObjectIndex = Math.floor(Math.random() * loopArrayObjectReverseIndex);

        [arrayObject[loopArrayObjectReverseIndex], arrayObject[randomArrayObjectIndex]] = [arrayObject[randomArrayObjectIndex], arrayObject[loopArrayObjectReverseIndex]];

    }

    return arrayObject;

}