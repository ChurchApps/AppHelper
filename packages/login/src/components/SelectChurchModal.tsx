"use client";

import React from "react";
import { ChurchInterface, LoginUserChurchInterface } from "@churchapps/helpers";
import { SelectChurchSearch } from "./SelectChurchSearch";
import { SelectableChurch } from "./SelectableChurch";
import { ErrorMessages } from "@churchapps/apphelper"
import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Locale } from "../helpers";

interface Props {
	appName: string,
	show: boolean,
	userChurches?: LoginUserChurchInterface[],
	selectChurch: (churchId: string) => void,
	registeredChurchCallback?: (church: ChurchInterface) => void,
	errors?: string[],
	handleRedirect?: (url: string) => void
}

export const SelectChurchModal: React.FC<Props> = (props) => {
	const [showSearch, setShowSearch] = React.useState(false);

	const handleClose = () => {
		window.location.reload();
	}

	const getContents = () => {
		if (showSearch || props.userChurches?.length === 0) return <SelectChurchSearch selectChurch={props.selectChurch} registeredChurchCallback={props.registeredChurchCallback} appName={props.appName} />
		else return (<>
			{props.userChurches?.map(uc => (<SelectableChurch church={uc.church} selectChurch={props.selectChurch} key={uc.church.id} />))}
			<button 
				type="button"
				style={{ 
					display: "block", 
					textAlign: "center", 
					background: "none", 
					border: "none", 
					color: "#3b82f6", 
					cursor: "pointer", 
					textDecoration: "underline" 
				}} 
				onClick={(e) => { e.preventDefault(); setShowSearch(true); }}
			>
				{Locale.label("selectChurch.another")}
			</button>
		</>);
	}

	return (
		<Dialog 
			open={props.show} 
			onClose={handleClose}
			aria-labelledby="select-church-title"
			aria-describedby="select-church-content"
		>
			<DialogTitle id="select-church-title">{Locale.label("selectChurch.selectChurch")}
			</DialogTitle>
			<Tooltip title="Logout" arrow>
				<IconButton 
					sx={{ position: "absolute", right: 8, top: 8 }} 
					color="error" 
					aria-label="Logout"
					onClick={() => {
						// Use handleRedirect function if available, otherwise fallback to window.location
						if (props.handleRedirect) {
							props.handleRedirect("/logout");
						} else {
							window.location.href = "/logout";
						}
					}}>
					<Logout />
				</IconButton>
			</Tooltip>
			<DialogContent id="select-church-content" sx={{ width: 500, maxWidth: "100%" }}>
				<ErrorMessages errors={props.errors} />
				{getContents()}
			</DialogContent>
		</Dialog>
	);
};
