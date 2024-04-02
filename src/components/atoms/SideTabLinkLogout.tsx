"use client";

import { SessionProvider, signOut } from "next-auth/react";
import SideTabLink from "@/components/atoms/SideTabLink";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	redirect?: string;
}

const SideTabLinkLogout = ({ children, redirect = "/" }: Props): JSX.Element => {
	return (
		<SideTabLink
			onClick={() => {
				void signOut({
					redirect: true,
					callbackUrl: redirect
				});
			}}
			icon="logout"
		>
			{children}
		</SideTabLink>
	);
};

export default function ({ children, redirect }: Props): JSX.Element {
	return (
		<SessionProvider>
			<SideTabLinkLogout redirect={redirect}>{children}</SideTabLinkLogout>
		</SessionProvider>
	);
}
