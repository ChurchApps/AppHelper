"use client";

import React from "react";
import { FundDonationInterface, FundInterface } from "@churchapps/helpers";
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { Locale } from "../../helpers";

interface Props {
  fundDonation: FundDonationInterface,
  funds: FundInterface[],
  index: number,
  updatedFunction: (fundDonation: FundDonationInterface, index: number) => void
}

export const FundDonation: React.FC<Props> = (props) => {

  const getOptions = () => {
    let result = [];
    for (let i = 0; i < props.funds.length; i++) result.push(<MenuItem key={i} value={props.funds[i].id}>{props.funds[i].name}</MenuItem>);
    return result;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    let fd = { ...props.fundDonation }
    switch (e.target.name) {
      case "amount":
        fd.amount = parseFloat(e.target.value.replace("$", "").replace(",", ""));
        break;
      case "fund":
        fd.fundId = e.target.value;
        break;
    }
    props.updatedFunction(fd, props.index);
  }

  return (
    <Grid container spacing={3}>
      <Grid item md={6} xs={12}>
        <TextField fullWidth name="amount" label={Locale.label("donation.fundDonations.amount")} type="number" aria-label="amount" lang="en-150" value={props.fundDonation.amount || ""} onChange={handleChange} />
      </Grid>
      <Grid item md={6} xs={12}>
        <FormControl fullWidth>
          <InputLabel>{Locale.label("donation.fundDonations.fund")}</InputLabel>
          <Select fullWidth label={Locale.label("donation.fundDonations.fund")} name="fund" aria-label="fund" value={props.fundDonation.fundId} onChange={handleChange}>
            {getOptions()}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

