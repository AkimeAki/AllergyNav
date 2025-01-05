"use client";

import checkBrowser from "@akimeaki/check-browser";
import { useEffect } from "react";

export default function () {
	useEffect(() => {
		const data = checkBrowser();
		document.body.dataset.browser = data.browser;
		document.body.dataset.browserType = data.type;
		document.body.dataset.os = data.os;
		document.body.dataset.browerVersion = String(data.version);
	}, []);

	return <></>;
}
