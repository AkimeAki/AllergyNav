import { css } from "@kuma-ui/core";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import TopAllergenSearch from "@/components/organisms/TopAllergenSearch";

export default function (): JSX.Element {
	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 50px;
			`}
		>
			<section>
				<div>
					以下の中から
					<span
						className={css`
							font-weight: 900;
							text-decoration: underline;
							color: var(--color-red);
							margin: 0 5px;
							font-size: 20px;
						`}
					>
						食べられない物
					</span>
					にクリックして
					<span
						className={css`
							vertical-align: sub;
						`}
					>
						<GoogleIcon name="skull" size={25} color="var(--color-red)" />
					</span>
					マークを付けてください。
				</div>
				<TopAllergenSearch />
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
