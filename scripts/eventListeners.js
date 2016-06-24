export function setupListeners(downEvent, upEvent, moveEvent) {
    if(isTouchDevice()) {
        document.body.addEventListener("touchstart", downEvent);
        document.body.addEventListener("touchend", upEvent);
        document.body.addEventListener("touchmove", moveEvent);
    } else {
        document.body.addEventListener("mousedown", downEvent);
        document.body.addEventListener("mouseup", upEvent);
        document.body.addEventListener("mousemove", moveEvent);
    }
} 

function isTouchDevice() {
    return (("ontouchstart" in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
}