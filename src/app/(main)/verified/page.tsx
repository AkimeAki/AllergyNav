import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import { prisma } from "@/libs/prisma";
import { safeString } from "@/libs/safe-type";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import Script from "next/script";
import { seoHead } from "@/libs/seo";

export const metadata: Metadata = seoHead({ title: "メール認証" });

interface Props {
	searchParams: Record<string, string | string[] | undefined>;
}

export default async function ({ searchParams }: Props): Promise<JSX.Element> {
	let text = "認証に失敗しました";
	let verified = false;

	try {
		const session = await getServerSession(nextAuthOptions);
		const userId = safeString(session?.user?.id);

		if (userId === null) {
			text = "ログアウトされています。ログインして、再度メールに届いたリンクをクリックしてください";
			throw new Error();
		}

		const verifyCode = safeString(searchParams.code);

		if (verifyCode === null) {
			text = "認証コードが見つかりませんでした";
			throw new Error();
		}

		await prisma.$transaction(async (prisma) => {
			// 認証コードとログインしているユーザーIDから、認証コードの作成日を取得
			const userVerifyCodeResult = await prisma.userVerifyCode.findUnique({
				select: {
					user_id: true,
					created_at: true
				},
				where: { code: verifyCode, user_id: userId }
			});

			if (userVerifyCodeResult === null) {
				text = "認証コードの有効期限が切れています";
				throw new Error();
			}

			// 有効期限チェック
			const createdAt = new Date(userVerifyCodeResult.created_at).getTime() / 1000;
			const now = new Date().getTime() / 1000;

			if (now - createdAt > 7 * 24 * 60 * 60) {
				text = "認証コードの有効期限が切れています";
				throw new Error();
			}

			// ユーザーを認証済みにする
			await prisma.user.update({
				data: {
					verified: true
				},
				where: { id: userId }
			});

			// 認証したユーザーの認証コードを削除
			await prisma.userVerifyCode.delete({
				where: { user_id: userId }
			});
		});

		text = "認証完了しました！";
		verified = true;
	} catch (e) {
		console.log(e);
	}

	return (
		<div
			className={css`
				width: 100%;
				max-width: 800px;
				margin: 0 auto;
			`}
		>
			<p>{text}</p>
			{verified && (
				<>
					<p>5秒後にトップページに自動でリダイレクトします。</p>
					<Script id="redirect-top">
						{`setTimeout(() => {
							window.location.href = '/';
						}, 5000);`}
					</Script>
				</>
			)}
		</div>
	);
}
