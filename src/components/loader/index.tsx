import React, { useState, ReactElement, useEffect } from 'react'
import RingLoader from 'react-spinners/RingLoader'
import LoaderProps from './props'
import './styles.css'
import StringUtils from '../../utils/StringUtils'

const DinoLoader: React.FC<LoaderProps> = ({
	isLoading: loading,
	children,
	className,
	iconClassName,
	disableBackground,
	hideChildren,
}): ReactElement => {
	const [showLoader, setShowLoader] = useState(false)

	useEffect(() => {
		setShowLoader(loading)
	}, [loading])

	const getIconClassName = (): string => {
		let className = StringUtils.concatUndefinedSafe(
			' ',
			'loader__screen',
			iconClassName,
		)

		if (disableBackground) {
			className = className.concat(' ').concat('disable_background')
		}

		if (hideChildren) {
			className = className.concat(' ').concat('hide_children')
		}

		return className
	}

	const getClassName = (): string => {
		return StringUtils.concatUndefinedSafe(' ', 'loader', className)
	}

	return (
		<>
			{showLoader ? (
				<div className={getClassName()}>
					{children}
					<div className={getIconClassName()}>
						<RingLoader size={40} color={'#B32E55'} loading={loading} />
					</div>
				</div>
			) : (
				<>{children}</>
			)}
		</>
	)
}

export default DinoLoader
