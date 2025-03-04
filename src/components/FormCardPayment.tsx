"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Box, Grid, TextField } from "@mui/material";
import { QuestionInterface } from "@churchapps/helpers";
import { ApiHelper, Locale, UserInterface, PersonInterface, StripePaymentMethod, StripeDonationInterface, ChurchInterface, FundInterface, ArrayHelper, UserHelper } from "../helpers";

interface Props {
	churchId: string,
	question: QuestionInterface
}

export const FormCardPayment = forwardRef((props: Props, ref) => {
  const formStyling = { style: { base: { fontSize: "18px" } } };
  const elements = useElements();
  const stripe = useStripe();
  const [email, setEmail] = React.useState<string>((ApiHelper.isAuthenticated && UserHelper.user.email) ? UserHelper.user.email : "");
  const [firstName, setFirstName] = React.useState<string>((ApiHelper.isAuthenticated && UserHelper.user.firstName) ? UserHelper.user.firstName : "");
  const [lastName, setLastName] = React.useState<string>((ApiHelper.isAuthenticated && UserHelper.user.lastName) ? UserHelper.user.lastName : "");
  const [church, setChurch] = React.useState<ChurchInterface>();
  const [fund, setFund] = React.useState<FundInterface>()
  let amt = Number(props.question.choices.find(c => c.text === "Amount")?.value);
  let fundId = props.question.choices.find(c => c.text === "FundId")?.value;

  const getChurchData = () => {
    let fundId = props.question.choices.find(c => c.text === "FundId")?.value;
    ApiHelper.get("/churches/" + props.churchId, "MembershipApi").then(data => {
      setChurch(data);
    });
    ApiHelper.get("/funds/churchId/" + props.churchId, "GivingApi").then(data => {
      const result = ArrayHelper.getOne(data, "id", fundId);
      setFund(result);
    })
  }

  const handlePayment = async () => {
    const validateErrors = validate();
    if (validateErrors.length > 0) {
      return { paymentSuccessful: false, errors: validateErrors }
    }

    try {
      const userData = await ApiHelper.post("/users/loadOrCreate", { userEmail: email, firstName, lastName }, "MembershipApi");

      const personData = { churchId: props.churchId, firstName, lastName, email };
      const person = await ApiHelper.post("/people/loadOrCreate", personData, "MembershipApi");

      const cardSavedRes = await saveCard(userData, person);
      if (!cardSavedRes.success) {
        return { paymentSuccessful: false, name: "", errors: cardSavedRes.errors }
      }

      return { paymentSuccessful: true, name: person?.name?.display || "", errors: [] as string[] }
    } catch (err) {
      const errorMessage = "An error occurred while processing your payment.";
      return { paymentSuccessful: false, name: "", errors: [errorMessage] as string[] }
    }
  }

  const saveCard = async (user: UserInterface, person: PersonInterface) => {
    const cardData = elements.getElement(CardElement);
    try {
      const stripePM = await stripe.createPaymentMethod({ type: "card", card: cardData });
      if (stripePM.error) {
        return { success: false, errors: [stripePM.error.message] };
      } else {
        const pm = { id: stripePM.paymentMethod.id, personId: person.id, email: email, name: person.name.display, churchId: props.churchId };
        try {
          const result = await ApiHelper.post("/paymentmethods/addcard", pm, "GivingApi");
          if (result?.raw?.message) {
            return { success: false, errors: [result.raw.message] };
          } else {
            const p: { paymentMethod: StripePaymentMethod, customerId: string } = result
            const savedPaymentRes = await savePayment(p.paymentMethod, p.customerId, person);
            if (!savedPaymentRes.success) {
              return { success: false, errors: savedPaymentRes.errors }
            }
            return { success: true, errors: [] }
          }
        } catch (apiError) {
          return { success: false, errors: ["An error occurred while saving the card."] }
        }
      }
    } catch (stripeError) {
      return { success: false, errors: ["An error occurred while processing your payment method."] };
    }
  }

  const savePayment = async (paymentMethod: StripePaymentMethod, customerId: string, person?: PersonInterface) => {

    let payment: StripeDonationInterface = {
      amount: amt,
      id: paymentMethod.id,
      customerId: customerId,
      type: paymentMethod.type,
      churchId: props.churchId,
      funds: [{ id: fundId, amount: amt, name: fund.name }],
      person: {
        id: person.id,
        email: person?.contactInfo?.email,
        name: person?.name?.display,
      }
    }

    const churchObj = {
      name: church.name,
      subDomain: church.subDomain,
      churchURL: typeof window !== "undefined" && window.location.origin,
      logo: ""
    }

    try {
      const result = await ApiHelper.post("/donate/charge/", { ...payment, church: churchObj }, "GivingApi");
      if (result?.status === "succeeded" || result?.status === "pending") {
        return { success: true, errors: [] }
      }

      if (result?.raw?.message) {
        return { success: false, errors: [result.raw.message] }
      }

    } catch (err) {
      return { success: false, errors: ["An error occurred while saving your payment."] }
    }

  }

  const validate = () => {
    const result = [];
    if (!firstName) result.push(Locale.label("donation.donationForm.validate.firstName"));
    if (!lastName) result.push(Locale.label("donation.donationForm.validate.lastName"));
    if (!email) result.push(Locale.label("donation.donationForm.validate.email"));
    if (result.length === 0) {
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) result.push(Locale.label("donation.donationForm.validate.validEmail"));  //eslint-disable-line
    }
    return result;
  }

  useImperativeHandle(ref, () => ({
    handlePayment,
    questionId: props.question.id
  }));

  React.useEffect(getChurchData, []);

  return <div style={{ backgroundColor: "#bdbdbd", padding: 35, borderRadius: 20 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField fullWidth required size="small" margin="none" style={{backgroundColor: "white", borderRadius: "4px"}} InputLabelProps={{ sx: { fontWeight: "bold" } }} label={Locale.label("person.email")} value={email} onChange={(e) => setEmail(e.target.value)} disabled={ApiHelper.isAuthenticated && UserHelper.user.email !== ""} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth required size="small" margin="none" style={{backgroundColor: "white", borderRadius: "4px"}} InputLabelProps={{ sx: { fontWeight: "bold" } }} label={Locale.label("person.firstName")} value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={ApiHelper.isAuthenticated && UserHelper.user.firstName !== ""} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth required size="small" margin="none" style={{backgroundColor: "white", borderRadius: "4px"}} InputLabelProps={{ sx: { fontWeight: "bold" } }} label={Locale.label("person.lastName")} value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={ApiHelper.isAuthenticated && UserHelper.user.lastName !== ""} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ backgroundColor: "white", padding: 1.5, borderRadius: 1, color: "gray", fontWeight: "bold", fontSize: 18 }}>$ {amt}</Box>
      </Grid>
      <Grid item xs={12}>
        <div style={{ padding: 10, border: "1px solid #CCC", borderRadius: 5, backgroundColor: "white" }}>
          <CardElement options={formStyling} />
        </div>
      </Grid>
    </Grid>
  </div>
});
