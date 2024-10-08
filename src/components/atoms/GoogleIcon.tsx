interface Props {
	name: string;
	size: number;
	color: string;
}

export default function ({ name, size, color }: Props): JSX.Element {
	return (
		<span style={{ color, fontSize: `${size}px` }} className="material-symbols-outlined">
			{name}
		</span>
	);
}
