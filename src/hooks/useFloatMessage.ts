import { css } from "@kuma-ui/core";

const style = css`
	--top-margin: 10px;
	position: fixed;
	top: var(--top-margin);
	left: 50%;
	transform: translateX(-50%) translateY(calc(-100% - var(--top-margin)));
	z-index: calc(infinity);
	width: 500px;
	padding: 10px;
	border-width: 4px;
	border-style: solid;
	font-weight: bold;
	overflow-wrap: break-word;
	border-radius: 15px;
	white-space: pre-line;
	transition-duration: 500ms;
	transition-property: transform;
	transition-timing-function: linear(
		0 0%,
		0 2.27%,
		0.02 4.53%,
		0.04 6.8%,
		0.06 9.07%,
		0.1 11.33%,
		0.14 13.6%,
		0.25 18.15%,
		0.39 22.7%,
		0.56 27.25%,
		0.77 31.8%,
		1 36.35%,
		0.89 40.9%,
		0.85 43.18%,
		0.81 45.45%,
		0.79 47.72%,
		0.77 50%,
		0.75 52.27%,
		0.75 54.55%,
		0.75 56.82%,
		0.77 59.1%,
		0.79 61.38%,
		0.81 63.65%,
		0.85 65.93%,
		0.89 68.2%,
		1 72.7%,
		0.97 74.98%,
		0.95 77.25%,
		0.94 79.53%,
		0.94 81.8%,
		0.94 84.08%,
		0.95 86.35%,
		0.97 88.63%,
		1 90.9%,
		0.99 93.18%,
		0.98 95.45%,
		0.99 97.73%,
		1 100%
	);
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
