import { ValidationError } from "@/definition";
import type { EditMenuResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<EditMenuResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	editMenu: (menuId: bigint, name: string, description: string, allergens: string[]) => Promise<void>;
}

export default function (): ReturnType {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<EditMenuResponse> | undefined>(undefined);

	const editMenu = async (menuId: bigint, name: string, description: string, allergens: string[]): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${menuId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					description,
					allergens: JSON.stringify(allergens)
				})
			});

			if (result.status === 422) {
				throw new ValidationError("入力値が正しくありません。");
			}

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as EditMenuResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "メニューを登録しました"
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

	return { response, loading, message, editMenu };
}
