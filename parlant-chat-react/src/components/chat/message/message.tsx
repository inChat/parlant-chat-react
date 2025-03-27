import { ClassNameValue, twJoin, twMerge } from 'tailwind-merge';
import { MessageInterface } from '../chat';

const Message = ({message, className}: {message: MessageInterface; className?: ClassNameValue}) => {
    const isCustomerMesage = message?.source === 'customer';
    return (
        <div className={twJoin("message w-full text-start flex text-[#A9A9A9]", isCustomerMesage && 'justify-end')}>
            <div className={twMerge('w-[50%] rounded-[12px] p-[10px] m-[10px]', isCustomerMesage ? 'bg-[#4a90e2] text-white' : 'bg-[#2c2f36] text-[#d1d1e9]', className)}>
                <div className="">
                    {(message.data as any)?.message}
                </div>
            </div>
        </div>
    )
}

export default Message;