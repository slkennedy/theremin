import { 
    calculateFrequency, 
    calculateSoundGain 
} from "./setSound";

import { 
    setColors,
    findFrequencyPercentage,
    calculateLightValue 
} from "./setColors";

var context = getAudioContext();

function getAudioContext() {
    if("AudioContext" in window) {
        return new AudioContext();
    } else if("webkitAudioContext" in window) {
        return new webkitAudioContext();
    }
}

if(isTouchDevice()) {
    document.body.addEventListener("touchstart", downEvent);
    document.body.addEventListener("touchend", upEvent);
    document.body.addEventListener("touchmove", moveEvent);
} else {
    document.body.addEventListener("mousedown", downEvent);
    document.body.addEventListener("mouseup", upEvent);
    document.body.addEventListener("mousemove", moveEvent);
}

var mousedown = false,
    oscillator = null,
    gainNode = context.createGain();

function isTouchDevice() {
    return (("ontouchstart" in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
}

function downEvent(event) {
    mousedown = true;
    oscillator = context.createOscillator();

    var gain = calculateSoundGain(getY(event)),
        lightValue = calculateLightValue(getY(event)),   
        frequencyPercentage = findFrequencyPercentage(oscillator.frequency.value); 
    

    oscillator.frequency.setTargetAtTime(calculateFrequency(getX(event)), context.currentTime, 0.01);
    oscillator.connect(gainNode);
    
    gainNode.connect(context.destination);
    gainNode.gain.setTargetAtTime(gain, context.currentTime, 0.01);
    
    oscillator.start(context.currentTime);
    
    setColors(frequencyPercentage, lightValue);   
}

function upEvent() {
    if(oscillator) {
        mousedown = false;
        oscillator.stop(context.currentTime);
        oscillator.disconnect();
    } 
}

function moveEvent(event) {
    event.preventDefault();
    if(mousedown) {
        var gain = calculateSoundGain(getY(event)),
            lightValue = calculateLightValue(getY(event)),
            frequencyPercentage = findFrequencyPercentage(oscillator.frequency.value);    
        
        oscillator.frequency.setTargetAtTime(calculateFrequency(getX(event)), context.currentTime, 0.01);
        
        gainNode.gain.setTargetAtTime(gain, context.currentTime, 0.01); 
        
        setColors(frequencyPercentage, lightValue);           
    }
}


function getX(event) {
    return event.pageX;
}

function getY(event) {
    return event.pageY;
}

