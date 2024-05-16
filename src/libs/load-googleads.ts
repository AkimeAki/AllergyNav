export const loadGoogleAds = (): void => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (adsbygoogle && !adsbygoogle.loaded) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
		(adsbygoogle = window.adsbygoogle || []).push({});
	}
};
