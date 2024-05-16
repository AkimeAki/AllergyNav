"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function (): JSX.Element {
	const pathname = usePathname();

	useEffect(() => {
		const root = document.querySelector("#root") as HTMLDivElement;
		root.scrollTo(0, 0);
	}, [pathname]);

	return <></>;
}
