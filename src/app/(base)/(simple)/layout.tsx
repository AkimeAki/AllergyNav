import { type ReactNode } from "react";
import { css } from "@kuma-ui/core";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return <main>{children}</main>;
}
