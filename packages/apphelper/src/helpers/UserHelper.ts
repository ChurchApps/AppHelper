import { ApiHelper } from "./ApiHelper"
import { UserInterface, UserContextInterface, IApiPermission, PersonInterface, LoginUserChurchInterface } from "@churchapps/helpers";

export class UserHelper {
	static currentUserChurch: LoginUserChurchInterface;
	static userChurches: LoginUserChurchInterface[];
	static user: UserInterface;
	static churchChanged: boolean = false;
	static person: PersonInterface;

	static selectChurch = async (context?: UserContextInterface, churchId?: string, keyName?: string) => {
		let userChurch = null;

		if (churchId) {
			UserHelper.userChurches.forEach(uc => {
				if (uc.church.id === churchId) userChurch = uc;
			});
		}
		else if (keyName) UserHelper.userChurches.forEach(uc => { if (uc.church.subDomain === keyName) userChurch = uc; });
		else userChurch = UserHelper.userChurches[0];
		if (!userChurch) return;
		else {
			UserHelper.currentUserChurch = userChurch;
			UserHelper.setupApiHelper(UserHelper.currentUserChurch);
			// TODO - remove context code from here and perform the logic in the component itself.
			if (context) {
				if (context.userChurch !== null) UserHelper.churchChanged = true;
				context.setUserChurch(UserHelper.currentUserChurch);
			}
		}
	}

	static setupApiHelper(userChurch: LoginUserChurchInterface) {
		ApiHelper.setDefaultPermissions(userChurch.jwt);
		userChurch.apis.forEach(api => { ApiHelper.setPermissions(api.keyName, api.jwt, api.permissions); });
	}

	static setupApiHelperNoChurch(user: LoginUserChurchInterface) {
		ApiHelper.setDefaultPermissions(user.jwt);
	}

	static checkAccess({ api, contentType, action }: IApiPermission): boolean {
		const permissions = ApiHelper.getConfig(api)?.permissions || [];

		let result = false;
		if (permissions !== undefined) {
			permissions.forEach(element => {
				if (element.contentType === contentType && element.action === action) result = true;
			});
		}
		return result;
	}

	static createAppUrl(appUrl: string, returnUrl: string) {
		const jwt = ApiHelper.getConfig("MembershipApi")?.jwt;

		if (jwt) {
			return `${appUrl}/login/?jwt=${jwt}&returnUrl=${encodeURIComponent(returnUrl)}`;
		} else {
			return `${appUrl}/login/?returnUrl=${encodeURIComponent(returnUrl)}`;
		}
	}

	static redirectToLogin(returnUrl?: string, handleRedirect?: (url: string) => void) {
		if (typeof window !== "undefined") {
			const currentUrl = returnUrl || window.location.pathname + window.location.search;
			const encodedReturnUrl = encodeURIComponent(currentUrl);
			const loginUrl = `/login?returnUrl=${encodedReturnUrl}`;

			// Use handleRedirect function if available, otherwise fallback to window.location
			if (handleRedirect) {
				handleRedirect(loginUrl);
			} else {
				window.location.href = loginUrl;
			}
		}
	}
}
