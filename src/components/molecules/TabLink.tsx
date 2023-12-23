"use client";

import { css } from "@kuma-ui/core";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface Props {
	href: string;
	children: ReactNode;
}

export default function ({ href, children }: Props): JSX.Element {
	const pathname = usePathname();

	return (
		<Link
			href={href}
			className={[
				css`
					text-decoration: none;
					height: 100%;
					padding: 15px 15px;
					display: block;
					font-weight: bold;
					transition-duration: 200ms;
					transition-property: filter;

					&:hover {
						filter: brightness(1.03);
					}
				`,
				pathname === href
					? css`
							background-color: var(--color-orange);
							color: white;

							&:hover {
								background-color: var(--color-orange);
								color: white;
							}
					  `
					: css`
							background-color: var(--color-orange-thin);
							color: var(--color-black);
					  `
			].join(" ")}
		>
			{children}
		</Link>
	);
}
