/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import Loading from "@/components/atoms/Loading";
import TextInput from "@/components/atoms/TextInput";
import { messagesSelector } from "@/selector/messages";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import SubTitle from "@/components/atoms/SubTitle";
import type { Comment } from "@/type";

interface Props {
	id: number;
}

export default function ({ id }: Props): JSX.Element {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSendLoading, setIsSendLoading] = useState<boolean>(false);
	const [newComment, setNewComment] = useState<string>("");
	const [newCommentLine, setNewCommentLine] = useState<number>(1);
	const [comments, setComments] = useState<Comment[]>([]);
	const [commentTitle, setCommentTitle] = useState<string>("");
	const [sendCommentTrigger, setSendCommentTrigger] = useState<boolean>(false);
	const setMessages = useSetRecoilState(messagesSelector);

	const clickButton = async (): Promise<void> => {
		try {
			setIsLoading(true);
			setIsSendLoading(true);
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					storeId: id,
					title: commentTitle,
					content: newComment
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			setCommentTitle("");
			setNewComment("");
			setNewCommentLine(1);
			setSendCommentTrigger((trigger) => {
				return !trigger;
			});
			setIsLoading(false);
			setIsSendLoading(false);

			setMessages({
				status: "success",
				message: "コメントを登録できました。"
			});
		} catch (e) {
			setMessages({
				status: "error",
				message: "コメントを登録できませんでした。"
			});
		}
	};

	useEffect(() => {
		const getComments = async (): Promise<void> => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment?storeId=${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (result.status !== 200) {
					throw new Error();
				}

				const response = await result.json();

				setComments(response.data);
				setIsLoading(false);
			} catch (e) {
				setMessages({
					status: "error",
					message: "コメント情報を取得できませんでした。"
				});
			}
		};

		void getComments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sendCommentTrigger]);

	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				gap: 30px;
			`}
		>
			<div>
				<p>
					アレルギーの方への対応や、アレルギー除去対応について等、
					<span
						css={css`
							color: var(--color-red);
							font-weight: 700;
							text-decoration: underline;
						`}
					>
						アレルギーに関することのみ記載
					</span>
					お願いします。
				</p>
				<p>アレルギーと関係ないコメントについては、他のグルメサイトをご利用ください。</p>
			</div>
			<SubTitle>コメントを書く</SubTitle>
			<div
				css={css`
					position: relative;
					opacity: ${isSendLoading ? "0.6" : "1"};
				`}
			>
				<form
					css={css`
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					<div>
						<Label>タイトル</Label>
						<TextInput
							value={commentTitle}
							onChange={(e) => {
								setCommentTitle(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label>コメント</Label>
						<textarea
							value={newComment}
							onChange={(e) => {
								setNewComment(e.target.value);
								setNewCommentLine(() => {
									const line = (e.target.value.match(/\r\n|\n|\r/g) ?? []).length + 1;
									return line;
								});
							}}
							css={css`
								width: 100%;
								height: calc(20px * ${newCommentLine} + (20px + 4px));
								resize: none;
								border-style: solid;
								border-width: 2px;
								border-color: var(--color-orange);
								margin-top: 10px;
								padding: 10px;
								line-height: 20px;
								font-size: 18px;
								transition-duration: 200ms;
								transition-property: border-color;
								overflow: hidden;

								&:focus {
									border-color: var(--color-green);
								}
							`}
						/>
					</div>
					<div>
						<Button
							onClick={() => {
								void clickButton();
							}}
						>
							送信する
						</Button>
					</div>
				</form>
				{isSendLoading && (
					<div
						css={css`
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							z-index: 999;
							cursor: wait;
						`}
					>
						<Loading />
					</div>
				)}
			</div>
			<SubTitle>コメント一覧</SubTitle>
			{isLoading ? (
				<Loading />
			) : (
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					{[...comments].reverse().map((item) => (
						<div
							key={item.id}
							css={css`
								position: relative;
								border-radius: 7px;
								border-width: 2px;
								border-style: solid;
								border-color: #f3f3f3;
								padding: 20px;
							`}
						>
							<h4
								css={css`
									font-size: 20px;
									font-weight: 700;
									border-bottom-style: solid;
									border-bottom-width: 2px;
									border-bottom-color: var(--color-orange);
									margin-bottom: 20px;
									padding: 5px 10px;
								`}
							>
								{item.title}
							</h4>
							<div
								css={css`
									white-space: preserve;
								`}
							>
								{item.content}
							</div>
							<div
								css={css`
									position: absolute;
									top: 10px;
									right: 10px;
									font-size: 15px;
									color: #5a5a5a;
								`}
							>
								ID:{item.id}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
