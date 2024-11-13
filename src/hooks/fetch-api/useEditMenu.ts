import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, EditMenuResponse, AllergenStatusValue } from "@/type";

interface ReturnType {
	editMenu: (
		menuId: string,
		name: string,
		description: string,
		allergens: Record<string, AllergenStatusValue>
	) => void;
	editMenuResponse: NonNullable<EditMenuResponse> | undefined;
	editMenuStatus: FetchStatus;
	editMenuResponseStatus: number | undefined;
	editMenuReset: () => void;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: editMenuResponse,
		status: editMenuStatus,
		responseStatus: editMenuResponseStatus,
		reset: editMenuReset
	} = useFetchApi<EditMenuResponse>();

	const editMenu = (
		menuId: string,
		name: string,
		description: string,
		allergens: Record<string, AllergenStatusValue>
	): void => {
		void fetchData(
			"editMenu",
			{
				menuId
			},
			{
				name,
				description,
				allergens: JSON.stringify(allergens)
			}
		);
	};

	return { editMenu, editMenuResponse, editMenuStatus, editMenuResponseStatus, editMenuReset };
}
