var context = new AudioContext(),
    mousedown = false,
    oscillator = null,
    maxFreq = 2000, 
    minFreq = 60, 
    gainNode = context.createGain(),
    frequencyPercentage,
    gain,
    minGain, 
    maxGain;

var expInterpolate = function(n, min, max) {
    return Math.exp(n * Math.log(max / min)) * min;
};

var calculateFrequency = function(mouseXPosition) {
    return expInterpolate(mouseXPosition / window.innerWidth, minFreq, maxFreq);
};

var calculateSoundGain = function(mouseYPosition) {
    minGain = 0.01,
    maxGain = 1;
    return expInterpolate(1 - (mouseYPosition / window.innerHeight), minGain, maxGain);
};

var calculateVisualGain = function(mouseYPosition) {
    minGain = 0,
    maxGain = 1;
    return 1 - ((mouseYPosition / window.innerHeight) * maxGain) + minGain;
}

function findFrequencyPercentage(freq) {
    var freqRange = maxFreq - minFreq;
    return (freq / freqRange);
}

function setColors(percentForBackgroundColor, percentForBackgroundLight, percentForHeadingColor) {
    var colorRange = 360,
        hue = Math.min(360, Math.round(colorRange * percentForBackgroundColor)),
        light = (70 * percentForBackgroundLight) + 10,
        color = "hsla(" + hue + ", 50%, " + light + "%, 1)",
        oppositeHue = (hue + 180) % 360,
        oppositeLight = (70 * percentForHeadingColor) + 10,
        oppositeColor = "hsla(" + oppositeHue + ", 50%, " + oppositeLight + "%, 1",
        heading = document.getElementById("heading");

        if(percentForBackgroundLight < 0.20) {
            heading.style.backgroundColor = "hsla(0, 100%, 100%, 0.85)";
        } else {
            heading.style.backgroundColor = "hsla(0, 0%, 0%, 0.65)";
        }

    document.body.style.backgroundColor = color;
    document.getElementById("heading").style.color = oppositeColor;
}

document.body.addEventListener("mousedown", function(e) {
    mousedown = true;
    oscillator = context.createOscillator();
    gain = calculateSoundGain(e.clientY);
    visualGain = calculateVisualGain(e.clientY);    
    frequencyPercentage = findFrequencyPercentage(oscillator.frequency.value); 

    oscillator.frequency.setTargetAtTime(calculateFrequency(e.clientX), context.currentTime, 0.01);
    oscillator.connect(gainNode);
    
    gainNode.connect(context.destination);
    gainNode.gain.setTargetAtTime(gain, context.currentTime, 0.01);
    
    oscillator.start(context.currentTime);
    
    setColors(frequencyPercentage, gain, visualGain);           
});

document.body.addEventListener("mouseup", function() {
    if(oscillator) {
        mousedown = false;
        oscillator.stop(context.currentTime);
        oscillator.disconnect();
    }
});

document.body.addEventListener("mousemove", function(e) {
    if(mousedown) {
        gain = calculateSoundGain(e.clientY);
        visualGain = calculateVisualGain(e.clientY);
        frequencyPercentage = findFrequencyPercentage(oscillator.frequency.value);    
        
        oscillator.frequency.setTargetAtTime(calculateFrequency(e.clientX), context.currentTime, 0.01);
        
        gainNode.gain.setTargetAtTime(gain, context.currentTime, 0.01); 
        
        setColors(frequencyPercentage, gain, visualGain);           
    }
});