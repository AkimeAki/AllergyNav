"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function (): JSX.Element {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const root = document.querySelector("#root") as HTMLDivElement;
		root.scrollTo(0, 0);
	}, [pathname, searchParams]);

	return <></>;
}
