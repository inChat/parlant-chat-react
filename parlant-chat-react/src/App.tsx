import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useEffect, useRef, useState} from 'react';
import type {JSX, ReactElement} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import Chat from './components/chat/Chat';
import type {MessageInterface} from './components/chat/Chat';
import {Button} from './components/ui/Button';
import {Popover, PopoverContent, PopoverTrigger} from './components/ui/Popover';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';

import WebFont from 'webfontloader';
import { COLORS } from './theme';

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
		backgroundColor: COLORS.primaryText,
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
		width: '899px',
		maxWidth: '95vw',
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
	agentAvatar?: JSX.Element;
	chatDescription?: string;
	asPopup?: boolean;
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
		chatDescription?: string;
		bottomLine?: string;
	};
	components?: {
		popupButton?: (props: PopupButtonComponentProps) => ReactElement;
		agentMessage?: (props: MessageComponentProps) => ReactElement;
		customerMessage?: (props: MessageComponentProps) => ReactElement;
		header?: ({changeIsExpanded}: {changeIsExpanded: () => void}) => ReactElement;
	};
}

const queryClient = new QueryClient();

const Chatbot = ({route, sessionId, agentName, agentAvatar, chatDescription, asPopup = false, popupButton, components, sendIcon, classNames}: ChatProps): JSX.Element => {
	const classes = useStyles();
	const popupButtonRef = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [isClosing, setIsClosing] = useState<boolean>(false);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [origin, setOrigin] = useState<string>('bottom right');
	const isOriginInBottom = origin.includes('bottom');
	const IconComponent = open ?  (isOriginInBottom ? ChevronDown : ChevronUp) : (isOriginInBottom ? ChevronUp : ChevronDown);

	const setTransformOrigin = (): void => {
		if (!popupButtonRef.current) return;
		const rect = popupButtonRef.current.getBoundingClientRect();
		const vertical = rect.top < window.innerHeight / 2 ? 'top' : 'bottom';
		const horizontal = rect.left < window.innerWidth / 2 ? 'left' : 'right';
		setOrigin(`${vertical} ${horizontal}`);
	};

	useEffect(loadFonts, []);
	useEffect(setTransformOrigin, []);

	const toggleChat = (): void => {
		if (open) {
			setIsClosing(true);
			setTimeout(() => {
				setIsClosing(false);
				setOpen(false);
			}, 0);
		} else {
			setOpen(true);
		}
	};

	const handleOnOpenChange = (open: boolean): void => {
		setOpen(open);
		setIsExpanded(false);
	};

	const PopupButtonComponent = components?.popupButton && <components.popupButton toggleChatOpen={toggleChat} />;

	return (
		<QueryClientProvider client={queryClient}>
			<span className={classes.root}>
				{asPopup ? (
					<Popover open={open || isClosing} onOpenChange={handleOnOpenChange}>
						<PopoverTrigger ref={popupButtonRef} asChild>
							<div>
								{PopupButtonComponent || (
									<Button onClick={toggleChat} className={clsx(classes.popupButton, classNames?.defaultPopupButton)}>
										{popupButton || <IconComponent size={30} color="white" className={clsx(classes.iconComponent, classNames?.defaultPopupButtonIcon)} />}
									</Button>
								)}
							</div>
						</PopoverTrigger>
						<PopoverContent className={clsx(classes.chatWrapper, isExpanded && classes.expandedChatWrapper)} style={{transformOrigin: origin, margin: '0 10px'}} sideOffset={53}>
							<Chat route={route} asPopup={asPopup} sessionId={sessionId} agentName={agentName} agentAvatar={agentAvatar} chatDescription={chatDescription} classNames={classNames} components={components} sendIcon={sendIcon} changeIsExpanded={() => setIsExpanded(!isExpanded)} />
						</PopoverContent>
					</Popover>
				) : (
					<div className={clsx(classes.chatWrapper, isExpanded && classes.expandedChatWrapper)}>
						<Chat route={route} sessionId={sessionId} agentName={agentName} agentAvatar={agentAvatar} chatDescription={chatDescription} classNames={classNames} components={components} sendIcon={sendIcon} changeIsExpanded={() => setIsExpanded(!isExpanded)} />
					</div>
				)}
			</span>
		</QueryClientProvider>
	);
};

export default Chatbot;
