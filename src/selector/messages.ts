import { messagesToggleState, messagesState } from "@/atoms/message";
import type { Message } from "@/type";
import { DefaultValue, selector } from "recoil";

export const messagesSelector = selector<Message>({
	key: "messagesSelector",
	get: ({ get }) => get(messagesState)[0],
	set: ({ set }, newValue) => {
		set(messagesState, (messages) => {
			if (!(newValue instanceof DefaultValue)) {
				set(messagesToggleState, (messagesToggle) => {
					return !messagesToggle;
				});

				const _messages = [...messages];
				_messages.push(newValue);
				return _messages;
			}

			return [];
		});
	}
});

export const deleteMessagesSelector = selector({
	key: "deleteMessagesSelector",
	get: () => {},
	set: ({ set }) => {
		set(messagesState, (messages) => {
			const _messages = [...messages];
			_messages.pop();

			return _messages;
		});
	}
});

export const messagesToggleSelector = selector({
	key: "messagesToggleSelector",
	get: ({ get }) => get(messagesToggleState),
	set: ({ set }) => {
		set(messagesToggleState, (messagesToggle) => {
			return !messagesToggle;
		});
	}
});
