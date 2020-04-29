import React from 'react'
import ProviderLoaderProps from './props'
import LanguageProvider from '../language_provider'
import AlertProvider from '../alert_provider/index';

const ProviderLoader = (props: ProviderLoaderProps):JSX.Element => (
    <LanguageProvider>
        <AlertProvider>
            {props.children}
        </AlertProvider>
    </LanguageProvider>
)

export default ProviderLoader