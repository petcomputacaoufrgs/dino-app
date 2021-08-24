export interface TouchSlideProps {
    key: string
}

let xDown: number | null = null
let yDown: number | null = null
let TouchSlideType: TouchSlideProps

const setTouchSlideType = (event: string) => {
    TouchSlideType.key = event
}

// Activated when an user touches the screen
window.addEventListener(
    'touchstart',
    evt => {
        const firstTouch = evt.touches[0]

        xDown = firstTouch.clientX
        yDown = firstTouch.clientY
    },
    false,
)

// Activated when an user moves the finger along the screen
window.addEventListener(
    'touchmove',
    evt => {
        if (!xDown || !yDown) {
            return
        }

        let xUp = evt.touches[0].clientX
        let yUp = evt.touches[0].clientY

        // Get the most significant movement
        if (Math.abs(xDown - xUp) < Math.abs(yDown - yUp)) {
            // Up swipe
            if (yDown - yUp > 0) {
                setTouchSlideType('SlideUp')
                // Down swipe
            } else {
                setTouchSlideType('SlideDown')
            }
        } else {
            // Left swipe
            if (xDown - xUp > 0) {
                setTouchSlideType('SlideLeft')
                // Right swipe
            } else {
                setTouchSlideType('SlideRight')
            }
        }

        // Reset values
        xDown = null
        yDown = null
    },
    false,
)

