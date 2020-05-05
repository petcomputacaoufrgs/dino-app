import React from 'react'
import ProviderLoaderProps from './props'
import LanguageProvider from '../language_provider'
import AlertProvider from '../alert_provider/index';
import UpdateProvider from '../update_provider';
import DatabaseProvider from '../database_provider';

const ProviderLoader = (props: ProviderLoaderProps):JSX.Element => (
    <DatabaseProvider>
        <LanguageProvider>
            <AlertProvider>
                <UpdateProvider>
                    {props.children}
                </UpdateProvider>
            </AlertProvider>
        </LanguageProvider>
    </DatabaseProvider>
)

export default ProviderLoader