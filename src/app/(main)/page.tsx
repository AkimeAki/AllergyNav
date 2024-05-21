import { css } from "@kuma-ui/core";
import { getAllergens } from "@/libs/server-fetch";
import TopSearch from "@/components/organisms/TopSearch";

export default async function (): Promise<JSX.Element> {
	const allergens = await getAllergens();

	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 50px;
			`}
		>
			<section>
				<TopSearch allergens={allergens} />
			</section>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
				`}
			>
				<section>
					<p>
						『アレルギーナビ』は、アレルギーの方々が少しでも多く、食べに行ける飲食店が見つけられるように作ったサービスです。
					</p>
				</section>
				<section>
					<p>
						どこかの飲食店のアレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。
					</p>
				</section>
				<section>
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
						<li>ラベル機能</li>
						<li>お気に入り機能</li>
						<li>閲覧履歴機能</li>
					</ul>
				</section>
			</div>
		</div>
	);
}
