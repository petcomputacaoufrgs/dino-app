import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import './styles.css'

const SelectTime: React.FC = () => {
    const language = useLanguage()
    const [initialHour, setInitialHour] = useState<string>()
    const [initialMinute, setInitialMinute] = useState<string>()
    const [finalHour, setFinalHour] = useState<string>()
    const [finalMinute, setFinalMinute] = useState<string>()

    const hourList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    const minuteList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '41', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

    return (
        <div className='time__selector'>
            <div>
                <InputLabel shrink>
                    {language.data.EVENT_INIT_TIME_LABEL}
                </InputLabel> 
                <div className='both_time__selector'>
                    <div className='individual_time__selector'>
                        <Select
                            displayEmpty={true}
                            renderValue={() => initialHour? initialHour : 'HH'}
                            onChange={e => setInitialHour(e.target.value as string)}
                        >
                            {hourList.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className='individual_time__selector'>
                        <Select
                            displayEmpty={true}
                            renderValue={() => initialMinute? initialMinute : 'MM'}
                            onChange={e => setInitialMinute(e.target.value as string)}
                        >
                            {minuteList.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>

            <div>
                <InputLabel shrink>
                    {language.data.EVENT_END_TIME_LABEL}
                </InputLabel> 
                <div className='both_time__selector'>
                    <div className='individual_time__selector'>
                        <Select
                            displayEmpty={true}
                            renderValue={() => finalHour? finalHour : 'HH'}
                            onChange={e => setFinalHour(e.target.value as string)}
                        >
                            {hourList.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className='individual_time__selector'>
                        <Select
                            displayEmpty={true}
                            renderValue={() => finalMinute? finalMinute : 'MM'}
                            onChange={e => setFinalMinute(e.target.value as string)}
                        >
                            {minuteList.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectTime