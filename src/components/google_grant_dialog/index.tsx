import React, { useState, useEffect } from 'react'
import GoogleGrantDialogProps from './props'
import { Dialog, Button } from '@material-ui/core'
import TransitionSlide from '../slide_transition'
import AuthService from '../../services/auth/AuthService'
import GrantStatusConstants from '../../constants/login/GrantStatusConstants'
import { useAlert } from '../../context/alert'
import { useLanguage } from '../../context/language'
import { DinoDialogContent, DinoDialogHeader } from '../dialogs/dino_dialog'
import UserEntity from '../../types/user/database/UserEntity'
import UserService from '../../services/user/UserService'
import DinoLoader from '../loader'
import ConnectionService from '../../services/connection/ConnectionService'
import './styles.css'
import { HasStaffPowers } from '../../context/private_router'

const GoogleGrantDialog = React.forwardRef<JSX.Element, GoogleGrantDialogProps>(
	({ scopes, title, text, open, onDecline, onAccept, onClose }, ref) => {
		const alert = useAlert()
		const isStaff = HasStaffPowers()

		const [isLoading, setIsLoading] = useState(true)
		const [user, setUser] = useState<UserEntity | undefined>()
		const [isConnected, setIsConnected] = useState<boolean>(true)

		useEffect(() => {
			const loadData = async () => {
				const user = await UserService.getFirst()
				const isConnected = ConnectionService.isConnected()

				if (user) {
					updateData(user, isConnected)
				}

				finishLoading()
			}

			const updateConnectionState = () => {
				setIsConnected(ConnectionService.isConnected())
			}

			let updateData = (user: UserEntity, isConnected: boolean) => {
				setUser(user)
				setIsConnected(isConnected)
			}

			let finishLoading = () => {
				setIsLoading(false)
			}

			UserService.addUpdateEventListenner(loadData)
			ConnectionService.addEventListener(updateConnectionState)

			if (isLoading) {
				loadData()
			}

			return () => {
				updateData = () => {}
				finishLoading = () => {}
				UserService.removeUpdateEventListenner(loadData)
				ConnectionService.removeEventListener(updateConnectionState)
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

		const renderDialogContent = (): JSX.Element => (
			<>
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
			</>
		)

		const renderOfflineContent = (): JSX.Element => (
			<>
				<DinoDialogHeader>
					<h1>Sem conexão</h1>
				</DinoDialogHeader>
				<DinoDialogContent>
					{/* TODO: traduzir */}
					<p>Para que possamos fazer a sincronização com os contatos é necessário uma conexão com uma rede de internet.</p>
					<p>Tente novamente quando estiver conectado.</p>
				</DinoDialogContent>
			</>
		)

		return (
			<Dialog
				className='google_grant_dialog'
				ref={ref}
				fullWidth
				maxWidth='xs'
				onClose={onClose}
				TransitionComponent={TransitionSlide}
				open={open && !isStaff}
			>
				<DinoLoader isLoading={isLoading}>
					{isConnected 
						?	renderDialogContent()
						: renderOfflineContent()
					}
					
				</DinoLoader>
			</Dialog>
		)
	},
)

export default GoogleGrantDialog
