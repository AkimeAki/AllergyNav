"use client";

import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import Label from "@/components/atoms/Label";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import useSendDeleteMenuRequest from "@/hooks/fetch-api/useSendDeleteMenuRequest";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import { isEmptyString } from "@/libs/check-string";

interface Props {
	menuId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	callback?: () => void;
}

export default function ({ menuId, isOpen, setIsOpen, callback }: Props): JSX.Element {
	const { sendDeleteMenuRequest, sendDeleteMenuRequestStatus } = useSendDeleteMenuRequest();
	const { addMessage } = useFloatMessage();
	const [reason, setReason] = useState<string>("");

	useEffect(() => {
		if (sendDeleteMenuRequestStatus === "successed") {
			addMessage("メニューの削除申請を送信しました！", "success");
			if (callback !== undefined) {
				callback();
			}
		}

		if (sendDeleteMenuRequestStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (sendDeleteMenuRequestStatus === "failed") {
			addMessage("削除申請の送信に失敗しました", "error");
		}
	}, [sendDeleteMenuRequestStatus]);

	useEffect(() => {
		if (!isOpen) {
			setReason("");
		}
	}, [isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			close={sendDeleteMenuRequestStatus !== "loading"}
			onOutsideClick={
				!isEmptyString(reason)
					? () => {
							const result = confirm("書き込み中のデータが消えますが、閉じても良いですか？");
							if (result) {
								setIsOpen(false);
							}
						}
					: undefined
			}
		>
			<SubTitle>メニューの削除申請</SubTitle>
			<form
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
					margin-top: 30px;

					& > div {
						display: flex;
						align-items: flex-start;
						flex-direction: column;
						gap: 10px;
					}
				`}
			>
				<div>
					<Label required>削除理由</Label>
					<TextArea
						disabled={sendDeleteMenuRequestStatus === "loading"}
						onChange={(e) => {
							setReason(e.target.value);
						}}
						value={reason}
						autoSize
					/>
				</div>
				<div>
					<div
						className={css`
							width: 100%;
							text-align: right;
						`}
					>
						<Button
							onClick={() => {
								sendDeleteMenuRequest(menuId, reason);
							}}
							disabled={sendDeleteMenuRequestStatus === "loading" || isEmptyString(reason)}
							loading={sendDeleteMenuRequestStatus === "loading"}
						>
							送信する
						</Button>
					</div>
				</div>
			</form>
		</Modal>
	);
}
