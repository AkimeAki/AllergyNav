import Modal from "@/components/molecules/Modal";
import type { Dispatch, SetStateAction } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import { css } from "@kuma-ui/core";
import Button from "../atoms/Button";
import useSendVerifyMail from "@/hooks/fetch-api/useSendVerifyMail";

interface Props {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	userId: string;
}

export default function ({ isOpen, setIsOpen, userId }: Props): JSX.Element {
	const { sendVerifyMail, sendVerifyMailStatus } = useSendVerifyMail();

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
			<SubTitle>メール認証が完了していません</SubTitle>
			<p
				className={css`
					text-align: center;
					margin: 30px 0;
				`}
			>
				メール認証を完了する必要があります。
			</p>
			<div
				className={css`
					display: flex;
					justify-content: center;
				`}
			>
				<div>
					{sendVerifyMailStatus === "yet" && (
						<Button
							onClick={() => {
								sendVerifyMail(userId);
							}}
						>
							認証メールを再送信する
						</Button>
					)}
					{sendVerifyMailStatus === "loading" && <Button disabled>送信中</Button>}
					{sendVerifyMailStatus === "successed" && <Button disabled>認証メールを送信しました</Button>}
				</div>
			</div>
		</Modal>
	);
}
