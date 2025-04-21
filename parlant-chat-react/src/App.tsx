import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import type {JSX, ReactElement} from 'react';
import {ChevronDown} from 'lucide-react';
import Chat from './components/chat/chat';
import type {MessageInterface} from './components/chat/chat';
import {Button} from './components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from './components/ui/popover';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';
import ParlantLogo from './assets/parlant-logo.png';

import WebFont from 'webfontloader';

const loadFonts = () => {
	WebFont.load({
		google: {
			families: ['Inter:400,500,600,700'],
		},
	});
};

const useStyles = createUseStyles({
	root: {
		fontFamily: 'Inter',
		'& .fixed-scroll': {
			scrollbarWidth: 'thin',
			scrollbarColor: '#ebecf0 transparent',
		},
	},
	popupButton: {
		backgroundColor: '#151515',
		border: 'none',
		outline: '0 !important',
		borderRadius: '50%',
		minWidth: 'fit-content',
		height: '50px',
		width: '50px',
		padding: '10px',
		margin: '10px',
	},
	iconComponent: {
		minWidth: '30px',
		minHeight: '30px',
		userSelect: 'none',
	},
	chatWrapper: {
		width: '27.75rem',
		boxShadow: '0px 8px 36px 0px #0000001A',
		transition: 'width 0.3s ease-in-out',
		background: '#FBFBFB',
		borderRadius: '20px',
		padding: '0',
	},
	expandedChatWrapper: {
		width: '60rem',
		maxWidth: '90vw',
	}
});

interface MessageComponentProps {
	message: MessageInterface;
	className?: string;
}

interface PopupButtonComponentProps {
	toggleChatOpen: () => void;
}

export interface ChatProps {
	route: string;
	sessionId: string;
	agentName?: string;
	chatDescription?: string;
	asPopup?: boolean;
	changeIsExpanded?: () => void;
	popupButton?: JSX.Element;
	sendIcon?: JSX.Element;
	classNames?: {
		chatbox?: string;
		messagesArea?: string;
		agentMessage?: string;
		customerMessage?: string;
		textarea?: string;
		defaultPopupButton?: string;
		defaultPopupButtonIcon?: string;
	};
	components?: {
		popupButton?: (props: PopupButtonComponentProps) => ReactElement;
		agentMessage?: (props: MessageComponentProps) => ReactElement;
		customerMessage?: (props: MessageComponentProps) => ReactElement;
		header?: () => ReactElement;
	};
}

const queryClient = new QueryClient();

const Chatbot = ({route, sessionId, agentName, chatDescription, asPopup = false, popupButton, components, sendIcon, classNames}: ChatProps): JSX.Element => {
	const classes = useStyles();
	
	const [open, setOpen] = useState<boolean>(false);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const IconComponent = open ? ChevronDown : () => <img src={ParlantLogo} alt="Parlant Message"  height={30} width={30} style={{objectFit: 'contain', userSelect: 'none', pointerEvents: 'none'}}/>;

	useEffect(() => {
		loadFonts();
	}, []);

	const toggleChat = (): void => {
		setOpen((prevState) => !prevState);
	};

	const PopupButtonComponent = components?.popupButton && <components.popupButton toggleChatOpen={toggleChat} />;

	return (
		<QueryClientProvider client={queryClient}>
			<span className={classes.root}>
				{asPopup ? (
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<div>
								{PopupButtonComponent || (
									<Button onClick={toggleChat} className={clsx(classes.popupButton, classNames?.defaultPopupButton)}>
										{popupButton || <IconComponent size={30} color="white" className={clsx(classes.iconComponent, classNames?.defaultPopupButtonIcon)} />}
									</Button>
								)}
							</div>
						</PopoverTrigger>
						<PopoverContent className={clsx(classes.chatWrapper, isExpanded && classes.expandedChatWrapper)} side="top" align="end" sideOffset={10}>
							<Chat route={route} asPopup={asPopup} sessionId={sessionId} agentName={agentName} chatDescription={chatDescription} classNames={classNames} components={components} sendIcon={sendIcon} changeIsExpanded={() => setIsExpanded(!isExpanded)} />
						</PopoverContent>
					</Popover>
				) : (
					<div className={clsx(classes.chatWrapper, isExpanded && classes.expandedChatWrapper)}>
						<Chat route={route} sessionId={sessionId} agentName={agentName} chatDescription={chatDescription} classNames={classNames} components={components} sendIcon={sendIcon} changeIsExpanded={() => setIsExpanded(!isExpanded)} />
					</div>
				)}
			</span>
		</QueryClientProvider>
	);
};

export default Chatbot;
