import type {MessageInterface} from '../Chat';
import type {JSX} from 'react';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';
import Markdown from '@/components/ui/Markdown';
import { COLORS } from '@/theme';

const useStyles = createUseStyles({
	markdown: {
		'& *': {
			fontSize: 'revert',
			fontWeight: 'revert',
			padding: 'revert',
			lineHeight: '1.375rem',
			margin: 'revert',
			listStyleType: 'revert',
			color: 'revert',
			textDecoration: 'revert'
		},
		'& code': {
			whiteSpace: 'break-spaces',
			maxWidth: '100%',
			wordBreak: 'break-word',
			background: 'transparent !important',
			fontSize: '14px'
		},
		'& p': {
			wordBreak: 'break-word'
		},
		'& ul': {
			all: 'revert',
			margin: 0,
			padding: 0,
			listStyle: 'inside'
		},
		'& h2': {
			fontWeight: 'bold'
		},
		'& table': {
			whiteSpace: 'nowrap',
			display: 'block',
			overflow: 'scroll',
			borderRadius: '2px',
			scrollbarWidth: 'thin',
			scrollbarColor: '#e8e8e8 transparent',
			'&:hover': {
				scrollbarColor: 'gray transparent'
			},
			'& th, & td': {
				paddingInline: '10px',
				textAlign: 'start'
			},
			'& th': {
				padding: '10px'
			},
			'& tr:last-child td': {
				paddingBottom: '10px'
			},
			'& thead': {
				border: '1px solid lightgray',
				borderBottom: 'none',
				borderRadius: '3px 3px 0 0',
				padding: '10px'
			},
			'& tbody': {
				border: '1px solid lightgray',
				borderTop: 'none',
				borderRadius: '0 0 3px 3px',
				padding: '10px'
			}
		}
	},
	wrapper: {
		width: '100%',
		textAlign: 'start',
		display: 'flex',
		color: COLORS.primaryText,
		paddingBlock: '20px',
	},
	customerWrapper: {
		justifyContent: 'end',
		paddingTop: '0rem',
	},
	agentName: {
		display: 'flex',
		fontSize: '14px',
		alignItems: 'center',
		fontWeight: '500',
		color: COLORS.darkGrey,
	},
	agentNameInitial: {
		backgroundColor: COLORS.darkGrey,
		color: 'white',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '26px',
		height: '26px',
		lineHeight: '100%',
		borderRadius: '6.5px',
		marginInlineEnd: '8px',
	},
	messageWrapper: {
		minWidth: 'min(50%, 384px)',
		maxWidth: 'min(80%, 384px)',
		// border: '1px solid #e8e8e8',
		borderRadius: '12px',
		lineHeight: '1.35rem',
		padding: '10px',
		position: 'relative',
		margin: '10px',
		marginInline: '20px',
		background: COLORS.backgroundLight,
		color: COLORS.primaryText,
		'& .message-metadata': {
			transform: 'translateY(-100%)',
			position: 'absolute',
			top: '-8px',
			left: '3px',
			display: 'flex',
			justifyContent: 'space-between',
			color: COLORS.primaryText,
			width: 'calc(100% - 10px)',
			fontSize: '0.85rem',
		},
	},
	messageTime: {
		color: COLORS.mutedText,
	},
	customerMessageWrapper: {
		// background: '#4a90e2',
		// color: 'white',
	},
});

const timeAgo = (date: Date): string => {
	const dateObj = new Date(date);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours < 24) return dateObj.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: false});
	return dateObj.toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false});
};

interface MessageProps {
	message: MessageInterface;
	agentName?: string;
	agentAvatar?: JSX.Element;
	className?: string;
}

const Message = ({message, agentName, agentAvatar, className}: MessageProps): JSX.Element => {
	const classes = useStyles();
	const isCustomerMessage = message?.source === 'customer';

	const messageContent = (message.data as {message?: string})?.message || '';
	const userName = agentName || (message?.data as any)?.participant?.display_name;
	const formattedUserName = userName === '<guest>' ? 'Guest' : userName;

	return (
		<div className={clsx(classes.wrapper, isCustomerMessage && classes.customerWrapper)}>
			<div className={clsx(classes.messageWrapper, isCustomerMessage && classes.customerMessageWrapper, className)}>
				{!isCustomerMessage &&
				<div className="message-metadata">
					<div className={classes.agentName}>
						 {agentAvatar || <div className={classes.agentNameInitial}>{formattedUserName?.[0]?.toUpperCase()}</div>}
						{formattedUserName}
					</div>
					{/* <div className={classes.messageTime}>{timeAgo(new Date(message?.creationUtc))}</div> */}
				</div>}
				<Markdown className={classes.markdown}>{messageContent}</Markdown>
			</div>
		</div>
	);
};

export default Message;
