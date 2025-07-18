"use client";

import { Grid } from "@mui/material";
import React from "react";
import { ArrayHelper } from "@churchapps/helpers";
import { ChurchInterface, GenericSettingInterface } from "@churchapps/helpers";

interface Props {
  selectChurch: (churchId: string) => void,
  church: ChurchInterface
}

export const SelectableChurch: React.FC<Props> = (props) => {

  let logo = "/images/logo.png";
  if (props.church.settings) {
    let l: GenericSettingInterface = ArrayHelper.getOne(props.church.settings, "keyName", "logoLight");
    if (l?.value) logo = l.value;
  }
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <button 
          type="button"
          style={{ 
            fontSize: "1.125rem", 
            display: "block", 
            marginTop: 15, 
            marginBottom: 15, 
            background: "none", 
            border: "none", 
            cursor: "pointer", 
            padding: 0, 
            width: "100%" 
          }} 
          onClick={(e) => { e.preventDefault(); props.selectChurch(props.church.id) }}
          aria-label={`Select church: ${props.church.name}`}
        >
          <img src={logo} alt="church logo" className="w-100 img-fluid" />
        </button>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <div>
          <button 
            type="button"
            style={{ 
              fontSize: "1.125rem", 
              display: "block", 
              background: "none", 
              border: "none", 
              color: "#3b82f6", 
              cursor: "pointer", 
              textDecoration: "underline", 
              padding: 0, 
              textAlign: "left" 
            }} 
            onClick={(e) => { e.preventDefault(); props.selectChurch(props.church.id) }}
            aria-label={`Select church: ${props.church.name}`}
          >
            {props.church.name}
          </button>
          {(props.church.address1) && <div>{props.church.address1}</div>}
          {(props.church.city || props.church.state) && <div>
            {props.church.city && props.church.city + ", "}
            {props.church.state}
          </div>}
        </div>
      </Grid>
      <span style={{ display: "block", width: "100%", borderTop: "1px solid #ccc", margin: "1rem" }}></span>
    </Grid>
  );
};
