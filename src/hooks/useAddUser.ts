import type { AddUserResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<AddUserResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	addUser: (email: string, password: string) => Promise<void>;
}

export default function (): ReturnType {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<AddUserResponse> | undefined>(undefined);

	const addUser = async (email: string, password: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					email,
					password
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as AddUserResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "ユーザーを登録できました"
			});
		} catch (e) {
			setResponse(undefined);

			setMessage({
				type: "error",
				text: "エラーが発生しました"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, addUser };
}
