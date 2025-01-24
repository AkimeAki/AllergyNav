import { css } from "@kuma-ui/core";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import type { AllergenItemStatus } from "@/type";
import { cx } from "@/libs/merge-kuma";

interface Props {
	image: string;
	text: string;
	nameHidden?: boolean;
	size?: number;
	status?: AllergenItemStatus;
	clickable?: boolean;
	onClick?: () => void;
}

export default function ({
	image,
	text,
	nameHidden = false,
	size = 32,
	status = "normal",
	clickable = false,
	onClick
}: Props): JSX.Element {
	let scaleX = 1;
	if (text.length > 3) {
		scaleX -= (text.length - 3) * 0.1 + 0.1;
	}

	return (
		<div
			onClick={() => {
				if (onClick !== undefined) {
					onClick();
				}
			}}
			style={{ width: `${size + 10}px` }}
			className={cx(
				css`
					position: relative;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					user-select: none;
				`,
				clickable &&
					css`
						cursor: pointer;
					`
			)}
		>
			<img
				className={cx(
					css`
						height: auto;
						aspect-ratio: 1/1;
						object-fit: contain;
						vertical-align: bottom;
						transition-duration: 200ms;
						transition-property: filter;
						user-select: none;
						pointer-events: none;
						image-rendering: pixelated;
					`,
					status !== "normal" &&
						css`
							filter: opacity(0.4);
						`,
					status === "contain" &&
						css`
							filter: drop-shadow(0 0 4px var(--color-red)) drop-shadow(0 0 4px var(--color-red));
						`
				)}
				width={size}
				height={size}
				src={image}
				alt={text}
			/>
			{!nameHidden && (
				<div
					style={{ transform: `scale(${scaleX}, 1)` }}
					className={css`
						position: relative;
						text-align: center;
						white-space: nowrap;
						font-size: 13px;
						font-weight: bold;
						margin-top: 7px;
						z-index: 1;
					`}
				>
					{text}
				</div>
			)}
			{status === "unkown" && (
				<div
					className={css`
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						user-select: none;
						pointer-events: none;
					`}
				>
					<GoogleIcon color="rgba(0, 0, 0, 0.6)" name="question_mark" size={30} />
				</div>
			)}
			{status === "check" && (
				<div
					className={css`
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						user-select: none;
						pointer-events: none;
					`}
				>
					<GoogleIcon color="rgba(255, 0, 0, 0.8)" name="check_small" size={30} />
				</div>
			)}
			{status === "removable" && (
				<div
					className={css`
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						user-select: none;
						pointer-events: none;

						span {
							text-shadow: 0 0 5px white;
						}
					`}
				>
					<GoogleIcon color="#ffb11e" name="change_history" size={30} />
				</div>
			)}
		</div>
	);
}
