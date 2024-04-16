import type { GetCommentsResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<GetCommentsResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	getComments: (storeId: string) => Promise<void>;
}

export default function (): ReturnType {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<GetCommentsResponse> | undefined>(undefined);

	const getComments = async (storeId: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${storeId}/comment`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as GetCommentsResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "コメントを取得しました🐥"
			});
		} catch (e) {
			setResponse(undefined);

			setMessage({
				type: "error",
				text: "接続エラーが発生しました😿"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, getComments };
}
