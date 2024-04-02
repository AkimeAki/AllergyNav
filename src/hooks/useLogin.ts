import type { Message } from "@/type";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface ReturnType {
	response: boolean | undefined;
	loading: boolean;
	message: Message | undefined;
	login: (email: string, password: string) => Promise<void>;
}

export default function (): ReturnType {
	const [response, setResponse] = useState<boolean | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);

	const login = async (email: string, password: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			await signIn("credentials", {
				redirect: false,
				email,
				password
			}).then((res) => {
				if (res?.status === 401) {
					setMessage({
						type: "error",
						text: "メールアドレスかパスワードが違うようです"
					});
				} else if (res?.error != null) {
					throw new Error();
				} else {
					setResponse(true);
					setMessage({
						type: "success",
						text: "ログインできました"
					});
				}
			});
		} catch (e) {
			console.error(e);
			setResponse(false);
			setMessage({
				type: "error",
				text: "エラーが発生しました"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, login };
}
