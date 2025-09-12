"use client";

import React, { useCallback, useState, useEffect, useMemo, useRef } from "react";
import type { Stripe } from "@stripe/stripe-js";
import { InputBox, ErrorMessages } from "@churchapps/apphelper";
import { FundDonations } from ".";
import { PayPalHostedFields, PayPalHostedFieldsHandle } from "./PayPalHostedFields";
import { DonationPreviewModal } from "../modals/DonationPreviewModal";
import { ApiHelper, CurrencyHelper, DateHelper } from "@churchapps/helpers";
import { Locale, DonationHelper } from "../helpers";
import type { PaymentMethod, PaymentGateway, MultiGatewayDonationInterface } from "../helpers";
import { PersonInterface, FundDonationInterface, FundInterface, ChurchInterface } from "@churchapps/helpers";
import {
  Grid, InputLabel, MenuItem, Select, TextField, FormControl, Button, FormControlLabel, Checkbox, FormGroup, Typography 
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface Props { 
  person: PersonInterface;
  customerId: string;
  paymentMethods: PaymentMethod[];
  paymentGateways: PaymentGateway[];
  stripePromise?: Promise<Stripe>;
  donationSuccess: (message: string) => void;
  church?: ChurchInterface;
  churchLogo?: string;
}

export const MultiGatewayDonationForm: React.FC<Props> = (props) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [fundDonations, setFundDonations] = useState<FundDonationInterface[]>();
  const [funds, setFunds] = useState<FundInterface[]>([]);
  const [fundsTotal, setFundsTotal] = useState<number>(0);
  const [transactionFee, setTransactionFee] = useState<number>(0);
  const [payFee, setPayFee] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [paymentMethodName, setPaymentMethodName] = useState<string>(
    props?.paymentMethods?.length > 0 ? `${props.paymentMethods[0].name} ${props.paymentMethods[0].last4 ? `****${props.paymentMethods[0].last4}` : props.paymentMethods[0].email || ''}` : ""
  );
  const [selectedGateway, setSelectedGateway] = useState<string>(
    DonationHelper.normalizeProvider(props?.paymentGateways?.find(g => g.enabled !== false)?.provider || "stripe")
  );
  const [donationType, setDonationType] = useState<string | undefined>();
  const [showDonationPreviewModal, setShowDonationPreviewModal] = useState<boolean>(false);
  const [interval, setInterval] = useState("one_month");
  const [gateway, setGateway] = useState<any>(null);
  const paypalClientId = useMemo(() => {
    const gw = props.paymentGateways.find(g => DonationHelper.isProvider(g.provider, "paypal"));
    return gw?.publicKey || "";
  }, [props.paymentGateways]);
  const hostedRef = useRef<PayPalHostedFieldsHandle>(null);
  const [donation, setDonation] = useState<MultiGatewayDonationInterface>({
    id: props?.paymentMethods?.length > 0 ? props.paymentMethods[0].id : "",
    type: props?.paymentMethods?.length > 0 ? (props.paymentMethods[0].type as "card" | "bank" | "paypal") : "card",
    provider: props?.paymentMethods?.length > 0 ? DonationHelper.normalizeProvider(props.paymentMethods[0].provider) as "stripe" | "paypal" : "stripe",
    customerId: props.customerId,
    person: {
      id: props.person?.id || "",
      email: props.person?.contactInfo?.email || "",
      name: props.person?.name?.display || ""
    },
    amount: 0,
    billing_cycle_anchor: + new Date(),
    interval: {
      interval_count: 1,
      interval: "month"
    },
    funds: []
  });

  const loadData = useCallback(() => {
    ApiHelper.get("/funds", "GivingApi").then((data: any) => {
      setFunds(data);
      if (data.length) setFundDonations([{ fundId: data[0].id }]);
    });
    ApiHelper.get("/gateways", "GivingApi").then((data: any) => {
      if (data.length !== 0) setGateway(data[0]);
    });
  }, []);

  const handleSave = useCallback(() => {
    if (donation.amount < .5) setErrorMessage(Locale.label("donation.donationForm.tooLow"));
    else setShowDonationPreviewModal(true);
  }, [donation.amount]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }, [handleSave]);

  const handleCheckChange = useCallback((_e: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    const d = { ...donation } as MultiGatewayDonationInterface;
    d.amount = checked ? fundsTotal + transactionFee : fundsTotal;
    const showFee = checked ? transactionFee : 0;
    setTotal(d.amount);
    setPayFee(showFee);
    setDonation(d);
  }, [donation, fundsTotal, transactionFee]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setErrorMessage(undefined);
    const d = { ...donation } as MultiGatewayDonationInterface;
    const value = e.target.value;
    switch (e.target.name) {
      case "gateway":
        setSelectedGateway(value);
        d.provider = value as "stripe" | "paypal";
        // Reset payment method when changing gateways
        const availableMethods = props.paymentMethods.filter(pm => DonationHelper.normalizeProvider(pm.provider) === value);
        if (availableMethods.length > 0) {
          d.id = availableMethods[0].id;
          d.type = availableMethods[0].type as "card" | "bank" | "paypal";
          setPaymentMethodName(`${availableMethods[0].name} ${availableMethods[0].last4 ? `****${availableMethods[0].last4}` : availableMethods[0].email || ''}`);
        } else {
          d.id = "";
          if (value === "paypal") d.type = "paypal";
        }
        break;
      case "method":
        d.id = value;
        const pm = props.paymentMethods.find(pm => pm.id === value);
        if (pm) {
          d.type = pm.type as "card" | "bank" | "paypal";
          d.provider = DonationHelper.normalizeProvider(pm.provider) as "stripe" | "paypal";
          setPaymentMethodName(`${pm.name} ${pm.last4 ? `****${pm.last4}` : pm.email || ''}`);
        }
        break;
      case "type": setDonationType(value); break;
      case "date": d.billing_cycle_anchor = value ? + new Date(value) : + new Date(); break;
      case "interval":
        setInterval(value);
        d.interval = DonationHelper.getInterval(value);
        break;
      case "notes": d.notes = value; break;
      case "transaction-fee":
        const element = e.target as HTMLInputElement;
        d.amount = element.checked ? fundsTotal + transactionFee : fundsTotal;
        const showFee = element.checked ? transactionFee : 0;
        setTotal(d.amount);
        setPayFee(showFee);
    }
    setDonation(d);
  }, [donation, props.paymentMethods, fundsTotal, transactionFee]);

  const handleCancel = useCallback(() => { setDonationType(undefined); }, []);
  const handleDonationSelect = useCallback((type: string) => {
    const dt = donationType === type ? undefined : type;
    setDonationType(dt);
  }, [donationType]);

  const handleSingleDonationClick = useCallback(() => handleDonationSelect("once"), [handleDonationSelect]);
  const handleRecurringDonationClick = useCallback(() => handleDonationSelect("recurring"), [handleDonationSelect]);

  const makeDonation = useCallback(async (message: string) => {
    let results;

    const churchObj = {
      name: props?.church?.name || "",
      subDomain: props?.church?.subDomain || "",
      churchURL: typeof window !== "undefined" ? window.location.origin : "",
      logo: props?.churchLogo || ""
    };

    // If using PayPal without a saved method, try Hosted Fields
    if (selectedGateway === "paypal" && (!donation.id || donation.id === "") && paypalClientId) {
      try {
        const payload = await hostedRef.current?.submit();
        const orderId = (payload as any)?.orderId || (payload as any)?.id || "";
        if (orderId) {
          // Capture and persist via unified /donate/charge endpoint for PayPal
          const compactFunds = (donation.funds || []).map((f: any) => ({ id: f.id, amount: f.amount }));
          results = await ApiHelper.post(
            "/donate/charge/",
            {
              provider: "paypal",
              id: orderId,
              churchId: props?.church?.id || "",
              amount: total,
              funds: compactFunds,
              person: donation.person,
              notes: donation?.notes || ""
            },
            "GivingApi"
          );
        }
      } catch (e) {
        console.warn("Hosted Fields submit failed, falling back to standard flow.", e);
      }
    }

    // Standard flow (Stripe or saved payment method)
    if (!results) {
      if (donationType === "once") results = await ApiHelper.post("/donate/charge/", { ...donation, church: churchObj }, "GivingApi");
      if (donationType === "recurring") results = await ApiHelper.post("/donate/subscribe/", { ...donation, church: churchObj }, "GivingApi");
    }

    if (results?.status === "succeeded" || results?.status === "pending" || results?.status === "active" || results?.status === "CREATED") {
      setShowDonationPreviewModal(false);
      setDonationType(undefined);
      props.donationSuccess(message);
    }
    if (results?.raw?.message || results?.message) {
      setShowDonationPreviewModal(false);
      setErrorMessage(Locale.label("donation.common.error") + ": " + (results?.raw?.message || results?.message));
    }
  }, [donation, donationType, props.church?.name, props.church?.subDomain, props.churchLogo, props.donationSuccess]);

  const handleFundDonationsChange = useCallback(async (fd: FundDonationInterface[]) => {
    setErrorMessage(undefined);
    setFundDonations(fd);
    let totalAmount = 0;
    const selectedFunds: any = [];
    for (const fundDonation of fd) {
      totalAmount += fundDonation.amount || 0;
      const fund = funds.find((fund: FundInterface) => fund.id === fundDonation.fundId);
      if (fund) {
        selectedFunds.push({ id: fundDonation.fundId, amount: fundDonation.amount || 0, name: fund.name });
      }
    }
    const d = { ...donation };
    d.amount = totalAmount;
    d.funds = selectedFunds;
    setFundsTotal(totalAmount);
    
    const fee = await getTransactionFee(totalAmount);
    setTransactionFee(fee);
    
    if (gateway && gateway.payFees === true) {
      d.amount = totalAmount + fee;
      setPayFee(fee);
    }
    setTotal(d.amount);
    setDonation(d);
  }, [donation, funds, gateway]);

  const getTransactionFee = useCallback(async (amount: number) => {
    if (amount > 0) {
      let requestData: any = { amount };
      
      if (selectedGateway === "paypal") {
        requestData.provider = "paypal";
      } else {
        requestData.type = donation.type === "card" ? "creditCard" : "ach";
      }
      
      try {
        const response = await ApiHelper.post("/donate/fee?churchId=" + (props?.church?.id || ""), requestData, "GivingApi");
        return response.calculatedFee;
      } catch (error) {
        console.log("Error calculating transaction fee: ", error);
        return 0;
      }
    } else {
      return 0;
    }
  }, [donation.type, props?.church?.id, selectedGateway]);

  useEffect(() => {
    loadData();
  }, [loadData, props.person?.id]);

  const availablePaymentMethods = props.paymentMethods.filter(pm => DonationHelper.normalizeProvider(pm.provider) === selectedGateway);
  const availableGateways = props.paymentGateways.filter(g => g.enabled !== false);

  if (!funds.length) return null;
  else {
    return (
      <>
        <DonationPreviewModal 
          show={showDonationPreviewModal} 
          onHide={() => setShowDonationPreviewModal(false)} 
          handleDonate={makeDonation} 
          donation={{
            ...donation,
            person: {
              id: donation.person?.id || "",
              email: donation.person?.email || "",
              name: donation.person?.name || ""
            }
          } as any} 
          donationType={donationType || ""} 
          payFee={payFee} 
          paymentMethodName={paymentMethodName} 
          funds={funds} 
        />
        <InputBox 
          id="donation-form" 
          aria-label="donation-box" 
          headerIcon="volunteer_activism" 
          headerText={Locale.label("donation.donationForm.donate")} 
          ariaLabelSave="save-button" 
          cancelFunction={donationType ? handleCancel : undefined} 
          saveFunction={donationType ? handleSave : undefined} 
          saveText={Locale.label("donation.donationForm.preview")}
        >
          <Grid id="donation-type-selector" container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button 
                id="single-donation-button" 
                aria-label="single-donation" 
                size="small" 
                fullWidth 
                style={{ minHeight: "50px" }} 
                variant={donationType === "once" ? "contained" : "outlined"} 
                onClick={handleSingleDonationClick}
              >
                {Locale.label("donation.donationForm.make")}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button 
                id="recurring-donation-button" 
                aria-label="recurring-donation" 
                size="small" 
                fullWidth 
                style={{ minHeight: "50px" }} 
                variant={donationType === "recurring" ? "contained" : "outlined"} 
                onClick={handleRecurringDonationClick}
              >
                {Locale.label("donation.donationForm.makeRecurring")}
              </Button>
            </Grid>
          </Grid>
          {donationType && (
            <div id="donation-details" style={{ marginTop: "20px" }}>
              <Grid container spacing={3}>
                {availableGateways.length > 1 && (
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Provider</InputLabel>
                      <Select 
                        id="gateway-select" 
                        label="Payment Provider" 
                        name="gateway" 
                        aria-label="gateway" 
                        value={selectedGateway} 
                        onChange={handleChange}
                      >
                        {availableGateways.map((gw, i) => (
                          <MenuItem key={i} value={DonationHelper.normalizeProvider(gw.provider)}>
                            {DonationHelper.isProvider(gw.provider, "stripe") ? "Stripe" : "PayPal"}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {selectedGateway !== "paypal" || availablePaymentMethods.length > 0 ? (
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel>{Locale.label("donation.donationForm.method")}</InputLabel>
                      <Select 
                        id="payment-method-select" 
                        label={Locale.label("donation.donationForm.method")} 
                        name="method" 
                        aria-label="method" 
                        value={donation.id} 
                        className="capitalize" 
                        onChange={handleChange}
                      >
                        {availablePaymentMethods.map((paymentMethod: PaymentMethod, i: number) => (
                          <MenuItem key={i} value={paymentMethod.id}>
                            {paymentMethod.name} {paymentMethod.last4 ? `****${paymentMethod.last4}` : paymentMethod.email || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Enter card details (PayPal Hosted Fields)</Typography>
                    <PayPalHostedFields
                      ref={hostedRef}
                      clientId={paypalClientId}
                      getClientToken={async () => {
                        const churchId = props?.church?.id || "";
                        const endpoints = [
                          "/donate/paypal/client-token",
                          "/donate/paypal/clientToken",
                          "/donate/paypal/generate-client-token"
                        ];
                        for (const ep of endpoints) {
                          try {
                            const resp = await ApiHelper.post(ep, { churchId }, "GivingApi");
                            const token = resp?.clientToken || resp?.token || resp?.result || resp;
                            if (typeof token === "string" && token.length > 0) return token;
                          } catch { /* try next */ }
                        }
                        return "";
                      }}
                      createOrder={async () => {
                        try {
                          const fundsPayload = (donation?.funds || [])
                            .filter((f: any) => (f.amount || 0) > 0 && f.id)
                            .map((f: any) => ({ id: f.id, amount: f.amount || 0 }));
                          const response = await ApiHelper.post(
                            "/donate/paypal/create-order",
                            {
                              churchId: props?.church?.id || "",
                              amount: total,
                              currency: "USD",
                              funds: fundsPayload,
                              notes: donation?.notes || ""
                            },
                            "GivingApi"
                          );
                          return response?.id || response?.orderId || "";
                        } catch (_e) {
                          return "";
                        }
                      }}
                    />
                  </Grid>
                )}
              </Grid>
              {donationType === "recurring" && (
                <Grid container spacing={3} style={{ marginTop: 10 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField 
                      id="start-date-field" 
                      fullWidth 
                      name="date" 
                      type="date" 
                      aria-label="date" 
                      label={Locale.label("donation.donationForm.startDate")} 
                      value={DateHelper.formatHtml5Date(new Date(donation.billing_cycle_anchor || Date.now()))} 
                      onChange={handleChange} 
                      onKeyDown={handleKeyDown} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>{Locale.label("donation.donationForm.frequency")}</InputLabel>
                      <Select 
                        id="frequency-select" 
                        label={Locale.label("donation.donationForm.frequency")} 
                        name="interval" 
                        aria-label="interval" 
                        value={interval} 
                        onChange={handleChange}
                      >
                        <MenuItem value="one_week">{Locale.label("donation.donationForm.weekly")}</MenuItem>
                        <MenuItem value="two_week">{Locale.label("donation.donationForm.biWeekly")}</MenuItem>
                        <MenuItem value="one_month">{Locale.label("donation.donationForm.monthly")}</MenuItem>
                        <MenuItem value="three_month">{Locale.label("donation.donationForm.quarterly")}</MenuItem>
                        <MenuItem value="one_year">{Locale.label("donation.donationForm.annually")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
              <div id="fund-selection" className="form-group">
                {funds && fundDonations && (
                  <>
                    <h4>{Locale.label("donation.donationForm.fund")}</h4>
                    <FundDonations fundDonations={fundDonations} funds={funds} updatedFunction={handleFundDonationsChange} />
                  </>
                )}
                {fundsTotal > 0 && (
                  <>
                    {(gateway?.payFees === true) ? (
                      <Typography fontSize={14} fontStyle="italic">
                        *{Locale.label("donation.donationForm.fees").replace("{}", CurrencyHelper.formatCurrency(transactionFee))}
                      </Typography>
                    ) : (
                      <FormGroup>
                        <FormControlLabel 
                          control={<Checkbox />} 
                          name="transaction-fee" 
                          label={Locale.label("donation.donationForm.cover").replace("{}", CurrencyHelper.formatCurrency(transactionFee))} 
                          onChange={handleCheckChange} 
                        />
                      </FormGroup>
                    )}
                    <p>{Locale.label("donation.donationForm.total")}: ${total}</p>
                  </>
                )}
                <TextField 
                  id="donation-notes" 
                  fullWidth 
                  label="Memo (optional)" 
                  multiline 
                  aria-label="note" 
                  name="notes" 
                  value={donation.notes || ""} 
                  onChange={handleChange} 
                  onKeyDown={handleKeyDown} 
                />
              </div>
              {errorMessage && <ErrorMessages errors={[errorMessage]}></ErrorMessages>}
            </div>
          )}
        </InputBox>
      </>
    );
  }
};
