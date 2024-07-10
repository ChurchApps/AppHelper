import React from "react"
import { useNavigate } from "react-router-dom"
import { UserHelper, ApiHelper, Locale } from "../helpers";
import { Permissions, PersonInterface, HouseholdInterface } from "@churchapps/helpers";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material"
import { ErrorMessages } from "./ErrorMessages"
import { useMountedState } from "../hooks/useMountedState"

interface CommonProps {
  navigateOnCreate?: boolean;
  onCreate?: (person: PersonInterface) => void;
}

type ConditionalProps = 
  | { showInModal: true; onClose: () => void; }
  | { showInModal?: false; onClose?: never; }

type Props = CommonProps & ConditionalProps

export function CreatePerson({ navigateOnCreate = true, onCreate = () => {}, showInModal = false, ...props }: Props) {
  const navigate = useNavigate()
  const [person, setPerson] = React.useState<PersonInterface>({ name: { first: "", last: "" }, contactInfo: {} });
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isMounted = useMountedState()

  const validate = () => {
    const result = [];
    if (!person.name?.first) result.push("Please enter a first name.");
    if (!person.name?.last) result.push("Please enter a last name.");
    setErrors(result);
    return result.length === 0;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const p = { ...person } as PersonInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "first": p.name.first = value; break;
      case "last": p.name.last = value; break;
      case "email": p.contactInfo.email = value; break;
    }
    setPerson(p);
  }

  function handleSubmit() {
    let household = { name: person.name.last } as HouseholdInterface;
    if (validate()) {
      setIsSubmitting(true);
      ApiHelper.post("/households", [household], "MembershipApi").then(data => {
        household.id = data[0].id;
        person.householdId = household.id;
        person.name.display = [person.name.first, person.name.last].join(" ");
        ApiHelper.post("/people", [person], "MembershipApi").then(data => {
          person.id = data[0].id
          onCreate(person);
          setPerson({...person, name: { first: "", last: "" }, contactInfo: { email: "" }});
          navigateOnCreate && navigate("/people/" + person.id);
        }).finally(() => {
          if (isMounted()) {
            setIsSubmitting(false);
            showInModal && props.onClose();
          }
        });
      });
    }
  }

  if (!UserHelper.checkAccess(Permissions.membershipApi.people.edit)) return null;
  if (showInModal) {
    return(
      <>
        <ErrorMessages errors={errors} />
        <Dialog open onClose={props.onClose} fullWidth>
          <DialogTitle>{Locale.label("createPerson.addNewPerson")}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" required fullWidth type="text" aria-label="firstName" label={Locale.label("createPerson.firstName")} name="first" value={person.name.first || ""} onChange={handleChange} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit} />
            <TextField margin="dense" required fullWidth type="text" aria-label="lastName" label={Locale.label("createPerson.lastName")} name="last" value={person.name.last || ""} onChange={handleChange} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit} />
            <TextField margin="dense" fullWidth type="text" aria-label="email" label={Locale.label("createPerson.email")} name="email" value={person.contactInfo.email || ""} onChange={handleChange} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { props.onClose(); }}>{Locale.label("common.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting} onClick={handleSubmit}>{Locale.label("common.add")}</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
  return (
    <div>
      <p className="pl-1 mb-3 text-dark"><b>{Locale.label("createPerson.addNewPerson")}</b></p>
      <ErrorMessages errors={errors} />
      <Grid container spacing={3} alignItems="center">
        <Grid item md={6} xs={12}>
          <TextField size="small" margin="none" required fullWidth type="text" aria-label="firstName" label={Locale.label("createPerson.firstName")} name="first" value={person.name.first || ""} onChange={handleChange} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit} />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField size="small" margin="none" required fullWidth type="text" aria-label="lastName" label={Locale.label("createPerson.lastName")} name="last" value={person.name.last || ""} onChange={handleChange} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit} />
        </Grid>
        <Grid item xs={12}>
          <TextField size="small" margin="none" fullWidth type="text" aria-label="email" label={Locale.label("createPerson.email")} name="email" value={person.contactInfo.email || ""} onChange={handleChange} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit} />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} onClick={handleSubmit}>{Locale.label("common.add")}</Button>
        </Grid>
      </Grid>
    </div>
  )
}
