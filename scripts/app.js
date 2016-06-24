import { 
    calculateFrequency, 
    calculateSoundGain 
} from "./setSound";

import { 
    setColors,
    findFrequencyPercentage,
    calculateLightValue 
} from "./setColors";

import { setupListeners } from "./eventListeners";


//Determine what AudioContext is available to use
var context = getAudioContext();

function getAudioContext() {
    if("AudioContext" in window) {
        return new window.AudioContext();
    } else if("webkitAudioContext" in window) {
        return new window.webkitAudioContext();
    }
}

//sets event listeners based on touch or non-touch device
setupListeners(downEvent, upEvent, moveEvent);

//event functions
var mousedown = false,
    oscillator = null,
    gainNode = context.createGain();

function downEvent(event) {
    mousedown = true;
    oscillator = context.createOscillator();

    var gain = calculateSoundGain(event.pageY),
        lightValue = calculateLightValue(event.pageY),   
        frequencyPercentage = findFrequencyPercentage(oscillator.frequency.value); 
    

    oscillator.frequency.setTargetAtTime(calculateFrequency(event.pageX), context.currentTime, 0.01);
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
        var gain = calculateSoundGain(event.pageY),
            lightValue = calculateLightValue(event.pageY),
            frequencyPercentage = findFrequencyPercentage(oscillator.frequency.value);    
        
        oscillator.frequency.setTargetAtTime(calculateFrequency(event.pageX), context.currentTime, 0.01);
        
        gainNode.gain.setTargetAtTime(gain, context.currentTime, 0.01); 
        
        setColors(frequencyPercentage, lightValue);           
    }
}