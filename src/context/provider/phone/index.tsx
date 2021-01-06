import React, { createContext, useContext } from 'react'
import PhoneService, {
  PhoneServiceImpl,
} from '../../../services/contact/PhoneService'
import PhoneDataModel from '../../../types/contact/api/PhoneDataModel'
import PhoneEntity from '../../../types/contact/database/PhoneEntity'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'

interface PhoneContextType
  extends SynchronizableContextType<
    number,
    PhoneDataModel,
    PhoneEntity,
    PhoneServiceImpl
  > {}

const PhoneContext = createContext<PhoneContextType>({
  service: PhoneService,
  loading: true,
  data: [],
})

const PhoneProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    PhoneDataModel,
    PhoneEntity,
    PhoneServiceImpl
  >({
    children: children,
    context: PhoneContext,
    service: PhoneService,
  })

export const usePhone = () => useContext(PhoneContext)

export default PhoneProvider
