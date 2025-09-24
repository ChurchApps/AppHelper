"use client";

import React, { useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useStripe } from "@stripe/react-stripe-js";
import { InputBox, ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper } from "@churchapps/helpers";
import { Locale, StripePaymentMethod, PaymentGateway } from "../helpers";
import { PersonInterface, PaymentMethodInterface, StripeBankAccountInterface, StripeBankAccountUpdateInterface, StripeBankAccountVerifyInterface } from "@churchapps/helpers";

interface Props {
  bank: StripePaymentMethod;
  showVerifyForm: boolean;
  customerId: string;
  person: PersonInterface;
  setMode: any;
  deletePayment: any;
  updateList: (message?: string) => void;
  gateway?: PaymentGateway;
}

export const BankForm: React.FC<Props> = (props) => {
  const stripe = useStripe();
  const [bankAccount, setBankAccount] = useState<StripeBankAccountInterface>({ account_holder_name: props.bank.account_holder_name, account_holder_type: props.bank.account_holder_type, country: "US", currency: "usd" } as StripeBankAccountInterface);
  const [paymentMethod] = useState<PaymentMethodInterface>({
    customerId: props.customerId,
    personId: props.person.id,
    email: props.person.contactInfo.email,
    name: props.person.name.display,
    provider: props.bank.provider || "stripe",
    gatewayId: props.bank.gatewayId || props.gateway?.id
  });
  const [updateBankData] = useState<StripeBankAccountUpdateInterface>({
    paymentMethodId: props.bank.id,
    customerId: props.customerId,
    personId: props.person.id,
    bankData: { account_holder_name: props.bank.account_holder_name || "", account_holder_type: props.bank.account_holder_type || "individual" }
  } as StripeBankAccountUpdateInterface);
  const [verifyBankData, setVerifyBankData] = useState<StripeBankAccountVerifyInterface>({
    paymentMethodId: props.bank.id,
    customerId: props.customerId,
    amountData: { amounts: [] }
  });
  const [showSave, setShowSave] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const saveDisabled = () => { /* Function for disabled save state */ };
  const handleCancel = () => { props.setMode("display"); };
  const handleDelete = () => { props.deletePayment(); };
  const handleSave = () => {
    setShowSave(false);
    if (props.showVerifyForm) verifyBank();
    else props.bank.id ? updateBank() : createBank();
  };

  const createBank = async () => {
    if (!stripe) {
      setErrorMessage("Stripe is not available");
      setShowSave(true);
      return;
    }
    
    if (!bankAccount.routing_number || !bankAccount.account_number) {
      setErrorMessage(Locale.label("donation.bankForm.validate.accountNumber"));
    } else {
      try {
        const response = await stripe.createToken("bank_account", bankAccount);
        if (response?.error?.message) {
          setErrorMessage(response.error.message);
        } else if (response?.token?.id) {
          const pm: PaymentMethodInterface = {
            ...paymentMethod,
            id: response.token.id,
            provider: paymentMethod.provider || "stripe",
            gatewayId: paymentMethod.gatewayId || props.gateway?.id
          };
          const result = await ApiHelper.post("/paymentmethods/addbankaccount", pm, "GivingApi");
          if (result?.raw?.message) {
            setErrorMessage(result.raw.message);
          } else {
            props.updateList(Locale.label("donation.bankForm.added"));
            props.setMode("display");
          }
        } else {
          setErrorMessage("Failed to create token");
        }
      } catch (error) {
        setErrorMessage("Error creating bank token");
        console.error(error);
      }
    }
    setShowSave(true);
  };

  const updateBank = async () => {
    if (!bankAccount.account_holder_name || bankAccount.account_holder_name === "") {
      setErrorMessage(Locale.label("donation.bankForm.validate.holderName"));
    } else {
      try {
        const bank = { ...updateBankData };
        bank.bankData.account_holder_name = bankAccount.account_holder_name;
        bank.bankData.account_holder_type = bankAccount.account_holder_type;
        const response = await ApiHelper.post(
          "/paymentmethods/updatebank",
          { ...bank, gatewayId: props.bank.gatewayId || props.gateway?.id, provider: props.bank.provider || "stripe" },
          "GivingApi"
        );
        if (response?.raw?.message) {
          setErrorMessage(response.raw.message);
        } else {
          props.updateList(Locale.label("donation.bankForm.updated"));
          props.setMode("display");
        }
      } catch (error) {
        setErrorMessage("Error updating bank account");
        console.error(error);
      }
    }
    setShowSave(true);
  };

  const verifyBank = async () => {
    const amounts = verifyBankData?.amountData?.amounts;
    if (amounts && amounts.length === 2 && amounts[0] !== "" && amounts[1] !== "") {
      try {
        const response = await ApiHelper.post(
          "/paymentmethods/verifyBank",
          { ...verifyBankData, gatewayId: props.bank.gatewayId || props.gateway?.id, provider: props.bank.provider || "stripe" },
          "GivingApi"
        );
        if (response?.raw?.message) {
          setErrorMessage(response.raw.message);
        } else {
          props.updateList(Locale.label("donation.bankForm.verified"));
          props.setMode("display");
        }
      } catch (error) {
        setErrorMessage("Error verifying bank account");
        console.error(error);
      }
    } else {
      setErrorMessage("Both deposit amounts are required.");
    }
    setShowSave(true);
  };

  const getHeaderText = () => props.bank.id
    ? `${props.bank.name?.toUpperCase() || 'BANK'} ****${props.bank.last4 || ''}`
    : "Add New Bank Account";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const bankData = { ...bankAccount };
    const inputData = { [e.target.name]: e.target.value };
    setBankAccount({ ...bankData, ...inputData });
    setShowSave(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<any>) => {
    const pattern = /^\d+$/;
    if (!pattern.test(e.key)) e.preventDefault();
  };

  const handleVerify = (e: React.ChangeEvent<HTMLInputElement>) => {
    const verifyData = { ...verifyBankData };
    if (e.currentTarget.name === "amount1") verifyData.amountData.amounts[0] = e.currentTarget.value;
    if (e.currentTarget.name === "amount2") verifyData.amountData.amounts[1] = e.currentTarget.value;
    setVerifyBankData(verifyData);
  };

  const getForm = () => {
    if (props.showVerifyForm) {
      return (<>
        <p>{Locale.label("donation.bankForm.twoDeposits")}</p>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth aria-label="amount1" label={Locale.label("donation.bankForm.firstDeposit")} name="amount1" placeholder="00" inputProps={{ maxLength: 2 }} onChange={handleVerify} onKeyPress={handleKeyPress} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth aria-label="amount2" label={Locale.label("donation.bankForm.secondDeposit")} name="amount2" placeholder="00" inputProps={{ maxLength: 2 }} onChange={handleVerify} onKeyPress={handleKeyPress} />
          </Grid>
        </Grid>
      </>);

    } else {
      let accountDetails = <></>;
      if (!props.bank.id) {
        accountDetails = (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }} style={{ marginBottom: "20px" }}>
            <TextField fullWidth label={Locale.label("donation.bankForm.routingNumber")} type="number" name="routing_number" aria-label="routing-number" placeholder="Routing Number" className="form-control" onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} style={{ marginBottom: "20px" }}>
            <TextField fullWidth label={Locale.label("donation.bankForm.accountNumber")} type="number" name="account_number" aria-label="account-number" placeholder="Account Number" className="form-control" onChange={handleChange} />
          </Grid>
        </Grid>
      );
}
      return (<>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }} style={{ marginBottom: "20px" }}>
            <TextField fullWidth label="Account Holder Name" name="account_holder_name" required aria-label="account-holder-name" placeholder="Account Holder Name" value={bankAccount.account_holder_name || ""} className="form-control" onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} style={{ marginBottom: "20px" }}>
            <FormControl fullWidth>
              <InputLabel>{Locale.label("donation.bankForm.name")}</InputLabel>
              <Select label={Locale.label("donation.bankForm.name")} name="account_holder_type" aria-label="account-holder-type" value={bankAccount.account_holder_type || ""} onChange={handleChange}>
                <MenuItem value="individual">{Locale.label("donation.bankForm.individual")}</MenuItem>
                <MenuItem value="company">{Locale.label("donation.bankForm.company")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {accountDetails}
      </>);
    }
  };

  return (
    <InputBox headerIcon="volunteer_activism" headerText={getHeaderText()} ariaLabelSave="save-button" ariaLabelDelete="delete-button" cancelFunction={handleCancel} saveFunction={showSave ? handleSave : saveDisabled} deleteFunction={props.bank.id && !props.showVerifyForm ? handleDelete : undefined}>
      {errorMessage && <ErrorMessages errors={[errorMessage]}></ErrorMessages>}
      <div>
        {!props.bank.id && <p>{Locale.label("donation.bankForm.needVerified")}</p>}
        {getForm()}
      </div>
    </InputBox>
  );

};
