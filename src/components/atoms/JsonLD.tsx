import { defaultDescription, siteTitle, siteUrl } from "@/definition";
import Script from "next/script";

interface Props {
	description?: string;
}

export default function ({ description = defaultDescription }: Props) {
	const jsonld = [
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: siteTitle,
			alternateName: siteTitle,
			description,
			url: siteUrl,
			publisher: {
				"@type": "Organization",
				name: siteTitle,
				url: siteUrl,
				logo: {
					"@type": "ImageObject",
					url: `${siteUrl}/icon512.png`,
					width: 512,
					height: 512
				}
			},
			image: {
				"@type": "ImageObject",
				url: `${siteUrl}/icon512.png`,
				width: 512,
				height: 512
			}
		}
	];

	return (
		<>
			{jsonld.map((json, index) => (
				<Script
					id={`jsonld-${index}`}
					key={index}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
				/>
			))}
		</>
	);
}
