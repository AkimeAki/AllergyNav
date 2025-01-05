"use client";

import { cx } from "@/libs/merge-kuma";
import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";

interface Props {
	name: string;
	size: number;
	color: string;
}

export default function ({ name, size, color }: Props): JSX.Element {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		document.fonts.ready.then(() => {
			setIsLoading(true);
		});
	}, []);

	return (
		<span
			style={{
				color: !isLoading ? "transparent" : color,
				fontSize: `${size}px`,
				width: !isLoading ? `${size}px` : undefined,
				height: !isLoading ? `${size}px` : undefined
			}}
			className={"material-symbols-outlined"}
		>
			{name}
		</span>
	);
}
