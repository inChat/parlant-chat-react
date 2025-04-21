'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';

const useStyles = createUseStyles({
	popoverContent: {
		zIndex: 50,
		width: '18rem',
		borderRadius: '0.375rem',
		border: '1px solid var(--border)',
		backgroundColor: 'var(--popover)',
		padding: '1rem',
		color: 'var(--popover-foreground)',
		boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
		outline: 'none',
		transformOrigin: 'var(--radix-popover-content-transform-origin)',
		willChange: 'transform, opacity',
		// '&[data-state="open"]': {
		// 	animation: '$animateIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
		// },
		// '&[data-state="closed"]': {
		// 	animation: '$animateOut 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
		// },
		// '&[data-side="bottom"]': {
		// 	animationName: '$slideInFromTop',
		// },
		// '&[data-side="left"]': {
		// 	animationName: '$slideInFromRight',
		// },
		// '&[data-side="right"]': {
		// 	animationName: '$slideInFromLeft',
		// },
		// '&[data-side="top"]': {
		// 	animationName: '$slideInFromBottom',
		// },
	},
	'@keyframes animateIn': {
		from: {
			opacity: 0,
			transform: 'scale(0.96) translateY(4px)',
		},
		to: {
			opacity: 1,
			transform: 'scale(1) translateY(0)',
		},
	},
	'@keyframes animateOut': {
		from: {
			opacity: 1,
			transform: 'scale(1) translateY(0)',
		},
		to: {
			opacity: 0,
			transform: 'scale(0.96) translateY(4px)',
		},
	},
	'@keyframes slideInFromTop': {
		from: {
			opacity: 0,
			transform: 'scale(0)',
		},
		to: {
			opacity: 1,
			transform: 'scale(1)',
		},
	},
	'@keyframes slideInFromRight': {
		from: {
			opacity: 0,
			transform: 'translateX(10px)',
		},
		to: {
			opacity: 1,
			transform: 'translateX(0)',
		},
	},
	'@keyframes slideInFromLeft': {
		from: {
			opacity: 0,
			transform: 'translateX(-10px)',
		},
		to: {
			opacity: 1,
			transform: 'translateX(0)',
		},
	},
	'@keyframes slideInFromBottom': {
		from: {
			opacity: 0,
			transform: 'scale(0)',
		},
		to: {
			opacity: 1,
			transform: 'scale(1)',
		},
	},
});

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(
	({className, align = 'center', sideOffset = 4, ...props}, ref) => {
		const classes = useStyles();

		return (
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content 
					ref={ref} 
					align={align} 
					sideOffset={sideOffset} 
					className={clsx(classes.popoverContent, className)} 
					{...props}
				/>
			</PopoverPrimitive.Portal>
		);
	},
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export {Popover, PopoverTrigger, PopoverContent}; 