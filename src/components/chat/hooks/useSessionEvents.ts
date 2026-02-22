import {groupBy} from '@/utils/object';
import type {Event} from 'parlant-client/src/api';
import React, {useEffect, useRef, useState} from 'react';
import type {MessageInterface} from '@/components/chat/types';

interface StatusEventData {
	status?: string;
	exception?: string;
}


const normalizeEvent = (raw: Record<string, unknown>): Event => ({
	id: raw.id as string,
	offset: raw.offset as number,
	kind: raw.kind as Event['kind'],
	source: raw.source as Event['source'],
	data: raw.data as unknown,
	correlationId: ((raw.correlation_id || raw.correlationId) ?? '') as string,
	creationUtc: new Date((raw.creation_utc ?? raw.creationUtc) as string),
	deleted: (raw.deleted ?? false) as boolean,
});

export const isMessageStreaming = (message: MessageInterface): boolean => {
	const chunks = (message.data as Record<string, unknown>)?.chunks as (string | null)[] | undefined;
	if (chunks === undefined) return false;
	if (chunks.length === 0) return true;
	return chunks[chunks.length - 1] !== null;
};

interface UseSessionEventsOptions {
	server: string;
	sessionId: string | undefined;
	messages: MessageInterface[];
	setMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>;
}

export function useSessionEvents({server, sessionId, messages, setMessages}: UseSessionEventsOptions): {showInfo: string} {
	const [showInfo, setShowInfo] = useState('');
	const [lastSseEvents, setLastSseEvents] = useState<Event[]>([]);
	const listEventsConnectionRef = useRef<EventSource | null>(null);
	const sseOffsetRef = useRef(0);
	const prevSessionIdRef = useRef<string | null>(null);
	const [sseReconnectTrigger, setSseReconnectTrigger] = useState(0);
	const streamingConnectionsRef = useRef<Map<string, EventSource>>(new Map());

	// SSE connection for list_events — reconnects on session change or error
	useEffect(() => {
		if (!sessionId) return;

		listEventsConnectionRef.current?.close();

		if (prevSessionIdRef.current !== sessionId) {
			setLastSseEvents([]);
			sseOffsetRef.current = 0;
			prevSessionIdRef.current = sessionId;
			for (const es of streamingConnectionsRef.current.values()) es.close();
			streamingConnectionsRef.current.clear();
		}

		const url = `${server}/sessions/${sessionId}/events?sse=true&min_offset=${sseOffsetRef.current}&wait_for_data=60`;
		const eventSource = new EventSource(url);
		listEventsConnectionRef.current = eventSource;

		eventSource.onmessage = (e) => {
			try {
				const normalized = normalizeEvent(JSON.parse(e.data) as Record<string, unknown>);
				if (normalized.offset !== undefined) {
					sseOffsetRef.current = Math.max(sseOffsetRef.current, normalized.offset + 1);
				}
				setLastSseEvents(prev => [...prev, normalized]);
			} catch (err) {
				console.error('Error parsing SSE event:', err);
			}
		};

		eventSource.onerror = () => {
			eventSource.close();
			listEventsConnectionRef.current = null;
			setTimeout(() => setSseReconnectTrigger(n => n + 1), 1000);
		};

		return () => {
			eventSource.close();
			listEventsConnectionRef.current = null;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionId, sseReconnectTrigger, server]);

	// Process incoming events: merge into messages, update status info, open per-message SSE for streaming
	useEffect(() => {
		if (!lastSseEvents.length) return;

		const correlationsMap = groupBy(lastSseEvents, (e: Event) => e.correlationId.split('::')[0]);
		const messageEvents = lastSseEvents.filter(e => e.kind === 'message');
		const hasStreamingMessage = messageEvents.some(e => (e.data as Record<string, unknown>)?.chunks !== undefined);

		const withStatusMessages: MessageInterface[] = messageEvents.map((msg, i) => {
			const correlationItems = correlationsMap[msg.correlationId.split('::')[0]];
			const lastItem = correlationItems?.at(-1)?.data as StatusEventData | undefined;
			const status = lastItem?.status || (messageEvents[i + 1] ? 'ready' : null);
			return {
				...msg,
				status,
				...(status === 'error' ? {error: lastItem?.exception} : {}),
			};
		});

		setMessages(current => {
			// Update status on the last customer message if a correlation event arrived
			const lastMessage = current.at(-1);
			if (lastMessage?.source === 'customer' && correlationsMap[lastMessage.correlationId]) {
				const lastItem = correlationsMap[lastMessage.correlationId].at(-1)?.data as StatusEventData;
				lastMessage.status = lastItem?.status || lastMessage.status;
				if (lastMessage.status === 'error') lastMessage.error = lastItem?.exception;
			}

			if (!withStatusMessages.length) return [...current];

			// Merge by offset so messages always stay in order
			const merged: (Event | undefined)[] = [];
			for (const arr of [current, withStatusMessages]) {
				for (const msg of arr) merged[msg.offset] = msg;
			}
			return merged.filter((m): m is MessageInterface => !!m);
		});

		const lastStatusEvent = [...lastSseEvents].reverse().find(e => e.kind === 'status');
		const lastStatus = (lastStatusEvent?.data as StatusEventData)?.status;
		const stageData = (lastStatusEvent?.data as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
		setShowInfo(
			!!messages.length && lastStatus === 'processing'
				? `${stageData?.stage ?? 'Thinking'}...`
				: lastStatus === 'typing' && !hasStreamingMessage
				? 'Typing...'
				: ''
		);

		// Open a per-message SSE connection for each new streaming message
		if (sessionId) {
			for (const msg of withStatusMessages) {
				if (!(msg.data as Record<string, unknown>)?.chunks || !msg.id || streamingConnectionsRef.current.has(msg.id)) continue;

				const msgId = msg.id;
				const es = new EventSource(`${server}/sessions/${sessionId}/events/${msgId}?sse=true`);

				es.onmessage = (e) => {
					try {
						const updatedData = (JSON.parse(e.data) as Record<string, unknown>).data as Record<string, unknown>;
						setMessages(prev => prev.map(m =>
							m.id === msgId ? {...m, data: {...(m.data as Record<string, unknown>), ...updatedData}} : m
						));
						if ((updatedData?.chunks as (string | null)[] | undefined)?.at(-1) === null) {
							es.close();
							streamingConnectionsRef.current.delete(msgId);
							setShowInfo('');
						}
					} catch (err) {
						console.error('Error parsing streaming SSE event:', err);
					}
				};

				es.onerror = () => {
					es.close();
					streamingConnectionsRef.current.delete(msgId);
				};

				streamingConnectionsRef.current.set(msgId, es);
			}
		}

		setLastSseEvents([]);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastSseEvents]);

	return {showInfo};
}
