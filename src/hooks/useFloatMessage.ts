import { css } from "@kuma-ui/core";

const style = css`
	--top-margin: 10px;
	position: fixed;
	top: var(--top-margin);
	left: 50%;
	transform: translateX(-50%) translateY(calc(-100% - var(--top-margin)));
	z-index: calc(infinity);
	max-width: 500px;
	width: calc(100% - 40px);
	line-height: 1;
	padding: 10px;
	color: #656565;
	border-width: 4px;
	border-style: solid;
	font-weight: bold;
	overflow-wrap: break-word;
	border-radius: 15px;
	white-space: pre-line;
	transition-duration: 200ms;
	transition-property: transform;
	transition-timing-function: linear;
`;

const errorStyle = css`
	border-color: #ff6565;
	background-color: #ffd1d1;
`;

const successStyle = css`
	border-color: #77ff65;
	background-color: #d6ffd1;
`;

const viewStyle = css`
	transform: translateX(-50%) translateY(0);
`;

const hideStyle = css`
	transform: translateX(-50%) translateY(calc(-100% - var(--top-margin) - 20px));
`;

const hideMessage = (): void => {
	const messages = document.querySelectorAll<HTMLDivElement>(".float-message");
	messages.forEach((message) => {
		message.classList.add(hideStyle);
	});
};

const deleteOldMessage = (): void => {
	const oldMessages = document.querySelectorAll<HTMLDivElement>(".float-message");
	oldMessages.forEach((oldMessage) => {
		oldMessage.remove();
	});
};

export const useFloatMessage = () => {
	const addMessage = (text: string, type: "success" | "error", secounds: number | "path" = 5): void => {
		deleteOldMessage();

		document.body.insertAdjacentHTML(
			"afterbegin",
			/* html */ `
				<div class="float-message ${style} ${type === "success" ? successStyle : errorStyle}">${text}</div>
			`
		);

		setTimeout(() => {
			const messages = document.querySelectorAll<HTMLDivElement>(".float-message");
			messages.forEach((message) => {
				message.classList.add(viewStyle);
			});
		}, 10);

		if (typeof secounds === "number") {
			setTimeout(hideMessage, secounds * 1000);
			setTimeout(deleteOldMessage, secounds * 1000 + 600);
		}

		if (secounds === "path") {
			const currentPath = location.pathname;
			const observer = new MutationObserver(() => {
				if (currentPath !== location.pathname) {
					hideMessage();
					setTimeout(deleteOldMessage, 600);
					observer.disconnect();
				}
			});

			observer.observe(document.body, { childList: true, subtree: true });
		}
	};

	return { addMessage };
};
