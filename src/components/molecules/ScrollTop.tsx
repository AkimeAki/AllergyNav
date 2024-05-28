"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function (): JSX.Element {
	const pathname = usePathname();

	useEffect(() => {
		const html = document.querySelector("html") as HTMLHtmlElement;
		html.scrollTo(0, 0);
	}, [pathname]);

	return <></>;
}
