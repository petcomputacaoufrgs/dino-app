import React, { useState } from 'react'
import DinoHr from '../../../../components/dino_hr'
import { useLanguage } from '../../../../context/language'
import CardEventProps from './props'
import { ReactComponent as RepeatSVG } from '../../../../assets/icons/general_use/repeat.svg'
import { ReactComponent as AlertSVG } from '../../../../assets/icons/general_use/add_alert.svg'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import DateUtils from '../../../../utils/DateUtils'
import './styles.css'
import { CardHeader, Dialog } from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import { getIcon } from '../../../../services/calendar/EventTypeViewService'

const CardEvent: React.FC<CardEventProps> = props => {
	const language = useLanguage()
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const EventSVGSection: React.FC<{ title: string; value?: string }> =
		props => {
			return (
				<div className='event_svg_section dino__flex_row'>
					<div className='svg__selector'>{props.children}</div>
					<div className='event_svg_section__text'>
						<p>
							{props.title}
							<span className='event_svg_section__text__value'>
								{props.value}
							</span>
						</p>
					</div>
				</div>
			)
		}

	const EventSection: React.FC<{ header: string; content?: string }> =
		props => {
			return props.content ? (
				<>
					<DinoHr />
					<div className='event_card__content__section'>
						<div className='event_card__content__section_header'>
							{props.header}
						</div>
						<div>{props.content}</div>
					</div>
				</>
			) : (
				<></>
			)
		}

	const TypeIconSVG = getIcon(props.item.type?.icon)

	return (
		<div>
			<Dialog
				fullWidth
				open={props.open}
				style={{ padding: 0 }}
				TransitionComponent={TransitionSlide}
				onBackdropClick={props.onClose}
				onClose={props.onClose}
			>
				<CardHeader
					className='event_card__header'
					style={{ backgroundColor: props.item?.type?.color }}
					action={
						<div className='event_card__icon_button'>
							<OptionsIconButton onClick={e => handleClickMenu(e)} />
						</div>
					}
					title={
						<div className='event_card__header_title'>
							{props.item.event.title}
						</div>
					}
					subheader={
						<div>
							<div>
								{DateUtils.getExtendedDateStringFormated(
									props.item.event.date,
									language.data,
								)}
							</div>
							<div>
								{DateUtils.getTimeStringFormated(
									props.item.event.date,
									props.item.event.endTime,
								)}
							</div>
						</div>
					}
				/>
				<div className='event_card__content'>
					{props.item.type && (
						<>
							<EventSVGSection title={props.item.type?.title}>
								<TypeIconSVG
									className='event_type__icon small'
									style={{ backgroundColor: props.item.type.color }}
								/>
							</EventSVGSection>
							<DinoHr />
						</>
					)}
					<EventSVGSection
						title={`${language.data.EVENT_REPEAT}: `}
						value={
							props.item?.event.repeat || language.data.EVENT_REPEAT_NOT_REPEAT
						}
					>
						<RepeatSVG />
					</EventSVGSection>
					<EventSVGSection
						title={`${language.data.EVENT_ALERT}: `}
						value={
							props.item?.event.alert || language.data.EVENT_ALERT_NOT_DEFINED
						}
					>
						<AlertSVG />
					</EventSVGSection>
					<EventSection
						header={language.data.FORM_DESCRIPTION}
						content={props.item?.event.description}
					/>
				</div>
			</Dialog>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onEdit={props.onEdit}
				onDelete={props.onDelete}
			/>
		</div>
	)
}

export default CardEvent
