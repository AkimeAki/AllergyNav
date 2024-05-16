import { css } from "@kuma-ui/core";
import Link from "next/link";
import Image from "next/image";
import NotVerifiedHeaderMessage from "@/components/molecules/NotVerifiedHeaderMessage";

export default function (): JSX.Element {
	return (
		<>
			<NotVerifiedHeaderMessage />
			<header
				className={css`
					width: 100%;
					height: 140px;
					z-index: 10;

					@media (max-width: 880px) {
						height: 60px;
					}
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
							display: flex;
							align-items: center;
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
								width={256}
								height={269}
								className={css`
									aspect-ratio: 256/269;
									width: auto;
									font-size: 20px;
									height: 40px;
								`}
							/>
							<div
								className={css`
									font-weight: 700;
								`}
							>
								アレルギーナビ
								<span
									className={css`
										font-weight: 700;
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
