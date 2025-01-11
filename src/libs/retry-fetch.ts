export const retryFetch = async (url: string, init: RequestInit, n: number): Promise<Response> => {
	try {
		console.log("fetch count=", n);
		return await fetch(url, init);
	} catch (error) {
		await new Promise((r) => setTimeout(r, 3000));

		if (n === 1) {
			throw error;
		}

		return await retryFetch(url, init, n - 1);
	}
};
