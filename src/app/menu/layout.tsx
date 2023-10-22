import Main from "@/layouts/Main";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return <Main>{children}</Main>;
}
