import { css } from "@kuma-ui/core";
import JsonLD from "@/components/atoms/JsonLD";
import TopSearchArea from "@/components/organisms/TopSearchArea";

export default async function (): Promise<JSX.Element> {
	return (
		<>
			<JsonLD />
			<div
				className={css`
					display: flex;
					gap: 50px;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 500px;

					@media (max-width: 860px) {
						font-size: 5.5cqw;
						gap: 0;
						height: auto;
						padding-bottom: 30px;
					}
				`}
			>
				<h1
					className={css`
						font-size: 40px;
						font-weight: bold;
						user-select: none;

						@media (max-width: 860px) {
							font-size: 4.3cqw;
							margin: 70px 0;
						}

						@media (max-width: 670px) {
							font-size: 5.5cqw;
						}
					`}
				>
					アレルギーの方向けの グルメナビ
					<br />
					<span
						className={css`
							display: block;
							font-size: 20px;
							font-weight: bold;
							text-align: right;
							color: var(--color-theme);

							@media (max-width: 860px) {
								font-size: 2.3cqw;
							}
						`}
					>
						& グルメwiki
					</span>
				</h1>
				<div
					className={css`
						width: 100%;
						padding: 0 30px;
					`}
				>
					<TopSearchArea />
				</div>
			</div>
			<section
				className={css`
					display: flex;
					flex-direction: column;
					gap: 10px;
					max-width: 1200px;
					margin: 0 auto;
					padding: 0 30px;
				`}
			>
				<p>
					『アレルギーナビ』は、アレルギーの方々が少しでも多く、食べに行ける飲食店が見つけられるように作ったサービスです。
				</p>
				<p>
					どこかの飲食店のアレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。
				</p>
				<p>
					現在超β版なので、今後どんどん機能追加予定です。欲しい機能の要望ありましたら、メールやTwitterなど連絡が取れる手段であれば何でも良いので連絡ください。
				</p>
				<p>今後追加予定の機能</p>
				<ul
					className={css`
						margin-top: 20px;
					`}
				>
					<li>もっとアレルゲン追加</li>
					<li>お気に入り機能</li>
					<li>閲覧履歴機能</li>
					<li>アレルギー情報提供の貢献度に応じた広告の非表示</li>
				</ul>
				<p>
					アップデート情報は
					<a href="https://blog.aki.wtf/category/allergy-navi" target="_blank">
						開発者のブログ
					</a>
					にて確認することができます。
				</p>
			</section>
		</>
	);
}
