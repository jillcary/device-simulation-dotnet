// Copyright (c) Microsoft. All rights reserved.

/*global log*/
/*global updateState*/
/*global sleep*/
/*jslint node: true*/

"use strict";

// Default state
var state = {
    online: true,
    rideId: null,
    trainId: null,
    correlationId: null,
    accelX: 0,
    accelY: 0,
    accelZ: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    deviceTime: null,
    passengerCount: 0,
    eventType: null,
    rideStart: null
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
    var value = avg * (1 + ((percentage / 100) * (2 * Math.random() - 1)));
    value = Math.max(value, min);
    value = Math.min(value, max);
    return value;
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
    //initial state on startup
    var newRide = false;
    if (state.trainId == null) {
        state.trainId = Guid.NewGuid().ToString();
    }
    if (state.rideStart == null) {
        state.rideStart = new Date();
        newRide = true;
    }

    state.deviceTime = new Date();
    var dateDif = state.deviceTime - state.rideStart;

    state.rotX = vary(0, 10, -2, 2);
    state.rotY = vary(0, 10, -2, 2);
    state.rotZ = vary(0, 10, -2, 2);

    if (dateDif < 30000) {
        state.eventType = "rideStart";
        state.accelX = vary(1, 30, -2, 3);
        state.accelY = vary(1, 30, -2, 3);
        state.accelZ = vary(1, 30, -2, 3);
    } else if (dateDif < 60000) {
        state.eventType = "liftStart";
        state.accelX = vary(2, 30, -2, 2);
        state.accelY = vary(2, 30, -2, 2);
        state.accelZ = vary(2, 30, -2, 2);
    } else if (dateDif < 90000) {
        state.eventType = "liftEnd";
        state.accelX = vary(0, 30, -7, 7);
        state.accelY = vary(0, 30, -7, 7);
        state.accelZ = vary(0, 30, -7, 7);
    } else if (dateDif < 120000) {
        state.eventType = "photoTriggered";
        state.accelX = vary(0, 30, -7, 7);
        state.accelY = vary(0, 30, -7, 7);
        state.accelZ = vary(0, 30, -7, 7);
    } else if (dateDif < 150000) {
        state.eventType = "finalBraking";
        state.accelX = vary(0, 10, -5, 4);
        state.accelY = vary(0, 10, -5, 4);
        state.accelZ = vary(0, 10, -5, 4);
    } else if (dateDif < 180000) {
        state.eventType = "rideEnd";
        state.accelX = 0;
        state.accelY = 0;
        state.accelZ = 0;
        state.rotX = 0;
        state.rotY = 0;
        state.rotZ = 0;
    } else { // if > 3 minutes, restart ride
        state.rideStart = state.deviceTime;
        state.eventType = "rideStart";
        newRide = true;
    }

    //if it's the first ride or we are looping around, reset some variables
    if (newRide) {
        state.rideId = Guid.NewGuid().ToString();
        state.correlationId = Guid.NewGuid().ToString();
        state.passengerCount = vary(25, 10, 0, 30);
    }

    return state;
}
