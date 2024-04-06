"use client";

import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import Loading from "@/components/atoms/Loading";
import SubTitle from "@/components/atoms/SubTitle";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import FloatMessage from "@/components/atoms/FloatMessage";
import Cursor from "@/components/atoms/Cursor";
import useGetComments from "@/hooks/useGetComments";
import useAddComment from "@/hooks/useAddComment";
import { isEmptyString } from "@/libs/check-string";
import { formatText } from "@/libs/format-text";
import { usePathname } from "next/navigation";
import useGetUserData from "@/hooks/useGetUserData";
import { SessionProvider } from "next-auth/react";

interface Props {
	id: bigint;
}

const StoreComment = ({ id }: Props): JSX.Element => {
	const [newCommentContent, setNewCommentContent] = useState<string>("");
	const [newCommentTitle, setNewCommentTitle] = useState<string>("");
	const { response: comments, loading: getLoading, getComments } = useGetComments();
	const { response: addedComment, loading: addLoading, message: addMessage, addComment } = useAddComment();
	const pathname = usePathname();
	const { status } = useGetUserData();

	useEffect(() => {
		void getComments(id);
	}, []);

	useEffect(() => {
		if (addedComment !== undefined) {
			void getComments(id);
			setNewCommentTitle("");
			setNewCommentContent("");
		}
	}, [addedComment]);

	return (
		<>
			{addLoading && <Cursor cursor="wait" />}
			{addMessage !== undefined && addMessage.type === "error" && (
				<FloatMessage type="error">{addMessage.text}</FloatMessage>
			)}
			{addMessage !== undefined && addMessage.type === "success" && (
				<FloatMessage type="success" secounds={1.5}>
					{addMessage.text}
				</FloatMessage>
			)}
			<SubTitle>コメントを書く</SubTitle>
			<form
				className={css`
					padding: 0 10px;
					position: relative;
				`}
			>
				{status === "unauthenticated" && (
					<div
						className={css`
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							opacity: 0;
							transition-duration: 200ms;
							transition-property: opacity;
							background-color: white;
							border-radius: 30px;
							display: flex;
							justify-content: center;
							align-items: center;
							box-shadow: 0 0 10px -5px #969696;

							&:hover {
								opacity: 0.9;
							}
						`}
					>
						<div
							className={css`
								display: flex;
								flex-direction: column;
								gap: 30px;
							`}
						>
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
								`}
							>
								<div>
									<Button href={`/login?redirect=${pathname}`}>ログイン</Button>
								</div>
								<div>
									<Button href={`/register?redirect=${pathname}`}>アカウント作成</Button>
								</div>
							</div>
						</div>
					</div>
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
								if (status === "authenticated") {
									setNewCommentTitle(e.target.value);
								}
							}}
							disabled={getLoading || addLoading || status === "loading"}
						/>
					</div>
					<div>
						<Label required>コメント</Label>
						<TextArea
							autoSize
							value={newCommentContent}
							onChange={(e) => {
								if (status === "authenticated") {
									setNewCommentContent(e.target.value);
								}
							}}
							disabled={getLoading || addLoading || status === "loading"}
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
									if (status === "authenticated") {
										void addComment(id, newCommentTitle, newCommentContent);
									}
								}}
								disabled={
									getLoading ||
									isEmptyString(newCommentTitle) ||
									isEmptyString(newCommentContent) ||
									addLoading ||
									status === "loading" ||
									status === "unauthenticated"
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
				{getLoading && <Loading />}
				{!getLoading && (
					<>
						{comments.length === 0 && (
							<p
								className={css`
									text-align: center;
								`}
							>
								コメントが無いようです😿
							</p>
						)}
						{[...comments].reverse().map((item) => (
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
										border-bottom-color: var(--color-orange);
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
};

export default function ({ id }: Props): JSX.Element {
	return (
		<SessionProvider>
			<StoreComment id={id} />
		</SessionProvider>
	);
}
