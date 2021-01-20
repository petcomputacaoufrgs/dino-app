import React, { useState, useEffect } from 'react'
import GoogleGrantDialogProps from './props'
import { Dialog, Button } from '@material-ui/core'
import TransitionSlide from '../slide_transition'
import AuthService from '../../services/auth/AuthService'
import GrantStatusConstants from '../../constants/login/GrantStatusConstants'
import { useAlert } from '../../context/alert'
import { useLanguage } from '../../context/language'
import { DinoDialogContent, DinoDialogHeader } from '../dino_dialog'
import UserEntity from '../../types/user/database/UserEntity'
import UserService from '../../services/user/UserService'
import Loader from '../loader'
import './styles.css'

const GoogleGrantDialog = React.forwardRef<JSX.Element, GoogleGrantDialogProps>(
	({ scopes, title, text, open, onDecline, onAccept, onClose }, ref) => {
		const alert = useAlert()

		const [isLoading, setIsLoading] = useState(true)
		const [user, setUser] = useState<UserEntity | undefined>()

		useEffect(() => {
			const loadData = async () => {
				const user = await UserService.getFirst()

				if (user) {
					updateData(user)
				}

				finishLoading()
			}

			let updateData = (user: UserEntity) => {
				setUser(user)
			}

			let finishLoading = () => {
				setIsLoading(false)
			}

			UserService.addUpdateEventListenner(loadData)

			if (isLoading) {
				loadData()
			}

			return () => {
				updateData = () => {}
				finishLoading = () => {}
				UserService.removeUpdateEventListenner(loadData)
			}
		}, [isLoading])

		const language = useLanguage()

		const [refreshNecessary, setRefreshNecessary] = useState(false)

		const handleAcceptClick = async () => {
			if (user) {
				const [response] = await AuthService.requestGoogleGrant(
					scopes,
					refreshNecessary,
					user.email,
				)

				setRefreshNecessary(false)

				if (response === GrantStatusConstants.SUCCESS) {
					alert.showSuccessAlert(language.data.GRANT_FAIL_BY_EXTERNAL_SUCCESS)
					onAccept()
				} else if (response === GrantStatusConstants.EXTERNAL_SERVICE_ERROR) {
					alert.showErrorAlert(language.data.GRANT_FAIL_BY_EXTERNAL_ERROR)
				} else if (response === GrantStatusConstants.REQUEST_CANCELED) {
					alert.showInfoAlert(language.data.GRANT_CANCELED)
				} else if (response === GrantStatusConstants.INVALID_ACCOUNT) {
					alert.showInfoAlert(language.data.GRANT_FAIL_BY_INVALID_ACCOUNT)
				} else if (response === GrantStatusConstants.REFRESH_TOKEN_NECESSARY) {
					setRefreshNecessary(true)
					alert.showInfoAlert(language.data.GRANT_RESFRESH_TOKEN_NECESSARY)
				} else if (response === GrantStatusConstants.DISCONNECTED) {
					alert.showErrorAlert(language.data.GRANT_FAIL_BY_DISCONNECTION)
					onClose()
				} else if (response === GrantStatusConstants.UNKNOW_API_ERROR) {
					alert.showErrorAlert(language.data.GRANT_FAIL_BY_UNKNOW_ERROR)
				}
			}
		}

		const handleDecline = async () => {
			alert.showInfoAlert(language.data.GRANT_DECLINED)
			onDecline()
		}

		return (
			<Dialog
				className='google_grant_dialog'
				ref={ref}
				fullWidth
				maxWidth='xs'
				onClose={onClose}
				TransitionComponent={TransitionSlide}
				open={open}
			>
				<Loader isLoading={isLoading}>
					<DinoDialogHeader>
						<h1>{title}</h1>
					</DinoDialogHeader>
					<DinoDialogContent>
						<p>{text}</p>
					</DinoDialogContent>
					<div className='google_grant_dialog__buttons'>
						<Button onClick={handleDecline}>
							{language.data.DIALOG_DECLINE_BUTTON_TEXT}
						</Button>
						<Button
							autoFocus
							onClick={handleAcceptClick}
							className='google_grant_dialog__buttons__accept_button'
						>
							{language.data.DIALOG_AGREE_TEXT}
						</Button>
					</div>
				</Loader>
			</Dialog>
		)
	},
)

export default GoogleGrantDialog
