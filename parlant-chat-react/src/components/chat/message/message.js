import { jsx as _jsx } from "react/jsx-runtime";
import { twJoin } from 'tailwind-merge';
const Message = ({ message, className }) => {
    var _a;
    const isCustomerMesage = (message === null || message === void 0 ? void 0 : message.source) === 'customer';
    return (_jsx("div", { className: twJoin("message w-full text-start flex text-[#A9A9A9]", isCustomerMesage && 'justify-end', className), children: _jsx("div", { className: twJoin('w-[50%] rounded-[12px] p-[10px] m-[10px]', isCustomerMesage ? 'bg-[#4a90e2] text-white' : 'bg-[#2c2f36] text-[#d1d1e9]'), children: _jsx("div", { className: "", children: (_a = message.data) === null || _a === void 0 ? void 0 : _a.message }) }) }));
};
export default Message;
