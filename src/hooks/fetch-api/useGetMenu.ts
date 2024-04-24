import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, GetMenuResponse } from "@/type";

interface ReturnType {
	getMenu: (menuId: string) => void;
	getMenuResponse: NonNullable<GetMenuResponse> | undefined;
	getMenuStatus: FetchStatus;
	getMenuResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: getMenuResponse,
		status: getMenuStatus,
		responseStatus: getMenuResponseStatus
	} = useFetchApi<GetMenuResponse>();

	const getMenu = (menuId: string): void => {
		void fetchData(
			"getMenu",
			{
				menuId
			},
			{}
		);
	};

	return { getMenu, getMenuResponse, getMenuStatus, getMenuResponseStatus };
}
