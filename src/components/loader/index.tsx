import React, { useState, ReactElement, useEffect } from 'react'
import RingLoader from 'react-spinners/RingLoader'
import LoaderProps from './props'
import './styles.css'

const Loader: React.FC<LoaderProps> = ({ loading, children, className }): ReactElement => {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    setShowLoader(loading)
  }, [loading])

  const getClassName = (): string => {
    let mainClass = 'loader__screen'

    if (className) {
      mainClass = mainClass.concat(' ').concat(className)
    }

    return mainClass
  }

  return (
    <>
      {showLoader ? (
        <div className="loader">
          {children}
          <div className={getClassName()}>
            <RingLoader size={40} color={'#B32E55'} loading={loading} />
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

export default Loader
