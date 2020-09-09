import React, { forwardRef, useState, useEffect } from 'react'
import { Dialog, Divider, DialogContent, DialogActions, Button } from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import NoteColumnDialogProps from './props'
import NoteColumnDialogHeader from './header'
import NoteColumnService from '../../../../services/note/NoteColumnService'
import NoteColumnEditError from '../../../../error/NoteColumnEditError'
import { useLanguage } from '../../../../context_provider/app_settings'
import NoteColumnDialogContent from './content'
import NoteColumnConstants from '../../../../constants/NoteColumnConstants'

const NoteColumnDialog = forwardRef(
    (props: NoteColumnDialogProps, ref: React.Ref<JSX.Element>): JSX.Element => {
        const language = useLanguage().current

        const [newTitle, setNewTitle] = useState<string>(props.column ? props.column.title : '')
        const [invalidTitle, setInvalidTitle] = useState<boolean>(false)

        useEffect(() => {
            setNewTitle(props.column ? props.column.title : '')
            setInvalidTitle(false)
        }, [props.open, props.column])

        const handleSave = () => {
            if (!isTitleValid(newTitle)) {
                setInvalidTitle(true)
                return
            } else {
                setInvalidTitle(false)
            }

            if (props.column) {
                if (props.column.title !== newTitle) {
                    props.column.title = newTitle
                    props.onSave(props.column)
                } else {
                    props.onClose()
                }
            } else if (props.order !== undefined) {
                const newColumn = NoteColumnService.createNewNoteColumnView(newTitle, props.order)
                props.onSave(newColumn)
            } else {
                throw new NoteColumnEditError()
            }
        }

        const handleTitleChange = (newTitle: string) => {
            if (invalidTitle && isTitleValid(newTitle)) {
                setInvalidTitle(false)
            }
            
            setNewTitle(newTitle.substring(0, NoteColumnConstants.TITLE_MAX))
        }

        const isTitleValid = (title: string): boolean => (
            title.length >= NoteColumnConstants.TITLE_MIN
        )

        return (
            <Dialog
                ref={ref}
                open={props.open}
                fullWidth
                onClose={props.onClose}
                TransitionComponent={TransitionSlide}
            >
                <NoteColumnDialogHeader
                    editing={Boolean(props.column)}
                />
                <Divider />
                <DialogContent>
                    <NoteColumnDialogContent
                        title={newTitle}
                        onTitleChange={handleTitleChange}
                        invalidTitle={invalidTitle}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.onClose}
                        color="primary"
                    >
                        {language.DIALOG_CANCEL_BUTTON_TEXT}
                    </Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                    >
                        {language.DIALOG_SAVE_BUTTON_TEXT}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
)

export default NoteColumnDialog
