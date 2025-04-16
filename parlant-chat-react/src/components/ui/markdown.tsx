/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import { twMerge } from 'tailwind-merge';

const Markdown = ({children, className}: {children: string; className?: string}) => {
	return (
		<div className={twMerge('leading-[19px]', className)}>
			<ReactMarkdown
				components={{
					p: 'div', 
					img: ({node, ...props}) => <img {...props} loading='lazy' alt='' />
				}}
				rehypePlugins={[rehypeHighlight]}
				remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji]}>
				{children}
			</ReactMarkdown>
		</div>
	);
};

export default Markdown;
