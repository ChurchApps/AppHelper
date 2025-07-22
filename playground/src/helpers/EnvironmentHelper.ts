import { CommonEnvironmentHelper, ApiHelper } from "@churchapps/helpers";
import { Locale } from "@churchapps/apphelper";

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_STAGE?: string;
      readonly MODE: string;
      readonly VITE_MESSAGING_API?: string;
      readonly VITE_MESSAGING_API_SOCKET?: string;
    }
  }
}

export class EnvironmentHelper {

  static init = () => {
    let stage = import.meta.env.VITE_STAGE;
    if (stage === undefined) stage = import.meta.env.MODE;
    if (stage === "production") EnvironmentHelper.initProd();
    else if (stage === "staging") EnvironmentHelper.initStaging();
    else EnvironmentHelper.initDev();
    
    CommonEnvironmentHelper.init(stage || "development");
    EnvironmentHelper.populateConfigs();
    Locale.init([]);
  }

  static initDev = () => {
    EnvironmentHelper.initStaging();
    // Override with local development URLs if provided
    if (import.meta.env.VITE_MESSAGING_API) {
      CommonEnvironmentHelper.MessagingApi = import.meta.env.VITE_MESSAGING_API;
      CommonEnvironmentHelper.MessagingApiSocket = import.meta.env.VITE_MESSAGING_API_SOCKET || "ws://localhost:8087";
    }
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
    ];
  }

}