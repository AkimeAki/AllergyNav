import css from "./AllergyItem.module.scss";
import addIcon from "@/assets/icons/add_fill.svg";

interface Props {
	image: ImageMetadata;
	text: string;
	selected?: boolean;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function AllergyItem({ image, text, selected = false, onClick }: Props): JSX.Element {
	return (
		<div
			className={`soft ${css.item} ${selected ? "pressed" : ""}`}
			style={{ "--imageSrc": `url("${addIcon.src}")` }}
			onClick={onClick}
		>
			<img className={css.img} src={image.src} alt="" />
			<div className={css.name}>{text}</div>
		</div>
	);
}
