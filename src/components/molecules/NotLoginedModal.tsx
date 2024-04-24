import Modal from "@/components/molecules/Modal";
import type { Dispatch, SetStateAction } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import { css } from "@kuma-ui/core";
import Button from "../atoms/Button";
import { usePathname } from "next/navigation";

interface Props {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ isOpen, setIsOpen }: Props): JSX.Element {
	const pathname = usePathname();

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
			<SubTitle>ログインしていません</SubTitle>
			<p
				className={css`
					text-align: center;
					margin: 30px 0;
				`}
			>
				ログインする必要があります
			</p>
			<div
				className={css`
					display: flex;
					gap: 20px;
					justify-content: center;
				`}
			>
				<div>
					<Button href={`/login?redirect=${pathname}`}>ログイン</Button>
				</div>
				<div>
					<Button href={`/register?redirect=${pathname}`}>アカウント作成</Button>
				</div>
			</div>
		</Modal>
	);
}
