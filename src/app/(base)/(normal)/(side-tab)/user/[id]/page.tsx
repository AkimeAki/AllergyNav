interface Props {
	params: {
		id: string;
	};
}

export default async function ({ params }: Props): Promise<JSX.Element> {
	return (
		<div>
			<p>実装をお待ち下さい</p>
		</div>
	);
}
