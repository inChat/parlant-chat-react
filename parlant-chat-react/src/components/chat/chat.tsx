import { groupBy } from "@/utils/object";
import { useQuery } from "@tanstack/react-query";
import { ParlantClient } from "parlant-client";
import { Event } from "parlant-client/src/api";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Message from "./message/message";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChatProps } from "@/App";
// import sendIcon from '/icons/send.svg';

export type MessageInterface = Event & {
    status: string | null;
    error?: string;
}

export const emptyPendingMessage: () => Partial<Event> = () => ({
	kind: 'message',
	source: 'customer',
	creation_utc: new Date(),
	serverStatus: 'pending',
	offset: 0,
	correlationId: '',
	data: {
		message: '',
	},
});

const Chat = ({route, sessionId, classNames}: ChatProps) => {
    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const [lastOffset, setLastOffset] = useState(0);
    const [showInfo, setShowInfo] = useState('');
    const [pendingMessage, setPendingMessage] = useState<Partial<Event>>(emptyPendingMessage());
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null);


	const [message, setMessage] = useState('');

    const parlantClient = new ParlantClient({
        environment: route,
    });
    const {data, isLoading, refetch} = useQuery<Event[]>({
		queryKey: ['events', lastOffset],
        queryFn: () => parlantClient.sessions.listEvents(sessionId, {waitForData: 60, minOffset: lastOffset}),
	});

    const handleTextareaKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submitButtonRef?.current?.click();
		} else if (e.key === 'Enter' && e.shiftKey) e.preventDefault();
	};

    const postMessage = async (content: string): Promise<void> => {
		setPendingMessage((pendingMessage) => ({...pendingMessage, sessionId, data: {message: content}}));
		setMessage('');
        parlantClient.sessions.createEvent(sessionId, {kind:'message', message: content, source: 'customer'});
	};
    
    const formatMessagesFromEvents = () => {
		const lastEvent = data?.at(-1);
		const lastStatusEvent = data?.findLast((e) => e.kind === 'status');
		if (!lastEvent) return;

		const offset = lastEvent?.offset;
		if (offset || offset === 0) setLastOffset(offset + 1);

		const correlationsMap = groupBy(data || [], (item: Event) => item?.correlationId.split('::')[0]);

		const newMessages = data?.filter((e) => e.kind === 'message') || [];
		const withStatusMessages = newMessages.map((newMessage, i) => {
			const data: MessageInterface = {...newMessage, status: ''};
			const item: unknown = correlationsMap?.[newMessage.correlationId.split('::')[0]]?.at(-1)?.data;
			data.status = ((item as MessageInterface)?.status || (newMessages[i + 1] ? 'ready' : null));
			if (data.status === 'error') {
                const itemData = (item as MessageInterface)?.data as {exception?: string}
                data.error = itemData?.exception;
            }
			return data;
		});

		setMessages((messages: any[]) => {
			const last = messages.at(-1);
			if (last?.source === 'customer' && correlationsMap?.[last?.correlationId]) {
				last.status = (correlationsMap[last.correlationId].at(-1)?.data as any)?.status || last.status;
				if (last.status === 'error') last.error = (correlationsMap[last.correlationId].at(-1)?.data as any)?.exception;
			}
			if (!withStatusMessages?.length) return [...messages];
			if ((pendingMessage?.data as any)?.message) setPendingMessage(emptyPendingMessage());

			const newVals: Event[] = [];
			for (const messageArray of [messages, withStatusMessages]) {
				for (const message of messageArray) {
					newVals[message.offset] = message;
				}
			}
			return newVals.filter((message) => message);
		});

		const lastStatusEventStaus = (lastStatusEvent?.data as any)?.status;
        setShowInfo((!!messages?.length && lastStatusEventStaus === 'processing') ? 'Thinking...' : lastStatusEventStaus === 'typing' ? 'Typing...' : '');
	};

    useEffect(formatMessagesFromEvents, [data?.length]);
    useEffect(() => {
        setTimeout(() => lastMessageRef?.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'}), 500);
    }, [lastMessageRef?.current])

  return (
        <div className={twMerge("bg-[#1e1e2e] h-[min(600px,70vh)] rounded-[10px] p-[10px] flex flex-col w-[500px]", classNames?.chatbox)}>
            <div className={twMerge("flex-1 overflow-auto fixed-scroll", classNames?.messagesArea)}>
                {messages.map((message, i) => <div ref={lastMessageRef} key={i}><Message message={message} className={message?.source === 'customer' ? classNames?.customerMessage : classNames?.agentMessage}/></div>)}
            </div>
            <div className={twMerge('group w-[80%] m-auto flex-[none] relative border border-muted border-solid rounded-[16px] flex flex-row justify-center items-center bg-white leading-[3rem] ps-[14px] mt-[1rem] pe-0 h-[48.67px] max-w-[1000px] mb-[20px]', classNames?.textarea)}>
                <Textarea
                    role='textbox'
                    ref={textareaRef}
                    placeholder='Message...'
                    value={message}
                    onKeyDown={handleTextareaKeydown}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={1}
                    className={twMerge('box-shadow-none placeholder:text-[#282828] resize-none border-none h-full rounded-none min-h-[unset] p-0 whitespace-nowrap no-scrollbar font-inter font-light text-[16px] leading-[18px] bg-white', classNames?.textarea)}
                />
                <p className={twMerge('absolute invisible left-[0.25em] -bottom-[28px] font-normal text-[#A9AFB7] text-[14px] font-inter', (showInfo) && 'visible')}>
                    {showInfo}
                </p>
                <Button variant='ghost' data-testid='submit-button' className='max-w-[60px] rounded-full hover:bg-white' ref={submitButtonRef} disabled={!message?.trim()} onClick={() => postMessage(message)}>
                <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.533203 0.333373L22.5332 10.3334L0.533202 20.3334L2.40554 12.3334L9.42682 10.3334L2.40554 8.33337L0.533203 0.333373Z" fill="#282828"/>
                </svg>
                </Button>
            </div>
        </div>
  );
};

export default Chat;