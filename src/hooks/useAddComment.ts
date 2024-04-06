import { ValidationError } from "@/definition";
import type { AddCommentResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<AddCommentResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	addComment: (storeId: string, title: string, content: string) => Promise<void>;
}

export default function (): ReturnType {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<AddCommentResponse> | undefined>(undefined);

	const addComment = async (storeId: string, title: string, content: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${storeId}/comment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					title,
					content
				})
			});

			if (result.status === 422) {
				throw new ValidationError();
			}

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as AddCommentResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "コメントを登録しました"
			});
		} catch (e) {
			if (e instanceof ValidationError) {
				setMessage({
					type: "error",
					text: "入力した値がおかしいです"
				});
			} else {
				setMessage({
					type: "error",
					text: "接続エラーが発生しました"
				});
			}
		}
		setLoading(false);
	};

	return { response, loading, message, addComment };
}
