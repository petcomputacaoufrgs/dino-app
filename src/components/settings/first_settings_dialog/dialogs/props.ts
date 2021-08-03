import { ChangeEvent } from "react"
import ColorThemeEnum from "../../../../types/enum/ColorThemeEnum"
import TreatmentEntity from "../../../../types/treatment/database/TreatmentEntity"

export interface FirstSettingsDialogsProps {
  id: string,
	title: string,
	component: () => JSX.Element
}

export default interface FirstSettingsDialogProps {
  step: number,
  onCloseDialogs: () =>  void,
  onNextStep: () =>  void,
  onBackStep: () =>  void,
  onSave: () =>  void,
  onCancel: () =>  void,
  treatments: TreatmentEntity[],
  selectedTreatment?: TreatmentEntity,
  onSelectedTreatmentChange: (
		newSelectedTreatment: TreatmentEntity,
	) => void,
  selectedColorTheme: ColorThemeEnum,
  onSelectedColorThemeChange: (newColorTheme: number) => void,
  selectedLanguage: number,
	onSelectedLanguageChange: (newLanguage: number) => void,
  selectedFontSize: number,
  onSelectedFontSizeChange: (newFontSize: number) => void,
  selectedEssentialContactGrant: boolean,
  onEssentialContactGrantChange: (
		includeEssentialContact: boolean,
	) => void,
  parentsAreaPassword: string,
  onChangeConfirmPassword: (event: ChangeEvent<HTMLInputElement>) => void,
  confirmParentsAreaPassword: string,
  onChangePassword: (event: ChangeEvent<HTMLInputElement>) => void,
  passwordErrorMessage?: string,
  onPasswordErrorMessageChange: (value?: string) => void,
  onDoneChange: (value: boolean) => void
}

