export const loadGoogleAds = (): void => {
	const root = document.querySelector("#root") as HTMLDivElement;
	const adsNum = (root.dataset.adsNum ?? "") === "" ? 0 : Number(root.dataset.adsNum);

	try {
		setTimeout(() => {
			if (process.env.NODE_ENV === "production") {
				const currentAdsNum = (root.dataset.adsNum ?? "") === "" ? 0 : Number(root.dataset.adsNum);
				if (adsNum === currentAdsNum) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
					(adsbygoogle = window.adsbygoogle || []).push({});
				}
			}
		}, 1000);
	} catch (e) {}
};
