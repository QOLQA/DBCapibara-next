"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@fsd/shared/lib/classnames";
import { useTranslation } from "@fsd/shared/i18n/use-translation";

interface ModelImageProps {
	src: string;
	alt: string;
	className: string;
}

export function ModelImage({ src, alt, className }: ModelImageProps) {
	const { t } = useTranslation();
	const [imageError, setImageError] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);

	if (imageError || !src) {
		return (
			<div
				className={`${className} bg-primary-gray flex items-center justify-center text-gray-400`}
			>
				{t("other.noImage")}
			</div>
		);
	}

	return (
		<div className="relative w-full h-full">
			<Image
				src={src}
				alt={alt}
				className={cn(className, "object-cover")}
				width={300}
				height={198}
				onError={() => {
					setImageError(true);
					setImageLoading(false);
				}}
				onLoad={() => {
					setImageLoading(false);
				}}
				onLoadingComplete={() => {
					setImageLoading(false);
				}}
			/>
			{imageLoading && (
				<div className="absolute inset-0 bg-primary-gray flex items-center justify-center">
					<div className="text-gray-400 text-sm">{t("common.loading")}</div>
				</div>
			)}
		</div>
	);
}
