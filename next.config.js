const { withKumaUI } = require("@kuma-ui/next-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true"
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "files.allergy-navi.com",
				port: "",
				pathname: "**"
			},
			{
				protocol: "https",
				hostname: process.env.FILES_HOSTNAME,
				port: "",
				pathname: "**"
			}
		]
	}
};

module.exports = withKumaUI(withBundleAnalyzer(nextConfig));
