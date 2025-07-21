"use client";

import React, { useState } from "react";
import { LoginUserChurchInterface, UserContextInterface, ArrayHelper } from "@churchapps/helpers";
import { ApiHelper } from "../../helpers/ApiHelper";
import { UserHelper } from "../../helpers/UserHelper";
import { NavItem } from "./NavItem";
import { Locale } from "../../helpers";

export interface Props { userChurches: LoginUserChurchInterface[], currentUserChurch: LoginUserChurchInterface, context: UserContextInterface, onDelete?: () => void }

export const ChurchList: React.FC<Props> = props => {
	console.log('ChurchList props:', {
		userChurches: props.userChurches,
		currentUserChurch: props.currentUserChurch,
		context: props.context
	});
	
	const [userChurches, setUserChurches] = useState(() => {
		try {
			// Handle both array and single object cases
			let churches = props.userChurches;
			if (!Array.isArray(churches)) {
				churches = churches ? [churches] : [];
			}
			return churches.filter(uc => uc && uc.apis && uc.apis.length > 0);
		} catch (error) {
			console.error('Error filtering userChurches:', error);
			return [];
		}
	});
	
	// Update local state when props change
	React.useEffect(() => {
		try {
			// Handle both array and single object cases
			let churches = props.userChurches;
			if (!Array.isArray(churches)) {
				churches = churches ? [churches] : [];
			}
			setUserChurches(churches.filter(uc => uc && uc.apis && uc.apis.length > 0));
		} catch (error) {
			console.error('Error updating userChurches:', error);
			setUserChurches([]);
		}
	}, [props.userChurches]);

	const handleDelete = async (uc: LoginUserChurchInterface) => {
		// Helper function to get label with fallback
		const getLabel = (key: string, fallback: string) => {
			const label = Locale.label(key);
			return label && label !== key ? label : fallback;
		};
		
		const confirmMessage = getLabel("wrapper.sureRemoveChurch", "Are you sure you wish to delete this church? You will no longer be a member of {}.").replace("{}", uc.church.name?.toUpperCase());
		if (window.confirm(confirmMessage)) {
			await ApiHelper.delete(`/userchurch/record/${props.context.user.id}/${uc.church.id}/${uc.person.id}`, "MembershipApi");
			await ApiHelper.delete(`/rolemembers/self/${uc.church.id}/${props.context.user.id}`, "MembershipApi");
			// remove the same from userChurches
			const idx = ArrayHelper.getIndex(UserHelper.userChurches, "church.id", uc.church.id);
			if (idx > -1) UserHelper.userChurches.splice(idx, 1);
			props?.onDelete();
		}
	}

	// Helper function to get label with fallback
	const getLabel = (key: string, fallback: string) => {
		const label = Locale.label(key);
		return label && label !== key ? label : fallback;
	};

	let result: React.ReactElement[] = [];
	userChurches.forEach(uc => {
		const userChurch = uc;
		const churchName = uc.church.name;
		result.push(<NavItem
			key={userChurch.church.id}
			selected={(uc.church.id === props.currentUserChurch.church.id) && true}
			onClick={() => UserHelper.selectChurch(props.context, userChurch.church.id, null)}
			label={churchName || "Unknown"}
			icon="church"
			deleteIcon={uc.church.id !== props.currentUserChurch.church.id ? "delete" : null}
			deleteLabel={getLabel("wrapper.deleteChurch", "Delete")}
			deleteFunction={() => { handleDelete(uc); }}
		/>);
	});

	return <>{result}</>;
};
