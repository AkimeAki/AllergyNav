import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, EditPictureResponse } from "@/type";

interface ReturnType {
	editPicture: (pictureId: string, description: string, menuId?: string) => void;
	editPictureResponse: NonNullable<EditPictureResponse> | undefined;
	editPictureStatus: FetchStatus;
	editPictureResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: editPictureResponse,
		status: editPictureStatus,
		responseStatus: editPictureResponseStatus
	} = useFetchApi<EditPictureResponse>();

	const editPicture = (pictureId: string, description: string, menuId?: string): void => {
		void fetchData(
			"editPicture",
			{ pictureId },
			{
				description,
				menuId
			}
		);
	};

	return { editPicture, editPictureResponse, editPictureStatus, editPictureResponseStatus };
}