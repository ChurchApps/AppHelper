"use client";

import React, { FormEventHandler } from "react";
import { LoginResponseInterface, RegisterUserInterface, UserInterface } from "@churchapps/helpers";
import { AnalyticsHelper, ApiHelper, Locale } from "../../helpers";
import { ErrorMessages } from "../../components";
import { Button, Stack, TextField, Link } from "@mui/material";

interface Props {
  appName?: string,
  appUrl?: string,
  updateErrors: (errors: string[]) => void,
  loginCallback?: () => void
  userRegisteredCallback?: (user: UserInterface) => Promise<void>;
}

export const Register: React.FC<Props> = (props) => {

  const cleanAppUrl = () => {
    if (!props.appUrl) return null;
    else {
      const index = props.appUrl.indexOf("/", 9);
      if (index === -1) return props.appUrl;
      else return props.appUrl.substring(0, index);
    }
  }

  const [registered, setRegistered] = React.useState(false);
  const [user, setUser] = React.useState<RegisterUserInterface>({ firstName: "", lastName: "", email: "", appName: props.appName, appUrl: cleanAppUrl() });
  const [errors, setErrors] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleRegisterErrors = (errors: string[]) => {
    props.updateErrors(errors)
  }

  const handleRegisterSuccess = (resp: LoginResponseInterface) => {
    setRegistered(true);
    AnalyticsHelper.logEvent("User", "Register");
    if (props.userRegisteredCallback) props.userRegisteredCallback(resp.user);
  }

  const validateEmail = (email: string) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const u = { ...user }
    switch (e.target.name) {
      case "firstName": u.firstName = e.target.value; break;
      case "lastName": u.lastName = e.target.value; break;
      case "email": u.email = e.target.value; break;
    }
    setUser(u);
  }

  const validate = () => {
    let errors = [];
    if (!user.email?.trim()) errors.push(Locale.label("login.validate.email"));
    else if (!validateEmail(user.email)) errors.push(Locale.label("login.validate.email"));
    if (!user.firstName?.trim()) errors.push(Locale.label("login.validate.firstName"));
    if (!user.lastName?.trim()) errors.push(Locale.label("login.validate.lastName"));
    setErrors(errors);
    return errors.length === 0;
  }

  const register: FormEventHandler = (e) => {
    e.preventDefault();
    props.updateErrors([])
    if (validate()) {
      setIsSubmitting(true);
      ApiHelper.postAnonymous("/users/register", user, "MembershipApi")
        .then((resp: any) => {
          if (resp.errors) handleRegisterErrors(resp.errors);
          else handleRegisterSuccess(resp);
        })
        .catch((e) => { props.updateErrors([e.toString()]); throw e; })
        .finally(() => {
          setIsSubmitting(false)
        });
    } else {
      e.preventDefault();
    }
  };

  const getForm = () => (<>
    <ErrorMessages errors={errors} />
    <form onSubmit={register}>
      <TextField fullWidth name="firstName" label="First Name" value={user.firstName} onChange={handleChange} />
      <TextField fullWidth name="lastName" label="Last Name" value={user.lastName} onChange={handleChange} />
      <TextField fullWidth type="email" name="email" label="Email" value={user.email} onChange={handleChange} />
      <br />
      <Stack direction="row" sx={{ marginTop: 1 }} spacing={1} justifyContent="end">
        {props.loginCallback && (<Button variant="text" onClick={(e) => { e.preventDefault(); props.loginCallback(); }}>{Locale.label("login.login")}</Button>)}
        <Button id="signInButton" variant="contained" disableElevation type="submit" disabled={isSubmitting} color="primary" onClick={register} sx={{ "&:focus": { outline: "none" } }}>
          {isSubmitting ? "Please wait..." : "Register"}
        </Button>
      </Stack>
    </form>
  </>)

  if (registered) return (<p>{Locale.label("login.registerThankYou")}</p>);
  else return getForm();

};
