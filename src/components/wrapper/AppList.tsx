"use client";

import React from "react";
import { ApiHelper, UserHelper } from "@churchapps/helpers";
import { NavItem } from "./NavItem";
import { CommonEnvironmentHelper } from "@churchapps/helpers";
import { LoginUserChurchInterface } from "@churchapps/helpers";

export interface Props { appName: string; currentUserChurch: LoginUserChurchInterface; onNavigate: (url: string) => void; }

export const AppList: React.FC<Props> = props => {
  const jwt = ApiHelper.getConfig("MembershipApi").jwt;
  const churchId = UserHelper.currentUserChurch.church.id;
  return (
    <>
      <NavItem url={`${CommonEnvironmentHelper.ChumsRoot}/login?jwt=${jwt}&churchId=${churchId}`} selected={props.appName === "CHUMS"} external={true} label="Chums" icon="logout" onNavigate={props.onNavigate} />
      <NavItem url={`${CommonEnvironmentHelper.B1Root.replace("{key}", props.currentUserChurch.church.subDomain)}/login?jwt=${jwt}&churchId=${churchId}`} selected={props.appName === "B1.church"} external={true} label="B1.Church" icon="logout" onNavigate={props.onNavigate} />
      <NavItem url={`${CommonEnvironmentHelper.LessonsRoot}/login?jwt=${jwt}&churchId=${churchId}`} selected={props.appName === "Lessons.church"} external={true} label="Lessons.church" icon="logout" onNavigate={props.onNavigate} />
    </>
  );
}
