import React, { useEffect, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TreatmentService from '../../../services/treatment/TreatmentService'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import { FormControl, InputLabel, Select, Input } from '@material-ui/core'
import SelectMultipleTreatmentsProps from './props'

const SelectMultipleTreatments: React.FC<SelectMultipleTreatmentsProps> = ({ selectedIds, setSelectedIds }) => {


  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedIds(event.target.value as number[]);
  };

  const [isLoading, setIsLoading] = useState(true)
  const [treatments, setTreatments] = useState<TreatmentEntity[]>()

  useEffect(() => {
    const loadData = async () => {
      const treatments = await TreatmentService.getAll()
      setTreatments(treatments)
      finishLoading()
    }

    let finishLoading = () => {
      setIsLoading(false)
    }

    if (isLoading) {
      loadData()
    }

    return () => {
      finishLoading = () => {}
    }
  }, [isLoading])

  const renderOptions = () => {
    if(treatments && !isLoading) {
      return (
        treatments.map((t) => 
          <MenuItem key={t.name} value={t.id}>
            {t.name}
          </MenuItem>
      ))
    }
  }


  return (
      <FormControl style={{'marginTop': '6px', 'width': '100%'}}>
        <InputLabel id="demo-mutiple-name-label">Tratamentos</InputLabel>
        <Select
          labelId="demo-mutiple-name-label"
          id="demo-mutiple-name"
          multiple
          fullWidth
          value={selectedIds}
          onChange={handleChange}
          input={<Input />}
        >
          {renderOptions()}
        </Select>
      </FormControl>
  )
}

export default SelectMultipleTreatments
