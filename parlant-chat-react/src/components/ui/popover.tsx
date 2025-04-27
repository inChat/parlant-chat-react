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
		'&[data-state="open"]': {
			animation: '$animateIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
		},
		'&[data-state="closed"]': {
			animation: '$animateOut 100ms ease-in',
		},
	},
	'@keyframes animateIn': {
		from: {transform: 'scale(0)'},
		to: {transform: 'scale(1)'},
	},
	'@keyframes animateOut': {
		from: {transform: 'scale(1)'},
		to: {transform: 'scale(0)'},
	}
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
					onCloseAutoFocus={(event) => {
						event.preventDefault();
						props.onCloseAutoFocus?.(event);
					}}
					onEscapeKeyDown={(event) => {
						event.preventDefault();
						props.onEscapeKeyDown?.(event);
					}}
					onOpenAutoFocus={(event) => {
						event.preventDefault();
						props.onOpenAutoFocus?.(event);
					}}
					forceMount
				>
					{props.children}
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		);
	},
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export {Popover, PopoverTrigger, PopoverContent}; 