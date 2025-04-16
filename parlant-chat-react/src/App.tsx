import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {ClassNameValue} from 'tailwind-merge';
import {useEffect, useRef, useState} from 'react';
import type {JSX, ReactElement} from 'react';
import {MessageSquare, X} from 'lucide-react';
import Chat from './components/chat/chat';
import type {MessageInterface} from './components/chat/chat';
import {Button} from './components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from './components/ui/popover';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';

import WebFont from 'webfontloader';

const loadFonts = () => {
	WebFont.load({
		google: {
			families: ['Ubuntu Sans:400,700'],
		},
	});
};

const useStyles = createUseStyles({
	root: {
		fontFamily: 'Ubuntu Sans',
		'& .fixed-scroll': {
			scrollbarWidth: 'thin',
			scrollbarColor: '#ebecf0 transparent',
		},
	},
	popupButton: {
		backgroundColor: '#006E53',
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
	},
	chatWrapper: {
		width: '27.75rem',
		background: '#FBFBFB',
		border: '1px solid #e7e6e6',
		borderRadius: '20px',
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
		padding: '0',
	},
});

interface MessageComponentProps {
	message: MessageInterface;
	className?: ClassNameValue;
}

interface PopupButtonComponentProps {
	toggleChatOpen: () => void;
}

export interface ChatProps {
	route: string;
	sessionId: string;
	asPopup?: boolean;
	popupButton?: JSX.Element;
	sendIcon?: JSX.Element;
	classNames?: {
		chatbox?: ClassNameValue;
		messagesArea?: ClassNameValue;
		agentMessage?: ClassNameValue;
		customerMessage?: ClassNameValue;
		textarea?: ClassNameValue;
		defaultPopupButton?: ClassNameValue;
		defaultPopupButtonIcon?: ClassNameValue;
	};
	components?: {
		popupButton?: (props: PopupButtonComponentProps) => ReactElement;
		agentMessage?: (props: MessageComponentProps) => ReactElement;
		customerMessage?: (props: MessageComponentProps) => ReactElement;
	};
}

const queryClient = new QueryClient();

const Chatbot = ({route, sessionId, asPopup = false, popupButton, components, sendIcon, classNames}: ChatProps): JSX.Element => {
	const classes = useStyles();
	const [open, setOpen] = useState<boolean>(false);

	const IconComponent = open ? X : MessageSquare;

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
						<PopoverContent className={classes.chatWrapper} side="top" align="end" sideOffset={10}>
							<Chat route={route} asPopup={asPopup} sessionId={sessionId} classNames={classNames} components={components} sendIcon={sendIcon} />
						</PopoverContent>
					</Popover>
				) : (
					<Chat route={route} sessionId={sessionId} classNames={classNames} components={components} sendIcon={sendIcon} />
				)}
			</span>
		</QueryClientProvider>
	);
};

export default Chatbot;
