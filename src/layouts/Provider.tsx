/** @jsxImportSource @emotion/react */
"use client";

import { RecoilRoot } from "recoil";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return <RecoilRoot>{children}</RecoilRoot>;
}
