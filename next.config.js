const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = async (phase, { defaultConfig }) => {
	/** @type {import('next').NextConfig} */
	const baseConf = {
		eslint: {
			ignoreDuringBuilds: true,
		},
		experimental: {
			turbo: {
				rules: {
					"*.svg": {
						loaders: ["@svgr/webpack"],
						as: "*.js",
					},
				},
			},
		},
		images: {
			remotePatterns: [{ hostname: "*" }],
		},
		output: "standalone",
		productionBrowserSourceMaps: true,
		reactStrictMode: true,
		sassOptions: {
			logger: {
				warn: message => console.warn(message),
				debug: message => console.log(message),
			},
		},
		skipTrailingSlashRedirect: true,
		typescript: {
			ignoreBuildErrors: true,
		},
		webpack: (config, options) => {
			config.module.rules.push({
				test: /\.svg$/i,
				use: ["@svgr/webpack"],
			});

			return config;
		},
	};

	// Dev-specific settings
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		Object.assign(baseConf, {});
	} else {
		Object.assign(baseConf, {});
	}

	return baseConf;
};
