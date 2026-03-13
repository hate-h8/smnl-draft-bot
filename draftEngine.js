// This class defines the draft logic
let draftActive = false;
let draftOrder = [];
let currentPick = 0;
let CURRENT_ROUND = 1;
const TOTAL_ROUNDS = 22;

/**
 * Defines forwards draft order
 * @param {Array<string>} order - list of drafters in forwards order
 */
function setDraftOrder(order) {
    draftOrder = order;
}

/**
 * Defines snake draft logic for next drafter
 * @returns - next drafter
 */
function getCurrentDrafter() {
   const index = currentPick % draftOrder.length;
   if (CURRENT_ROUND % 2 === 1) return draftOrder[index]; // forwards order
   else return draftOrder[draftOrder.length - 1 - index]; // reverse order 
}

/**
 * Go to next pick. If end of round, go to next round
 */
function advancePick() {
    currentPick++;
    if(currentPick % draftOrder.length === 0) CURRENT_ROUND++;
}

/**
 * @returns - is draft is finished
 */
function draftFinished() {
    return CURRENT_ROUND > TOTAL_ROUNDS;
}

/**
 * @returns - draft active status
 */
function isDraftActive() {
    return draftActive;
}

/**
 * sets draft active status to true
 */
function startDraft() {
    draftActive = true;
}

/**
 * sets draft active status to false
 */
function endDraft() {
    draftActive = false;
}

module.exports = {
    setDraftOrder,
    getCurrentDrafter,
    advancePick,
    draftFinished,
    isDraftActive,
    startDraft,
    endDraft
};