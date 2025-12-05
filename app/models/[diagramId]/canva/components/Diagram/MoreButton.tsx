'use client'

import React from "react";
import { Button } from "@/components/ui/button";

export const MoreButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
	return (
		<Button
			ref={ref}
			type="button"
			size="icon"
			className={`cursor-pointer bg-transparent hover:bg-transparent ${className}`}
			aria-label="More options"
			onClick={(e) => {
				onClick?.(e);
				e.stopPropagation();
			}}
			{...props}
		>
			<svg
				width="4"
				height="16"
				viewBox="0 0 4 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title aria-hidden>More options</title>
				<path
					id="Shape"
					d="M2 3.75C1.0335 3.75 0.25 2.9665 0.25 2C0.25 1.0335 1.0335 0.25 2 0.25C2.9665 0.25 3.75 1.0335 3.75 2C3.75 2.9665 2.9665 3.75 2 3.75ZM2 9.75C1.0335 9.75 0.25 8.9665 0.25 8C0.25 7.0335 1.0335 6.25 2 6.25C2.9665 6.25 3.75 7.0335 3.75 8C3.75 8.9665 2.9665 9.75 2 9.75ZM0.249999 14C0.249999 14.9665 1.0335 15.75 2 15.75C2.9665 15.75 3.75 14.9665 3.75 14C3.75 13.0335 2.9665 12.25 2 12.25C1.0335 12.25 0.249999 13.0335 0.249999 14Z"
					fill="currentColor"
				/>
			</svg>
		</Button>
	);
});
