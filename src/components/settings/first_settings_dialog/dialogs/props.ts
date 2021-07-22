import { ChangeEvent } from 'react'
import ColorThemeEnum from '../../../../types/enum/ColorThemeEnum'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import UserSettingsEntity from '../../../../types/user/database/UserSettingsEntity'

export interface FirstSettingsDialogsProps {
	id: string
	title?: string
	component: () => JSX.Element
}

export default interface FirstSettingsDialogProps {
	settings: UserSettingsEntity
	step: number
	onCloseDialogs: () => void
	onNextStep: () => void
	onBackStep: () => void
	onSave: () => void
	onCancel: () => void
	treatments: TreatmentEntity[]
	parentsAreaPassword: string
	onChangeConfirmPassword: (event: ChangeEvent<HTMLInputElement>) => void
	confirmParentsAreaPassword: string
	onChangePassword: (event: ChangeEvent<HTMLInputElement>) => void
	passwordErrorMessage?: string
	onPasswordErrorMessageChange: (value?: string) => void
	onDoneChange: (value: boolean) => void
}
