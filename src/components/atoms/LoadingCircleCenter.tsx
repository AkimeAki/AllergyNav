import { css } from "@kuma-ui/core";
import LoadingCircle from "@/components/atoms/LoadingCircle";

export default function (): JSX.Element {
	return (
		<div
			className={css`
				position: relative;
				padding: 20px 0;
			`}
		>
			<div
				className={css`
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				`}
			>
				<LoadingCircle size={36} />
			</div>
		</div>
	);
}
