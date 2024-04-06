import { css } from "@kuma-ui/core";
import Image from "next/image";

interface Props {
	image: string;
	text: string;
	selected?: boolean;
	icon?: React.ReactNode;
	nameHidden?: boolean;
	size?: number;
}

export default function ({ image, text, selected = false, icon, nameHidden = false, size = 35 }: Props): JSX.Element {
	return (
		<div
			style={{ width: `${size + 10}px` }}
			className={css`
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			`}
		>
			<Image
				style={{ width: `${size}px` }}
				className={[
					css`
						height: auto;
						aspect-ratio: 1/1;
						object-fit: contain;
						vertical-align: bottom;
						transition-duration: 200ms;
						transition-property: filter;
						user-select: none;
						pointer-events: none;
					`,
					selected
						? css`
								filter: opacity(0.4);
							`
						: css`
								filter: opacity(1);
							`
				].join(" ")}
				width={100}
				height={100}
				src={image}
				alt={`${text}のアイコン`}
			/>
			{!nameHidden && (
				<div
					className={css`
						position: relative;
						text-align: center;
						white-space: nowrap;
						font-size: 15px;
						font-weight: 700;
						margin-top: 5px;
						z-index: 1;
					`}
				>
					{text}
				</div>
			)}
			{selected && icon !== undefined && (
				<div
					className={css`
						user-select: none;
						pointer-events: none;
					`}
				>
					{icon}
				</div>
			)}
		</div>
	);
}
