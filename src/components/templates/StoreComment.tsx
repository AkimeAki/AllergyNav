"use client";

import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import Cursor from "@/components/atoms/Cursor";
import useGetComments from "@/hooks/fetch-api/useGetComments";
import useAddComment from "@/hooks/fetch-api/useAddComment";
import { isEmptyString } from "@/libs/check-string";
import { formatText } from "@/libs/format-text";
import { usePathname } from "next/navigation";
import useGetUserData from "@/hooks/useGetUserData";
import useSendVerifyMail from "@/hooks/fetch-api/useSendVerifyMail";
import StoreCommentBarrier from "@/components/molecules/StoreCommentBarrier";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";

interface Props {
	storeId: string;
}

export default function ({ storeId }: Props): JSX.Element {
	const [newCommentContent, setNewCommentContent] = useState<string>("");
	const [newCommentTitle, setNewCommentTitle] = useState<string>("");
	const { getCommentsResponse, getCommentsStatus, getComments } = useGetComments();
	const { addCommentStatus, addComment } = useAddComment();
	const pathname = usePathname();
	const { userStatus, userId, userVerified } = useGetUserData();
	const { sendVerifyMail, sendVerifyMailStatus } = useSendVerifyMail();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		getComments(storeId);
	}, []);

	useEffect(() => {
		if (addCommentStatus === "successed") {
			addMessage("コメントを登録しました！", "success");
			getComments(storeId);
			setNewCommentTitle("");
			setNewCommentContent("");
		}

		if (addCommentStatus === "failed") {
			addMessage("送信に失敗しました", "error");
		}
	}, [addCommentStatus]);

	return (
		<>
			{addCommentStatus === "loading" && <Cursor cursor="wait" />}
			<SubTitle>コメントを書く</SubTitle>
			<form
				className={css`
					padding: 0 10px;
					position: relative;
				`}
			>
				{userStatus === "unauthenticated" && (
					<StoreCommentBarrier>
						<p
							className={css`
								text-align: center;
							`}
						>
							コメントを書くには、ログインする必要があります
						</p>
						<div
							className={css`
								display: flex;
								gap: 20px;
								justify-content: center;

								@media (max-width: 500px) {
									flex-direction: column;
									align-items: center;

									& > div {
										display: flex;
										flex-direction: column;
										width: 100%;
									}
								}
							`}
						>
							<div>
								<Button href={`/login?redirect=${pathname}`}>ログイン</Button>
							</div>
							<div>
								<Button href={`/register?redirect=${pathname}`}>アカウント作成</Button>
							</div>
						</div>
					</StoreCommentBarrier>
				)}
				{userStatus === "authenticated" && userVerified === false && (
					<StoreCommentBarrier>
						<p
							className={css`
								text-align: center;
							`}
						>
							コメントを書くには、メール認証を完了する必要があります。
						</p>
						<div
							className={css`
								display: flex;
								gap: 20px;
								justify-content: center;

								@media (max-width: 500px) {
									flex-direction: column;
									align-items: center;
								}
							`}
						>
							<div>
								{sendVerifyMailStatus === "yet" && (
									<Button
										onClick={() => {
											sendVerifyMail(userId ?? "");
										}}
									>
										認証メールを再送信する
									</Button>
								)}
								{sendVerifyMailStatus === "loading" && <Button disabled>送信中</Button>}
								{sendVerifyMailStatus === "successed" && (
									<Button disabled>認証メールを送信しました</Button>
								)}
							</div>
						</div>
					</StoreCommentBarrier>
				)}

				<div
					className={css`
						display: flex;
						flex-direction: column;
						gap: 20px;

						& > div {
							display: flex;
							align-items: flex-start;
							flex-direction: column;
							gap: 10px;
						}
					`}
				>
					<div>
						<Label required>タイトル</Label>
						<TextInput
							value={newCommentTitle}
							onChange={(e) => {
								setNewCommentTitle(e.target.value);
							}}
							disabled={
								getCommentsStatus !== "successed" ||
								addCommentStatus === "loading" ||
								userStatus === "loading"
							}
							loading={
								getCommentsStatus !== "successed" ||
								addCommentStatus === "loading" ||
								userStatus === "loading"
							}
						/>
					</div>
					<div>
						<Label required>コメント</Label>
						<TextArea
							autoSize
							value={newCommentContent}
							onChange={(e) => {
								setNewCommentContent(e.target.value);
							}}
							disabled={
								getCommentsStatus !== "successed" ||
								addCommentStatus === "loading" ||
								userStatus === "loading"
							}
							loading={
								getCommentsStatus !== "successed" ||
								addCommentStatus === "loading" ||
								userStatus === "loading"
							}
						/>
					</div>
					<div>
						<div
							className={css`
								width: 100%;
								text-align: right;
							`}
						>
							<Button
								onClick={() => {
									addComment(storeId, newCommentTitle, newCommentContent);
								}}
								disabled={
									getCommentsStatus !== "successed" ||
									isEmptyString(newCommentTitle) ||
									isEmptyString(newCommentContent) ||
									addCommentStatus === "loading" ||
									userStatus !== "authenticated"
								}
								loading={
									getCommentsStatus !== "successed" ||
									addCommentStatus === "loading" ||
									userStatus !== "authenticated"
								}
							>
								送信する
							</Button>
						</div>
					</div>
				</div>
			</form>
			<SubTitle>コメント一覧</SubTitle>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
					padding: 0 10px;
				`}
			>
				{(getCommentsStatus === "loading" || getCommentsStatus === "yet") && <LoadingCircleCenter />}
				{getCommentsStatus === "successed" && (
					<>
						{getCommentsResponse?.length === 0 && (
							<p
								className={css`
									text-align: center;
								`}
							>
								コメントが無いようです😿
							</p>
						)}
						{[...(getCommentsResponse ?? [])].reverse().map((item) => (
							<div
								key={item.id}
								className={css`
									position: relative;
									border-radius: 7px;
									border-width: 2px;
									border-style: solid;
									border-color: #f3f3f3;
									padding: 20px;
								`}
							>
								<h4
									className={css`
										font-size: 20px;
										font-weight: 700;
										border-bottom-style: solid;
										border-bottom-width: 2px;
										border-bottom-color: var(--color-theme);
										margin-bottom: 20px;
										padding: 5px 0;
									`}
								>
									{item.title}
								</h4>
								<div
									dangerouslySetInnerHTML={{
										__html: formatText(item.content)
									}}
								/>
							</div>
						))}
					</>
				)}
			</div>
		</>
	);
}
