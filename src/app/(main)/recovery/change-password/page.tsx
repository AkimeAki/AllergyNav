import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import { prisma } from "@/libs/prisma";
import { safeString } from "@/libs/safe-type";
import { seoHead } from "@/libs/seo";
import ChangePasswordForm from "@/components/templates/ChangePasswordForm";

export const metadata: Metadata = seoHead({ title: "メール認証", canonicalPath: "/verified" });
export const dynamic = "force-dynamic";

interface Props {
	searchParams: Record<string, string | string[] | undefined>;
}

export default async function ({ searchParams }: Props): Promise<JSX.Element> {
	let text = "";
	let isPossibleRecovery = false;
	let recoveryCode = "";

	try {
		const recoveryCodeParam = safeString(searchParams.code);

		if (recoveryCodeParam === null) {
			text = "リカバリーコードが見つかりませんでした";
			throw new Error();
		}

		await prisma.$transaction(async (prisma) => {
			const userRecoveryCodeResult = await prisma.userRecoveryCode.findUnique({
				select: {
					id: true,
					created_at: true,
					email: true
				},
				where: {
					code: recoveryCodeParam
				}
			});

			if (userRecoveryCodeResult === null) {
				text = "リカバリーコードが見つかりませんでした";
				throw new Error();
			}

			// 対象のアドレスで認証済みのユーザーを取得
			const userResult = await prisma.user.findFirst({
				select: { id: true },
				where: { email: userRecoveryCodeResult.email, verified: true, deleted: false }
			});

			// 対象のアドレスのユーザーが存在しない場合はエラー
			if (userResult === null) {
				text = "リカバリーコードが見つかりませんでした";
				throw new Error();
			}

			// 有効期限チェック
			const createdAt = new Date(userRecoveryCodeResult.created_at).getTime() / 1000;
			const now = new Date().getTime() / 1000;

			if (now - createdAt > 7 * 24 * 60 * 60) {
				text = "リカバリーコードの有効期限が切れています";
				throw new Error();
			}
		});

		recoveryCode = recoveryCodeParam;
		isPossibleRecovery = true;
	} catch (e) {
		console.log(e);
	}

	return (
		<div
			className={css`
				width: 100%;
				max-width: 500px;
				margin: 0 auto;
			`}
		>
			{text !== "" && <p>{text}</p>}
			{isPossibleRecovery && <ChangePasswordForm recoveryCode={recoveryCode} />}
		</div>
	);
}
