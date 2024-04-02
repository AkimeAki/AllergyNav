import type { GetMenuHistoryResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<GetMenuHistoryResponse>;
	loading: boolean;
	message: Message | undefined;
	getMenuHistories: (menuId: number) => Promise<void>;
}

export default function (): ReturnType {
	const [loading, setLoading] = useState<boolean>(true);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<GetMenuHistoryResponse>>([]);

	const getMenuHistories = async (menuId: number): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse([]);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${menuId}/history`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as GetMenuHistoryResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "メニューの履歴を取得しました"
			});
		} catch (e) {
			setMessage({
				type: "error",
				text: "接続エラーが発生しました。"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, getMenuHistories };
}
