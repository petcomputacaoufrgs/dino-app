import React, { createContext, useContext, useEffect, useState } from 'react'
import TreatmentQuestionService from '../../services/faq/TreatmentQuestionService'
import TreatmentService from '../../services/treatment/TreatmentService'
import TreatmentView from '../../types/faq/view/TreatmentView'

/**
 * @description Contexto padrão para os dados de staff
 */
const StaffData = createContext([] as TreatmentView[])

/**
 * @description Gera os dados necessários para as rotas privadas e de login
 * @param children filho do StaffData
*/
const StaffDataProvider: React.FC = ({ children }) => {
  
  const [value, setValue] = useState([] as TreatmentView[])

	useEffect(() => {

		const loadData = async () => {
			const treatmentQuestions = await TreatmentQuestionService.getAll()

			const treatments = await TreatmentService.getAll()

			const treatmentViews = treatments.reduce((acum, t) => {
				if(t.localId) {
					acum[t.localId] = { treatment: t }
				}
				return acum
			}, [] as TreatmentView[])

			treatmentQuestions.forEach((tq) => {
				const localTreatmentId = tq.localTreatmentId
				if(localTreatmentId) {
					const treatmentView = treatmentViews[localTreatmentId]
					if(treatmentView) {
						treatmentView.questions ? treatmentView.questions.push(tq) : treatmentView.questions = [tq]
					}
				}
			})

			setValue([...treatmentViews])
		}

		loadData()

		TreatmentQuestionService.addUpdateEventListenner(loadData)
		return () => TreatmentQuestionService.removeUpdateEventListenner(loadData)

	}, [])

  return (
		<StaffData.Provider value={value}>
			{children}
		</StaffData.Provider>
	)
}

export const useStaffData = () => useContext(StaffData)

export const useTreatmentView = (treatmentLocalId?: number) => {
	const staffData = useStaffData()
	return treatmentLocalId ? staffData[treatmentLocalId] : undefined
}

export default StaffDataProvider
