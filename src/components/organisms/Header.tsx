import { css } from "@kuma-ui/core";
import Link from "next/link";
import Image from "next/image";

export default function (): JSX.Element {
	return (
		<>
			<header
				className={css`
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					background-color: var(--color-orange);
					height: 70px;
					z-index: 10;
				`}
			>
				<div
					className={css`
						display: flex;
						position: relative;
						align-items: center;
						justify-content: space-between;
						width: 100%;
						max-width: 1200px;
						margin: 0 auto;
						padding: 0 30px;
						height: 100%;
					`}
				>
					<h1
						className={css`
							height: 100%;
						`}
					>
						<Link
							href="/"
							className={css`
								display: flex;
								align-items: center;
								text-decoration: none;
								height: 100%;
								gap: 10px;
							`}
						>
							<Image
								src="/icons/allergy-nav.png"
								alt="アイコン"
								width={340}
								height={250}
								className={css`
									aspect-ratio: 340/250;
									width: 50px;
									font-size: 20px;
									height: auto;
								`}
							/>
							<div
								className={css`
									font-weight: 700;
									color: white;
								`}
							>
								アレルギーナビ
								<span
									className={css`
										font-weight: 700;
										color: white;
										margin-left: 5px;

										@media (max-width: 430px) {
											display: none;
										}
									`}
								>
									超β版
								</span>
							</div>
						</Link>
					</h1>
				</div>
			</header>
		</>
	);
}
