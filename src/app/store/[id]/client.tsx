/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import type { Store } from "@/type";
import { messagesState } from "@/atoms/message";
import { useSetRecoilState } from "recoil";
import { siteTitle } from "@/definition";
import Link from "next/link";
import { messagesSelector } from "@/selector/messages";

interface Props {
	id: number;
}

export default function ({ id }: Props) {
	const [isLoading, setIsLoading] = useState(true);
	const [store, setStore] = useState<Store>({});
	const setMessages = useSetRecoilState(messagesSelector);

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const response = await result.json();
				const data = response.data;
				setStore(data);
				setIsLoading(false);
			} catch (e) {
				setMessages({
					status: "error",
					message: "接続エラーが発生しました。"
				});
			}
		};

		void getStore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div>{isLoading ? "load" : "ok"}</div>
			<div>{store.name}</div>
			<div>
				<Link href={`/store/${store.id}/edit`}>編集する</Link>
			</div>
		</>
	);
}
