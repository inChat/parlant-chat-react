import type { JSX } from 'react';
import clsx from 'clsx';
import { useEffect, useState, lazy, Suspense } from 'react';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';

const ReactMarkdown = lazy(() => import('react-markdown'));

const useClientSideStyles = () => {
  useEffect(() => {
    import('highlight.js/styles/github.css');
  }, []);
};

interface MarkdownProps {
	children: string;
	className?: string;
}

const Markdown = ({ children, className }: MarkdownProps): JSX.Element => {
	const [isMounted, setIsMounted] = useState(false);
	useClientSideStyles();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <div className={clsx('leading-[19px]', className)} />;
	}

	return (
		<div className={clsx('leading-[19px]', className)}>
			<Suspense fallback={<div>Loading...</div>}>
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
			</Suspense>
		</div>
	);
};

export default Markdown;
