import { safeString } from "@/libs/safe-type";
import type { GetUserResponse } from "@/type";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ReturnType {
	userId: string | null;
	userRole: string | null;
	status: "loading" | "authenticated" | "unauthenticated";
	userVerified: boolean | 403 | null;
}

export default function (): ReturnType {
	const { data: session, status: sessionStatus } = useSession();
	const [userId, setUserId] = useState<string | null>(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [userVerified, setUserVerified] = useState<boolean | null>(null);
	const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

	const getUser = async (id: string): Promise<void> => {
		try {
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

			setUserRole(role);
			setUserVerified(verified === 403 ? false : verified);
		} catch (e) {
			void signOut();
		}
	};

	useEffect(() => {
		const safeId = safeString(session?.user?.id);

		if (safeId !== null && sessionStatus === "authenticated") {
			setUserId(safeId);
		} else {
			setUserId(null);
		}
	}, [session, sessionStatus]);

	useEffect(() => {
		const safeId = safeString(session?.user?.id);
		if (safeId !== null && sessionStatus === "authenticated") {
			void getUser(safeId);
		}
	}, [session, sessionStatus]);

	useEffect(() => {
		if (sessionStatus === "authenticated" && userId !== null && userRole !== null && userVerified !== null) {
			setStatus("authenticated");
		} else if (sessionStatus === "unauthenticated") {
			setStatus("unauthenticated");
		}
	}, [sessionStatus, userId, userRole, userVerified]);

	return { userId, userRole, userVerified, status };
}
