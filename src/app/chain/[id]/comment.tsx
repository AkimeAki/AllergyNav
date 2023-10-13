/** @jsxImportSource @emotion/react */
"use client";

import Loading from "@/components/atoms/Loading";
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
	const [comments, setComments] = useState<Comment[]>([]);
	const setMessages = useSetRecoilState(messagesSelector);

	useEffect(() => {
		const getComments = async (): Promise<void> => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment?chainId=${id}`, {
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
	}, []);

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
					されています。
				</p>
				<p>アレルギーと関係ないコメントについては、他のグルメサイトをご利用ください。</p>
				<p>コメントの記入はそれぞれのお店のページで記入してください。</p>
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
