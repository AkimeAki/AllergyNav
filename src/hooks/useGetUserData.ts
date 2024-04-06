import { safeBigInt, safeString } from "@/libs/safe-type";
import type { GetUserResponse } from "@/type";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ReturnType {
	userId: bigint | null;
	userRole: string | null;
	status: "loading" | "authenticated" | "unauthenticated";
}

export default function (): ReturnType {
	const { data: session, status: sessionStatus } = useSession();
	const [userId, setUserId] = useState<bigint | null>(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

	const getUser = async (id: bigint): Promise<void> => {
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
			if (role === null) {
				throw new Error();
			}

			setUserRole(role);
		} catch (e) {}
	};

	useEffect(() => {
		console.log(session);
		const safeId = safeBigInt(session?.user?.id);

		if (safeId !== null && sessionStatus === "authenticated") {
			setUserId(safeId);
		} else {
			setUserId(null);
		}
	}, [session, sessionStatus]);

	useEffect(() => {
		const safeId = safeBigInt(session?.user?.id);
		if (safeId !== null && sessionStatus === "authenticated") {
			void getUser(safeId);
		}
	}, [session, sessionStatus]);

	useEffect(() => {
		if (sessionStatus === "authenticated" && userId !== null && userRole !== null) {
			setStatus("authenticated");
		} else if (sessionStatus === "unauthenticated") {
			setStatus("unauthenticated");
		}
	}, [sessionStatus, userId, userRole]);

	return { userId, userRole, status };
}
