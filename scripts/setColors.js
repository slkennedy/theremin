import { FREQ, GAIN, COLOR_RANGE } from "./constants";


export function setColors(hue, light) {
    setBackgroundColor(hue, light);
    setHeadingColor(hue, light);
}

export function calculateLightValue(mouseYPosition) {
    return 1 - ((mouseYPosition / window.innerHeight) * GAIN.max);
}

export function findFrequencyPercentage(freq) {
    var freqRange = FREQ.max - FREQ.min;
    return (freq / freqRange);
}


function setBackgroundColor(huePercent, lightPercent) {
    var hue = Math.min(360, Math.round(COLOR_RANGE * huePercent)), 
        light = (70 * lightPercent) + 10, 
        backgroundColor = "hsla(" + hue + ", 50%, " + light + "%, 1)";

    document.body.style.backgroundColor = backgroundColor;
}

function setHeadingColor(huePercent, lightPercent) {
    var heading = document.getElementById("heading"),
        hue = Math.min(360, Math.round(COLOR_RANGE * huePercent)),
        hueOpposite = (hue + 180) % 360,
        lightOpposite = (70 * lightPercent) + 10,
        headingColor = "hsla(" + hueOpposite + ", 50%, " + lightOpposite + "%, 1)";

    if(lightPercent < 0.50) {
        heading.style.backgroundColor = "hsla(0, 100%, 100%, 0.75)";
    } else {
        heading.style.backgroundColor = "hsla(0, 0%, 0%, 0.75)";
    }

    heading.style.color = headingColor;
}

