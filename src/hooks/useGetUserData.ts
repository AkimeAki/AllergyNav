import { safeString } from "@/libs/safe-type";
import type { GetUserResponse } from "@/type";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface ReturnType {
	userId: string | null;
	userRole: string | null;
	status: "loading" | "authenticated" | "unauthenticated";
	userVerified: boolean | 403 | null;
}

export default function (): ReturnType {
	const [userId, setUserId] = useState<string | null>(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [userVerified, setUserVerified] = useState<boolean | null>(null);
	const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

	const getUser = async (): Promise<void> => {
		setStatus("loading");
		setUserRole(null);
		setUserVerified(null);
		setUserId(null);

		try {
			const session = await getSession();

			if (session === null) {
				setStatus("unauthenticated");
			} else {
				const id = safeString(session.user?.id);

				if (id === null) {
					throw new Error();
				}

				const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (result.status !== 200) {
					throw new Error();
				}

				const response = (await result.json()) as GetUserResponse;

				const role = safeString(response?.role);
				const verified = response?.verified === undefined ? null : response?.verified;
				if (role === null || verified === null) {
					throw new Error();
				}

				setUserId(id);
				setUserRole(role);
				setUserVerified(verified === 403 ? false : verified);
			}
		} catch (e) {
			setUserRole(null);
			setUserVerified(null);
			setUserId(null);
			void signOut();
		}
	};

	useEffect(() => {
		if (userId !== null && userRole !== null && userVerified !== null) {
			setStatus("authenticated");
		} else {
			setStatus("unauthenticated");
		}
	}, [userId, userRole, userVerified]);

	useEffect(() => {
		void getUser();
	}, []);

	return { userId, userRole, userVerified, status };
}
