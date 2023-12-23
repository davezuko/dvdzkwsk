import {getEnvVar} from "./_util.js"

const EXPECTED_BUCKETS = ["dvdzkwsk"] as const

export interface GCPConfig {
	projectId: string
	keyFilename: string
	serviceAccount: string
	buckets: {
		[key in (typeof EXPECTED_BUCKETS)[number]]: string
	}
}

export function getGCPConfig(): GCPConfig {
	const config: GCPConfig = {
		projectId: getEnvVar("GCLOUD_PROJECT_ID")!,
		keyFilename: "secrets/gcloud.keyfile.json",
		serviceAccount: getEnvVar("GCLOUD_SERVICE_ACCOUNT")!,
		buckets: Object.fromEntries(
			getEnvVar("GCLOUD_BUCKETS")!
				.split(",")
				.map((entry) => entry.split(":")),
		),
	}

	for (const bucket of EXPECTED_BUCKETS) {
		if (!config.buckets[bucket]) {
			throw new Error(`Missing bucket in .env: "${bucket}"`)
		}
	}

	return config
}
