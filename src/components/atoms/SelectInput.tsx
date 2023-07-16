import css from "./SelectInput.module.css";

interface Props {
	width?: number;
	placeholder?: string;
	tags: string[];
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	selected?: boolean;
}

export default function SelectInput({
	width = 200,
	placeholder = "",
	tags,
	onClick,
	selected = false
}: Props): JSX.Element {
	return (
		<div
			onClick={onClick}
			className={`soft ${css.input} ${selected ? "pressed" : ""}`}
			style={{ width: `${width}px` }}
		>
			{tags.length === 0 ? <div className={css.placeholder}>{placeholder}</div> : ""}
			{tags.map((tag, index) => (
				<div className={`soft ${css.tag}`} key={index}>
					{tag}
				</div>
			))}
		</div>
	);
}
