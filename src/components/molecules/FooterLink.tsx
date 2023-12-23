import { css } from "@kuma-ui/core";
import Image from "next/image";
import Link from "next/link";

interface Props {
	href: string;
	name: string;
}

export default function ({ href, name }: Props): JSX.Element {
	return (
		<Link
			href={href}
			target="_blank"
			className={css`
				display: flex;
				align-items: center;
				justify-content: center;
				width: 40px;
				aspect-ratio: 1/1;
				font-size: 0;
				border-radius: 50%;
				background-color: white;
				overflow: hidden;
				transition-duration: 200ms;
				transition-property: box-shadow;

				&:hover {
					@media (hover: hover) {
						box-shadow: 0px 0px 15px -7px #777777;
					}
				}

				&:active {
					box-shadow: 0px 0px 15px -7px #777777;
				}
			`}
		>
			<Image
				width={100}
				height={100}
				src={`/icons/circle/${name}.png`}
				alt={`${name}のアイコン`}
				className={css`
					width: 100%;
					height: 100%;
				`}
			/>
		</Link>
	);
}
