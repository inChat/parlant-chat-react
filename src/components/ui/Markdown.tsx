import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import clsx from 'clsx';
import type { JSX } from 'react';

interface MarkdownProps {
	children: string;
	className?: string;
}

const Markdown = ({ children, className }: MarkdownProps): JSX.Element => {
	return (
		<div className={clsx('leading-[19px]', className)}>
			<ReactMarkdown
				components={{
					p: 'div',
					img: ({ node, src, alt, ...props }) => (
						<img 
							{...props} 
							src={src} 
							alt={alt || 'Image'} 
							loading="lazy" 
							style={{ maxWidth: '100%' }}
						/>
					),
				}}
				rehypePlugins={[rehypeHighlight]}
				remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji]}>
				{children}
			</ReactMarkdown>
		</div>
	);
};

export default Markdown;
