import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, AddCommentResponse } from "@/type";

interface ReturnType {
	addComment: (storeId: string, title: string, content: string) => void;
	addCommentResponse: NonNullable<AddCommentResponse> | undefined;
	addCommentStatus: FetchStatus;
	addCommentResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: addCommentResponse,
		status: addCommentStatus,
		responseStatus: addCommentResponseStatus
	} = useFetchApi<AddCommentResponse>();

	const addComment = (storeId: string, title: string, content: string): void => {
		void fetchData(
			"addComment",
			{
				storeId
			},
			{
				title,
				content
			}
		);
	};

	return { addComment, addCommentResponse, addCommentStatus, addCommentResponseStatus };
}
