import { css } from "@kuma-ui/core";
import Image from "next/image";
import GoogleIcon from "@/components/atoms/GoogleIcon";

interface Props {
	image: string;
	text: string;
	selected?: boolean;
}

export default function ({ image, text, selected = false }: Props): JSX.Element {
	return (
		<div
			className={css`
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 50px;
			`}
		>
			<Image
				className={[
					css`
						width: 40px;
						height: auto;
						aspect-ratio: 1/1;
						object-fit: contain;
						vertical-align: bottom;
						transition-duration: 200ms;
						transition-property: filter;
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
			{selected && (
				<div
					className={css`
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					`}
				>
					<GoogleIcon name="skull" size={40} color="var(--color-red)" />
				</div>
			)}
		</div>
	);
}
