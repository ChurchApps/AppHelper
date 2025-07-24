import { ErrorLogInterface, ErrorAppDataInterface } from "@churchapps/helpers";
import { ApiHelper } from "@churchapps/helpers";


export class ErrorHelper {

	static getAppData: () => { churchId: string, userId: string, originUrl: string, application: string };
	static customErrorHandler: (errorLog: ErrorLogInterface) => void;

	static init = (getAppData: () => ErrorAppDataInterface, customErrorHandler: (errorLog: ErrorLogInterface) => void) => {
		ErrorHelper.getAppData = getAppData;
		ErrorHelper.customErrorHandler = customErrorHandler;
	}

	static logError = (errorType: string, message: string, details: string) => {
		if (this.getAppData) {
			const data = this.getAppData();
			const log: ErrorLogInterface = {
				application: data.application,
				errorTime: new Date(),
				userId: data.userId,
				churchId: data.churchId,
				originUrl: data.originUrl,
				errorType: errorType,
				message: message,
				details: details
			}

			console.log("ERROR LOG", log);

			if (log.errorType === "401" && log.message.indexOf("/users/login") > -1) return;
			if (log.message.indexOf("clientErrors") > -1) return;
			try {
				ApiHelper.postAnonymous("/clientErrors", [log], "MembershipApi");
			} catch (error) {
				console.log(error)
			}
			if (ErrorHelper.customErrorHandler) ErrorHelper.customErrorHandler(log);
		}
	}

}
