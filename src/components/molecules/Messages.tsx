/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { messagesSetToggleState, messagesState } from "@/atoms/message";
import { useEffect } from "react";

export default function Messages(): JSX.Element {
	const [messages, setMessages] = useRecoilState(messagesState);
	const messagesToggle = useRecoilValue(messagesSetToggleState);

	useEffect(() => {
		setTimeout(() => {
			setMessages((messages) => {
				const _messages = [...messages];
				_messages.pop();

				return _messages;
			});
		}, 5000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messagesToggle]);

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
