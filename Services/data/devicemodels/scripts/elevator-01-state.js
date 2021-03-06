// Copyright (c) Microsoft. All rights reserved.

/*global log*/
/*jslint node: true*/

"use strict";

var floors = 15;

// Default state
var state = {
    online: true,
    floor: 1,
    vibration: 10.0,
    vibration_unit: "mm",
    temperature: 75.0,
    temperature_unit: "F",
    moving: true
};

/**
 * Restore the global state using data from the previous iteration.
 *
 * @param previousState The output of main() from the previous iteration
 */
function restoreState(previousState) {
    // If the previous state is null, force a default state
    if (previousState !== undefined && previousState !== null) {
        state = previousState;
    } else {
        log("Using default state");
    }
}

/**
 * Simple formula generating a random value around the average
 * in between min and max
 */
function vary(avg, percentage, min, max) {
    var value =  avg * (1 + ((percentage / 100) * (2 * Math.random() - 1)));
    value = Math.max(value, min);
    value = Math.min(value, max);
    return value;
}

function varyfloor(current, min, max) {
    if (current === min) {
        return current + 1;
    }
    if (current === max) {
        return current - 1;
    }
    if (Math.random() < 0.5) {
        return current - 1;
    }
    return current + 1;
}

/**
 * Entry point function called by the simulation engine.
 *
 * @param context        The context contains current time, device model and id
 * @param previousState  The device state since the last iteration
 */
/*jslint unparam: true*/
function main(context, previousState) {

    // Restore the global state before generating the new telemetry, so that
    // the telemetry can apply changes using the previous function state.
    restoreState(previousState);

    if (state.moving) {
        state.floor = varyfloor(state.floor, 1, floors);
        // 10 +/- 5%,  Min 0, Max 20
        state.vibration = vary(10, 5, 0, 20);
    } else {
        state.vibration = 0;
    }

    // 75 +/- 1%,  Min 25, Max 100
    state.temperature = vary(75, 1, 25, 100);

    return state;
}
