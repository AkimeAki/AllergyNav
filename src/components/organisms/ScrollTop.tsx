"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function () {
	const pathname = usePathname();

	useEffect(() => {
		if (document.body.dataset.browser !== undefined && document.body.dataset.browser === "safari") {
			window.scrollTo(0, 0);

			setTimeout(() => {
				window.scrollTo(0, 0);
			}, 25);
		}
	}, [pathname]);

	return <></>;
}
