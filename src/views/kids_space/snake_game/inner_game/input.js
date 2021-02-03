/* --> Constants <-- */
let inputDirection = {x: 0, y: 0, d:'N'}
let lastInputDirection = {x: 0, y: 0, d:'N'}

let xDown = null;                                                        
let yDown = null;


/* --> Event Listeners <-- */
// Activated when an user touches the screen
document.addEventListener('touchstart', evt => {
    const firstTouch = evt.touches[0]

    xDown = firstTouch.clientX                                   
    yDown = firstTouch.clientY                                   
} , false)

// Activated when an user moves the finger along the screen
document.addEventListener('touchmove', evt => {
    if ( ! xDown || ! yDown ) {
        return
    }

    let xUp = evt.touches[0].clientX                                  
    let yUp = evt.touches[0].clientY

    // Get the most significant movement
    if ( Math.abs( xDown - xUp ) < Math.abs( yDown - yUp ) ) {
        // Up swipe
        if (( yDown - yUp > 0 ) && (lastInputDirection.y === 0)){
            inputDirection = {x: 0, y: -1, d:'U'}
        // Down swipe
        } else if(lastInputDirection.y === 0){
            inputDirection = {x:0, y: 1, d:'D'}
        }             
    } else {
        // Left swipe
        if ((xDown - xUp > 0) && (lastInputDirection.x === 0)) {
            inputDirection = {x: -1, y: 0, d:'L'}
        // Right swipe
        } else if(lastInputDirection.x === 0){
            inputDirection = {x: 1, y: 0, d:'R'}
        }                                                                   
    }

    // Reset values
    xDown = null;
    yDown = null;                                           
}, false)

// Activated when an user uses the keys of the keyboard
window.addEventListener('keydown', e => {
    switch(e.key) {
        case 'ArrowUp':
            if(lastInputDirection.y === 0){
                inputDirection = {x: 0, y: -1, d:'U'}
            }
            break
        case 'ArrowDown':
            if(lastInputDirection.y === 0){
                inputDirection = {x:0, y: 1, d:'D'}
            }
            break
        case 'ArrowLeft':
            if(lastInputDirection.x === 0){
                inputDirection = {x: -1, y: 0, d:'L'}
            }
            break
        case 'ArrowRight':
            if(lastInputDirection.x === 0){
                inputDirection = {x: 1, y: 0, d:'R'}
            }
            break
    }
})

/* --> Functions <-- */
// getInputDirection(): gets the head direction based on the user moves
//  output: inputDirection -> {x , y , direction } : direction of the movement
export function getInputDirection() {
    lastInputDirection = inputDirection
    return inputDirection
}