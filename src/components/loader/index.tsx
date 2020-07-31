import React, { useState, ReactElement, useEffect } from 'react'
import RingLoader from 'react-spinners/RingLoader'
import LoaderProps from './props'
import './styles.css'

const Loader: React.FC<LoaderProps> = ({
  loading,
  children
}): ReactElement => {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    setShowLoader(loading)
  }, [loading])

  return (
    <>
      {showLoader ?
        <div className='loader'>
          {children}
          <div className='loader__screen'>
            <RingLoader size={40} color={'#B32E55'} loading={loading} />
          </div>
        </div>
        :
        <>{children}</>
      }
    </>
  )
}

export default Loader
