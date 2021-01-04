import React, { createContext, useContext } from 'react'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'
import GoogleScopeDataModel from '../../../types/auth/google/api/GoogleScopeDataModel'
import GoogleScopeEntity from '../../../types/auth/google/database/GoogleScopeEntity'
import { GoogleScopeRepositoryImpl } from '../../../storage/database/auth/GoogleScopeRepository'
import GoogleScopeService, {
  GoogleScopeServiceImpl,
} from '../../../services/auth/google/GoogleScopeService'

export interface GoogleScopeContextType
  extends SynchronizableContextType<
    number,
    GoogleScopeDataModel,
    GoogleScopeEntity,
    GoogleScopeRepositoryImpl,
    GoogleScopeServiceImpl
  > {}

const GoogleScopeContext = createContext<GoogleScopeContextType>({
  service: GoogleScopeService,
  loading: true,
  data: [],
})

const GoogleScopeProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    GoogleScopeDataModel,
    GoogleScopeEntity,
    GoogleScopeRepositoryImpl,
    GoogleScopeServiceImpl
  >({
    children: children,
    context: GoogleScopeContext,
    service: GoogleScopeService,
  })

export const useGoogleScope = () => useContext(GoogleScopeContext)

export default GoogleScopeProvider
