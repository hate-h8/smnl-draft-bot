// This class defines how the draft timer logic
let pickTimer = null;
let warningTimer = null;

const PICK_TIME = 7200000; // 2hrs in milliseconds
const WARNING_TIME = 1800000 // 30mins in milliseconds

/**
 * Starts the timers for current drafter
 * @param {any} channel - discord channel
 * @param {function} getCurrentDrafter - current drafter
 * @param {function} onExpire - function used when current drafter is to be skipped
 */
function startTimer(channel, getCurrentDrafter, onExpire) {
    stopTimer();
    const currentDrafter = getCurrentDrafter();
    // start turn
    channel.send(`<@${currentDrafter}> is on the clock ${PICK_TIME/60000} mins`);

    // warning
    warningTimer = setTimeout(() => {
        channel.send(`<@${currentDrafter}> ${WARNING_TIME/60000} mins remaining to make your pick.`);
    }, PICK_TIME - WARNING_TIME);

    // ran out of time
    pickTimer = setTimeout(() => {
        channel.send(`<@${currentDrafter}> ran out of time`);
        onExpire();
    }, PICK_TIME);
}

/**
 * Stops the timers
 */
function stopTimer() {
    if (pickTimer) clearTimeout(pickTimer);
    if (warningTimer) clearTimeout(warningTimer);
}

module.exports = {
    startTimer,
    stopTimer
};