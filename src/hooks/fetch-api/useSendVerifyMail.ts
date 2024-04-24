import useFetchApi from "@/hooks/useFetchApi";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function () {
	const { fetchData, status: sendVerifyMailStatus } = useFetchApi();

	const sendVerifyMail = (userId: string): void => {
		void fetchData(
			"sendVerifyMail",
			{
				userId
			},
			{}
		);
	};

	return { sendVerifyMail, sendVerifyMailStatus };
}
