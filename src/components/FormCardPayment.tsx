import React, { forwardRef, useImperativeHandle } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { Box, Grid, TextField } from "@mui/material";
import { QuestionInterface } from "@churchapps/helpers";
import { ApiHelper, Locale } from "../helpers";

interface Props {
	churchId: string,
	question: QuestionInterface
}

export const FormCardPayment = forwardRef((props: Props, ref) => {
  const formStyling = { style: { base: { fontSize: "18px" } } };
  const [email, setEmail] = React.useState<string>("");
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [errors, setErrors] = React.useState<string[]>([]); //TODO: if not needed remove this
  let amt = Number(props.question.choices.find(c => c.text === "Amount")?.value);


  const handlePayment = async () => {
    const validateErrors = validate();
    if (validateErrors.length > 0) return { paymentSuccessful: false, errors: validateErrors }

    try {
      return { paymentSuccessful: true, errors: [] }
    } catch (err) {
      setErrors(["An error occurred while processing your payment."]);
      return { paymentSuccessful: false, errors: errors }
    }
  }

  const validate = () => {
    const result = [];
    if (!firstName) result.push("Please enter your first name to make a payment");
    if (!lastName) result.push("Please enter your last name to make a payment");
    if (!email) result.push("Please enter your email address to make a payment");
    if (result.length === 0) {
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) result.push(Locale.label("donation.donationForm.validate.validEmail"));  //eslint-disable-line
    }
    setErrors(result);
    return result;
  }

	useImperativeHandle(ref, () => ({
		handlePayment,
		questionId: props.question.id
	}));


	return <div style={{ backgroundColor: "#bdbdbd", padding: 35, borderRadius: 20 }}>
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<TextField fullWidth required size="small" margin="none" style={{backgroundColor: "white", borderRadius: "4px"}} InputLabelProps={{ sx: { fontWeight: "bold" } }} label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField fullWidth required size="small" margin="none" style={{backgroundColor: "white", borderRadius: "4px"}} InputLabelProps={{ sx: { fontWeight: "bold" } }} label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField fullWidth required size="small" margin="none" style={{backgroundColor: "white", borderRadius: "4px"}} InputLabelProps={{ sx: { fontWeight: "bold" } }} label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
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