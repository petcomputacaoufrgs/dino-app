import { AppBar, Tab, Tabs, useTheme } from '@material-ui/core'
import React from 'react'
import SwipeableViews from 'react-swipeable-views';
import DinoTabPanelProps, { TabPanelProps } from './props'

function getProps(index: number) {
	return {
	  id: `full-width-tab-${index}`,
	  'aria-controls': `full-width-tabpanel-${index}`,
	};
 }

 const DinoTabPanel = ({ valueTab, setValueTab, panels }: DinoTabPanelProps) => { 

  const theme = useTheme()

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValueTab(newValue)
   }
  
   const handleChangeIndex = (index: number) => {
    setValueTab(index)
   }

  const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
        >
        {value === index && (
          children
        )}
      </div>
	  )
 }

  return (
    <div >
      <AppBar position="static" color="default">
        <Tabs
          value={valueTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs"
        >
          {panels.map((e, index) => <Tab key={index} label={e.name} {...getProps(index)} />)}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={valueTab}
        onChangeIndex={handleChangeIndex}
      >
        {panels.map((e, index) => 
          <TabPanel key={index} value={index} index={index} dir={theme.direction}>
            {e.Component}
          </TabPanel>
        )}
      </SwipeableViews>
    </div>
    )
  }

  export default DinoTabPanel