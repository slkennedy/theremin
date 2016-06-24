import { FREQ, GAIN } from "./constants";

function expInterpolate(n, min, max) {
    return Math.exp(n * Math.log(max / min)) * min;
}

export function calculateFrequency(mouseXPosition) {
    return expInterpolate(mouseXPosition / window.innerWidth, FREQ.min, FREQ.max);
}

export function calculateSoundGain(mouseYPosition) {
    return expInterpolate(1 - (mouseYPosition / window.innerHeight), GAIN.min, GAIN.max);
}