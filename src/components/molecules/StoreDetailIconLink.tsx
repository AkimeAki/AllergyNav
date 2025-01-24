import { css } from "@kuma-ui/core";
import Link from "next/link";

interface Props {
	href: string;
	icon: string;
	text: string;
}

export default function ({ href, icon, text }: Props): JSX.Element {
	return (
		<Link
			aria-label={text}
			className={css`
				display: flex;
				align-items: center;
				gap: 5px;

				img {
					object-fit: contain;
				}
			`}
			href={href}
			target="_blank"
		>
			<img width={20} height={20} src={icon} alt={text} />
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
