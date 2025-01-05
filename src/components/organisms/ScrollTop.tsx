"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function () {
	const pathname = usePathname();
	const params = useSearchParams();

	useEffect(() => {
		window.scrollTo(0, 0);

		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 25);
	}, [pathname, params]);

	return <></>;
}
