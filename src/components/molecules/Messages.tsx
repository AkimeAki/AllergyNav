/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { messagesToggleState, messagesState } from "@/atoms/message";
import { useEffect } from "react";
import { deleteMessagesSelector, messagesSelector, messagesToggleSelector } from "@/selector/messages";

export default function (): JSX.Element {
	const messages = useRecoilValue(messagesState);
	const deleteMessages = useSetRecoilState(deleteMessagesSelector);
	// const messagesToggle = useRecoilValue(messagesToggleSelector);

	useEffect(() => {
		console.log(messages);
		setTimeout(() => {
			if (messages.length !== 0) {
				console.log("aaassd");
				deleteMessages();
			}
		}, 5000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	return (
		<div
			css={css`
				position: fixed;
				bottom: 10px;
				left: 10px;
				display: flex;
				flex-direction: column;
				gap: 10px;
				z-index: 999999;
			`}
		>
			{messages.map((item, index) => (
				<div
					key={index}
					css={css`
						background-color: ${item.status === "error" ? "#F44336" : "#66bb6a"};
						color: white;
						padding: 10px;
						border-color: ${item.status === "error" ? "#D32F2F" : "#4caf50"};
						border-style: solid;
						border-width: 3px;
					`}
				>
					{item.message}
				</div>
			))}
		</div>
	);
}
