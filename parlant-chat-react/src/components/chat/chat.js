var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { groupBy } from "@/utils/object";
import { useQuery } from "@tanstack/react-query";
import { ParlantClient } from "parlant-client";
import { useEffect, useRef, useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import Message from "./message/message";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import '../../App.css';
export const emptyPendingMessage = () => ({
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
const Chat = ({ route, sessionId, classNames }) => {
    const [messages, setMessages] = useState([]);
    const [lastOffset, setLastOffset] = useState(0);
    const [showInfo, setShowInfo] = useState('');
    const [pendingMessage, setPendingMessage] = useState(emptyPendingMessage());
    const messagesRef = useRef(null);
    const submitButtonRef = useRef(null);
    const textareaRef = useRef(null);
    const lastMessageRef = useRef(null);
    const [message, setMessage] = useState('');
    const parlantClient = new ParlantClient({
        environment: route,
    });
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['events', lastOffset],
        queryFn: () => parlantClient.sessions.listEvents(sessionId, { waitForData: 60, minOffset: lastOffset }),
    });
    const handleTextareaKeydown = (e) => {
        var _a;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            (_a = submitButtonRef === null || submitButtonRef === void 0 ? void 0 : submitButtonRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }
        else if (e.key === 'Enter' && e.shiftKey)
            e.preventDefault();
    };
    const postMessage = (content) => __awaiter(void 0, void 0, void 0, function* () {
        setPendingMessage((pendingMessage) => (Object.assign(Object.assign({}, pendingMessage), { sessionId, data: { message: content } })));
        setMessage('');
        parlantClient.sessions.createEvent(sessionId, { kind: 'message', message: content, source: 'customer' });
    });
    const formatMessagesFromEvents = () => {
        var _a;
        const lastEvent = data === null || data === void 0 ? void 0 : data.at(-1);
        const lastStatusEvent = data === null || data === void 0 ? void 0 : data.findLast((e) => e.kind === 'status');
        if (!lastEvent)
            return;
        const offset = lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.offset;
        if (offset || offset === 0)
            setLastOffset(offset + 1);
        const correlationsMap = groupBy(data || [], (item) => item === null || item === void 0 ? void 0 : item.correlationId.split('::')[0]);
        const newMessages = (data === null || data === void 0 ? void 0 : data.filter((e) => e.kind === 'message')) || [];
        const withStatusMessages = newMessages.map((newMessage, i) => {
            var _a, _b;
            const data = Object.assign(Object.assign({}, newMessage), { status: '' });
            const item = (_b = (_a = correlationsMap === null || correlationsMap === void 0 ? void 0 : correlationsMap[newMessage.correlationId.split('::')[0]]) === null || _a === void 0 ? void 0 : _a.at(-1)) === null || _b === void 0 ? void 0 : _b.data;
            data.status = ((item === null || item === void 0 ? void 0 : item.status) || (newMessages[i + 1] ? 'ready' : null));
            if (data.status === 'error') {
                const itemData = item === null || item === void 0 ? void 0 : item.data;
                data.error = itemData === null || itemData === void 0 ? void 0 : itemData.exception;
            }
            return data;
        });
        setMessages((messages) => {
            var _a, _b, _c, _d, _e;
            const last = messages.at(-1);
            if ((last === null || last === void 0 ? void 0 : last.source) === 'customer' && (correlationsMap === null || correlationsMap === void 0 ? void 0 : correlationsMap[last === null || last === void 0 ? void 0 : last.correlationId])) {
                last.status = ((_b = (_a = correlationsMap[last.correlationId].at(-1)) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.status) || last.status;
                if (last.status === 'error')
                    last.error = (_d = (_c = correlationsMap[last.correlationId].at(-1)) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.exception;
            }
            if (!(withStatusMessages === null || withStatusMessages === void 0 ? void 0 : withStatusMessages.length))
                return [...messages];
            if ((_e = pendingMessage === null || pendingMessage === void 0 ? void 0 : pendingMessage.data) === null || _e === void 0 ? void 0 : _e.message)
                setPendingMessage(emptyPendingMessage());
            const newVals = [];
            for (const messageArray of [messages, withStatusMessages]) {
                for (const message of messageArray) {
                    newVals[message.offset] = message;
                }
            }
            return newVals.filter((message) => message);
        });
        const lastStatusEventStaus = (_a = lastStatusEvent === null || lastStatusEvent === void 0 ? void 0 : lastStatusEvent.data) === null || _a === void 0 ? void 0 : _a.status;
        setShowInfo((!!(messages === null || messages === void 0 ? void 0 : messages.length) && lastStatusEventStaus === 'processing') ? 'Thinking...' : lastStatusEventStaus === 'typing' ? 'Typing...' : '');
    };
    useEffect(formatMessagesFromEvents, [data === null || data === void 0 ? void 0 : data.length]);
    useEffect(() => {
        setTimeout(() => { var _a; return (_a = lastMessageRef === null || lastMessageRef === void 0 ? void 0 : lastMessageRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' }); }, 500);
    }, [lastMessageRef === null || lastMessageRef === void 0 ? void 0 : lastMessageRef.current]);
    return (_jsxs("div", { className: twMerge("bg-[linear-gradient(135deg,#1e1e2e,#252a34)] h-[600px] rounded-[10px] p-[10px] flex flex-col w-[500px]", classNames === null || classNames === void 0 ? void 0 : classNames.chatbox), children: [_jsx("div", { className: twMerge("flex-1 overflow-auto fixed-scroll", classNames === null || classNames === void 0 ? void 0 : classNames.messagesArea), children: messages.map((message, i) => _jsx("div", { ref: lastMessageRef, children: _jsx(Message, { message: message, className: classNames === null || classNames === void 0 ? void 0 : classNames.message }) }, i)) }), _jsxs("div", { className: twJoin('group w-[80%] m-auto flex-[none] relative border flex-1 border-muted border-solid rounded-[16px] flex flex-row justify-center items-center bg-white p-[0.9rem] ps-[14px] mt-[1rem] pe-0 h-[48.67px] max-w-[1000px] mb-[20px]', classNames === null || classNames === void 0 ? void 0 : classNames.textarea), children: [_jsx(Textarea, { role: 'textbox', ref: textareaRef, placeholder: 'Message...', value: message, onKeyDown: handleTextareaKeydown, onChange: (e) => setMessage(e.target.value), rows: 1, className: 'box-shadow-none placeholder:text-[#282828] resize-none border-none h-full rounded-none min-h-[unset] p-0 whitespace-nowrap no-scrollbar font-inter font-light text-[16px] leading-[18px] bg-white' }), _jsx("p", { className: twMerge('absolute invisible left-[0.25em] -bottom-[28px] font-normal text-[#A9AFB7] text-[14px] font-inter', (showInfo) && 'visible'), children: showInfo }), _jsx(Button, { variant: 'ghost', "data-testid": 'submit-button', className: 'max-w-[60px] rounded-full hover:bg-white', ref: submitButtonRef, disabled: !(message === null || message === void 0 ? void 0 : message.trim()), onClick: () => postMessage(message), children: _jsx("svg", { width: "23", height: "21", viewBox: "0 0 23 21", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M0.533203 0.333373L22.5332 10.3334L0.533202 20.3334L2.40554 12.3334L9.42682 10.3334L2.40554 8.33337L0.533203 0.333373Z", fill: "#282828" }) }) })] })] }));
};
export default Chat;
