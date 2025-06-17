"use client";

import React from "react";
import { useCookies } from "react-cookie"
import { ApiHelper, UserContextInterface } from "../helpers";

interface Props { context?: UserContextInterface, handleRedirect?: (url: string) => void }

export const LogoutPage: React.FC<Props> = (props) => {
	const [, , removeCookie] = useCookies(["jwt", "email", "name", "lastChurchId"]);

	removeCookie("jwt");
	removeCookie("email");
	removeCookie("name");
	removeCookie("lastChurchId");

	ApiHelper.clearPermissions();
	props.context?.setUser(null);
	props.context?.setPerson(null);
	props.context?.setUserChurches(null);
	props.context?.setUserChurch(null);

	setTimeout(() => {
		// a must check for Nextjs
		if (typeof window !== "undefined") {
			// Use handleRedirect function if available, otherwise fallback to window.location
			if (props.handleRedirect) {
				props.handleRedirect("/");
			} else {
				window.location.href = "/";
			}
		}
	}, 300);
	return null;
}
