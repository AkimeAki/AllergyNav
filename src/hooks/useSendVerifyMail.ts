import type { Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: boolean | undefined;
	loading: boolean;
	message: Message | undefined;
	sendVerifyMail: (id: string) => Promise<void>;
}

export default function (): ReturnType {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<boolean | undefined>(undefined);

	const sendVerifyMail = async (id: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}/verify`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			setResponse(true);
			setMessage({
				type: "success",
				text: "メールを送信しました。"
			});
		} catch (e) {
			setResponse(false);
			setMessage({
				type: "error",
				text: "エラーが発生しました"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, sendVerifyMail };
}
