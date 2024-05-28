import { css } from "@kuma-ui/core";
import Link from "next/link";
import Image from "next/image";

interface Props {
	href: string;
	icon: string;
	text: string;
}

export default function ({ href, icon, text }: Props): JSX.Element {
	return (
		<Link
			className={css`
				display: inline-flex;
				align-items: center;
				gap: 5px;
			`}
			href={href}
			target="_blank"
		>
			<Image
				width={20}
				height={20}
				src={icon}
				alt={`${text}のアイコン`}
				className={css`
					object-fit: contain;
				`}
			/>
			<span
				className={css`
					color: inherit;
				`}
			>
				{text}
			</span>
		</Link>
	);
}
