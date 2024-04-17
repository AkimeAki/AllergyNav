import { css } from "@kuma-ui/core";
import FooterLink from "../molecules/FooterLink";

export default function (): JSX.Element {
	return (
		<footer
			className={css`
				background-color: var(--color-theme-thin);
				color: var(--color-white);
				padding: 60px 0;

				@media (max-width: 880px) {
					padding-bottom: 140px;
				}
			`}
		>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					align-items: cneter;
					justify-content: center;
					gap: 30px;
					height: 100%;
				`}
			>
				<div
					className={css`
						display: inline-block;
						text-align: center;
					`}
				>
					Created by 彩季
				</div>
				<div
					className={css`
						display: flex;
						justify-content: center;
						text-align: center;
						gap: 20px;
					`}
				>
					<FooterLink href="https://twitter.com/Akime_Aki" name="twitter" />
					<FooterLink href="https://twitter.com/Akime_Aki" name="x" />
					<FooterLink href="https://github.com/AkimeAki/AllergyNav" name="github" />
				</div>
			</div>
		</footer>
	);
}
