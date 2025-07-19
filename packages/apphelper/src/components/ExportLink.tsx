"use client";

import { Button, Icon } from "@mui/material";
import React, { Suspense, lazy } from "react";
import { Loading } from "./Loading";

// Lazy load the CSVLink component
const CSVLink = lazy(() => import("react-csv").then(module => ({ default: module.CSVLink })));

interface Props {
  data: any[],
  spaceAfter?: boolean,
  spaceBefore?: boolean,
  filename?: string,
  icon?: string,
  text?: string,
  customHeaders?: {label: string, key: string}[]
}

export const ExportLink: React.FC<Props> = (props) => {

  const people = props.data ? [...props.data] : [];

  const getHeaders = () => {
    let result = [];
    if (people?.length > 0) {
      let names = getAllPropertyNames();
      for (let i = 0; i < names.length; i++) { result.push({ label: names[i], key: names[i] }); }
    }
    return result;
  }

  const getAllPropertyNames = () => {
    let result = [];
    for (let i = 0; i < people.length; i++) {
      let p = {...people[i]}
      p.birthDate = p.birthDate ? new Date(p.birthDate).toISOString() : null;
      p.anniversary = p.anniversary ? new Date(p.anniversary).toISOString() : null;
      people[i] = p;
      let propertyNames = getPropertyNames("", people[i]);
      for (let j = 0; j < propertyNames.length; j++) if (result.indexOf(propertyNames[j]) === -1) result.push(propertyNames[j]);
    }
    return result.sort();
  }

  const getPropertyNames = (prefix: string, obj: any) => {
    let result = [];
    let names = Object.getOwnPropertyNames(obj)
    for (let i = 0; i < names.length; i++) {
      let t = typeof obj[names[i]];
      switch (t) {
        case "number":
        case "string":
        case "boolean":
          result.push(prefix + names[i]);
          break;
        case "object":
          if ((obj[names[i]] !== null)) {
            let children: string[] = getPropertyNames(prefix + names[i] + ".", obj[names[i]]);
            for (let j = 0; j < children.length; j++) result.push(children[j]);
          }
      }
    }
    return result;
  }

  if (!people || people?.length === 0) return null;
  else {
    let items = [];
    if (props.spaceBefore) items.push(" ");
    items.push(
      <Suspense key={props.filename} fallback={<Button><Icon sx={{ marginRight: props.text ? 1 : 0 }}>{props.icon || "file_download"}</Icon>{props.text || ""}</Button>}>
        <CSVLink data={people} headers={props.customHeaders || getHeaders()} filename={props.filename || "export.csv"}>
          <Button><Icon sx={{ marginRight: props.text ? 1 : 0 }}>{props.icon || "file_download"}</Icon>{props.text || ""}</Button>
        </CSVLink>
      </Suspense>
    );
    if (props.spaceAfter) items.push(" ");
    return (<>{items}</>);
  }
}
