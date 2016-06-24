import { 
    calculateFrequency, 
    calculateSoundGain 
} from "./setSound";

import { 
    setColors,
    findFrequencyPercentage,
    calculateLightValue 
} from "./setColors";

var context = new AudioContext(),
    mousedown = false,
    oscillator = null,
    gainNode = context.createGain();

document.body.addEventListener("mousedown", downEvent);
document.body.addEventListener("mouseup", upEvent);
document.body.addEventListener("mousemove", moveEvent);

function downEvent(e) {
    mousedown = true;
    oscillator = context.createOscillator();

    var gain = calculateSoundGain(e.clientY),
        lightValue = calculateLightValue(e.clientY),   
        frequencyPercentage = findFrequencyPercentage(oscillator.frequency.value); 
    
    
    oscillator.frequency.setTargetAtTime(calculateFrequency(e.clientX), context.currentTime, 0.01);
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

function moveEvent(e) {
    if(mousedown) {
        var gain = calculateSoundGain(e.clientY),
            lightValue = calculateLightValue(e.clientY),
            frequencyPercentage = findFrequencyPercentage(oscillator.frequency.value);    
        
        oscillator.frequency.setTargetAtTime(calculateFrequency(e.clientX), context.currentTime, 0.01);
        
        gainNode.gain.setTargetAtTime(gain, context.currentTime, 0.01); 
        
        setColors(frequencyPercentage, lightValue);           
    }
}