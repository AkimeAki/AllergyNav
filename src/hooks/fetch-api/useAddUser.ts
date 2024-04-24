import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, AddUserResponse } from "@/type";

interface ReturnType {
	addUser: (email: string, password: string) => void;
	addUserResponse: NonNullable<AddUserResponse> | undefined;
	addUserStatus: FetchStatus;
	addUserResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: addUserResponse,
		status: addUserStatus,
		responseStatus: addUserResponseStatus
	} = useFetchApi<AddUserResponse>();

	const addUser = (email: string, password: string): void => {
		void fetchData(
			"addUser",
			{},
			{
				email,
				password
			}
		);
	};

	return { addUser, addUserResponse, addUserStatus, addUserResponseStatus };
}
