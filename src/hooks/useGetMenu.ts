import type { GetMenuResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<GetMenuResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	getMenu: (menuId: number) => Promise<void>;
}

export default function (): ReturnType {
	const [loading, setLoading] = useState<boolean>(true);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<GetMenuResponse> | undefined>(undefined);

	const getMenu = async (menuId: number): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${menuId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as GetMenuResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "メニューを取得しました"
			});
		} catch (e) {
			setMessage({
				type: "error",
				text: "接続エラーが発生しました。"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, getMenu };
}
