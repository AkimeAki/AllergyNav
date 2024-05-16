export const loadGoogleAds = (): void => {
	try {
		setTimeout(() => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
			(adsbygoogle = window.adsbygoogle || []).push({});
		}, 500);
	} catch (e) {}
};
