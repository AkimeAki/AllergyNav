import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, AddUserResponse } from "@/type";

interface ReturnType {
	changePassword: (recoveryCode: string, password: string) => void;
	changePasswordStatus: FetchStatus;
	changePasswordResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const { fetchData, status: changePasswordStatus, responseStatus: changePasswordResponseStatus } = useFetchApi();

	const changePassword = (recoveryCode: string, password: string): void => {
		void fetchData(
			"changePassword",
			{
				recoveryCode
			},
			{
				password
			}
		);
	};

	return { changePassword, changePasswordStatus, changePasswordResponseStatus };
}
