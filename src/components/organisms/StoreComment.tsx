"use client";

import type { Comment } from "@/type";
import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import Loading from "@/components/atoms/Loading";
import SubTitle from "@/components/atoms/SubTitle";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import TextArea from "../atoms/TextArea";
import Button from "../atoms/Button";

interface Props {
	id: number;
}

export default function ({ id }: Props): JSX.Element {
	const [newCommentContent, setNewCommentContent] = useState<string>("");
	const [storeComments, setStoreComments] = useState<Comment[] | undefined>(undefined);
	const [newCommentTitle, setNewCommentTitle] = useState<string>("");
	const [isCommentSending, setIsCommentSending] = useState<boolean>(false);
	const [enableSendButton, setEnableSendButton] = useState<boolean>(false);

	useEffect(() => {
		if (newCommentContent !== "" && newCommentTitle !== "") {
			setEnableSendButton(true);
		} else {
			setEnableSendButton(false);
		}
	}, [newCommentContent, newCommentTitle]);

	const getStoreComments = async (): Promise<void> => {
		try {
			const storeCommentsFetchResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment?store=${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (storeCommentsFetchResult.status !== 200) {
				throw new Error();
			}

			const storeComments = await storeCommentsFetchResult.json();
			setStoreComments(storeComments);
		} catch (e) {}
	};

	const sendComment = async (): Promise<void> => {
		setIsCommentSending(true);
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					store: id,
					title: newCommentTitle,
					content: newCommentContent
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			setNewCommentTitle("");
			setNewCommentContent("");

			await getStoreComments();
		} catch (e) {}
		setIsCommentSending(false);
	};

	useEffect(() => {
		void getStoreComments();
	}, []);

	return (
		<>
			<SubTitle>コメントを書く</SubTitle>
			<form
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
					padding: 0 10px;

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
						disabled={isCommentSending}
						onChange={(e) => {
							setNewCommentTitle(e.target.value);
						}}
					/>
				</div>
				<div>
					<Label required>コメント</Label>
					<TextArea
						value={newCommentContent}
						disabled={isCommentSending}
						onChange={(e) => {
							setNewCommentContent(e.target.value);
						}}
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
							disabled={isCommentSending || !enableSendButton}
							onClick={() => {
								void sendComment();
							}}
						>
							送信する
						</Button>
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
				{storeComments === undefined ? (
					<Loading />
				) : (
					[...storeComments].reverse().map((item) => (
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
								className={css`
									white-space: preserve;
								`}
							>
								{item.content}
							</div>
							<div
								className={css`
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
					))
				)}
			</div>
		</>
	);
}
