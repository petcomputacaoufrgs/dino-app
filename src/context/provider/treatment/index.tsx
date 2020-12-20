import React, { createContext, useContext } from 'react'
import SynchronizableContextType from '../synchronizable/context'
import SynchronizableProvider from '../synchronizable'
import TreatmentDataModel from '../../../types/treatment/api/TreatmentDataModel'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import { TreatmentRepositoryImpl } from '../../../storage/database/treatment/TreatmentRepository'
import TreatmentService, { TreatmentServiceImpl } from '../../../services/treatment/TreatmentService'

export interface TreatmentContextType
  extends SynchronizableContextType<
    number,
    number,
    TreatmentDataModel,
    TreatmentEntity,
    TreatmentRepositoryImpl,
    TreatmentServiceImpl
  > {}

const TreatmentContext = createContext<TreatmentContextType>({
  service: TreatmentService,
  loading: true,
  data: [],
})

const TreatmentProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    number,
    TreatmentDataModel,
    TreatmentEntity,
    TreatmentRepositoryImpl,
    TreatmentServiceImpl
  >({
    children: children,
    context: TreatmentContext,
    service: TreatmentService,
  })

export const useTreatment = () => useContext(TreatmentContext)

export default TreatmentProvider
