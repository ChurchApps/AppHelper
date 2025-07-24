import { CommonEnvironmentHelper, ApiHelper } from "@churchapps/helpers";
import { Locale } from "@churchapps/apphelper";

declare global {
	interface ImportMeta {
		readonly env: {
			readonly VITE_STAGE?: string;
			readonly MODE: string;
			readonly VITE_MESSAGING_API?: string;
			readonly VITE_MESSAGING_API_SOCKET?: string;
			readonly VITE_MEMBERSHIP_API?: string;
		}
	}
}

export class EnvironmentHelper {

	static init = () => {
		let stage = import.meta.env.VITE_STAGE;
		if (stage === undefined) stage = import.meta.env.MODE;
		//stage = "production"; // Force production for now

		CommonEnvironmentHelper.init(stage || "development");

		if (stage === "production") EnvironmentHelper.initProd();
		else if (stage === "staging") EnvironmentHelper.initStaging();
		else EnvironmentHelper.initDev();

		EnvironmentHelper.populateConfigs();
		Locale.init([]);
	}

	static initDev = () => {
		// Override with local development URLs if provided
		if (import.meta.env.VITE_MESSAGING_API) {
			CommonEnvironmentHelper.MessagingApi = import.meta.env.VITE_MESSAGING_API;
			CommonEnvironmentHelper.MessagingApiSocket = import.meta.env.VITE_MESSAGING_API_SOCKET || "ws://localhost:8087";
		}
		if (import.meta.env.VITE_MEMBERSHIP_API) {
			CommonEnvironmentHelper.MembershipApi = import.meta.env.VITE_MEMBERSHIP_API;
		}

		console.log("🔧 Development environment configured:");
		console.log("   MessagingApi:", CommonEnvironmentHelper.MessagingApi);
		console.log("   MembershipApi:", CommonEnvironmentHelper.MembershipApi);
	}

	static initStaging = () => {
		// No specific staging configuration needed
	}

	static initProd = () => {
		CommonEnvironmentHelper.GoogleAnalyticsTag = "G-P63T3JN4VE";
	}

	static populateConfigs = () => {
		ApiHelper.apiConfigs = [
			{ keyName: "AttendanceApi", url: CommonEnvironmentHelper.AttendanceApi, jwt: "", permissions: [] },
			{ keyName: "GivingApi", url: CommonEnvironmentHelper.GivingApi, jwt: "", permissions: [] },
			{ keyName: "MembershipApi", url: CommonEnvironmentHelper.MembershipApi, jwt: "", permissions: [] },
			{ keyName: "MessagingApi", url: CommonEnvironmentHelper.MessagingApi, jwt: "", permissions: [] },
			{ keyName: "ReportingApi", url: CommonEnvironmentHelper.ReportingApi, jwt: "", permissions: [] },
			{ keyName: "DoingApi", url: CommonEnvironmentHelper.DoingApi, jwt: "", permissions: [] },
			{ keyName: "ContentApi", url: CommonEnvironmentHelper.ContentApi, jwt: "", permissions: [] },
		];

		console.log("📡 API Configs populated:");
		ApiHelper.apiConfigs.forEach((config: any) => {
			console.log(`   ${config.keyName}: ${config.url}`);
		});
	}

}