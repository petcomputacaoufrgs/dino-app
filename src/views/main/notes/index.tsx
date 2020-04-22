import React from 'react'
import Example from './example'
import { DndProvider } from 'react-dnd'
import PCBackend from 'react-dnd-html5-backend'
import TouchBackend from 'react-dnd-touch-backend'
import { isMobile } from 'react-device-detect'

const Notes = () => {

    const options = {
        enableMouseEvents: true,
        scrollAngleRanges: [{ start: 30, end: 150 }, { start: 210, end: 330 }],
    }

    return (
        <DndProvider backend={isMobile ? TouchBackend : PCBackend } options={options}>
		    <Example />
	    </DndProvider>
    )

}

export default Notes