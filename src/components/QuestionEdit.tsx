import React from "react";
import { MuiTelInput } from "mui-tel-input";
import { AnswerInterface, QuestionInterface } from "@churchapps/helpers";
import { Select, MenuItem, SelectChangeEvent, FormControl, InputLabel, TextField } from "@mui/material";

interface Props {
  answer: AnswerInterface
  question: QuestionInterface,
  noBackground?: boolean,
  changeFunction: (questionId: string, value: string) => void
}

export const QuestionEdit: React.FC<Props> = ({noBackground = false, ...props}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    props.changeFunction(props.question.id, e.target.value);
  }
  let q = props.question;

  if (q.fieldType === "Heading") return <h5>{q.title}</h5>;
  else {
    let input = null;
    let choiceOptions = [];
    if (q.choices !== undefined && q.choices !== null) {
      for (let i = 0; i < q.choices.length; i++) choiceOptions.push(<MenuItem key={i} value={q.choices[i].value}>{q.choices[i].text}</MenuItem>);
    }

    let answerValue = (props.answer === null) ? "" : props.answer.value
    switch (q.fieldType) {
      case "Textbox": input = <TextField fullWidth style={noBackground ? {backgroundColor: "white", borderRadius: "4px"} : {}} label={q.title} placeholder={q.placeholder} value={answerValue} onChange={handleChange} />; break;
      case "Multiple Choice": {
        input = (
          <FormControl fullWidth style={noBackground ? {backgroundColor: "white", borderRadius: "4px"} : {}}>
            <InputLabel>{q.title}</InputLabel>
            <Select fullWidth label={q.title} value={answerValue} onChange={handleChange}>{choiceOptions}</Select>
          </FormControl>);
        break;
      }
      case "Yes/No": {
        input = (
          <FormControl fullWidth style={noBackground ? {backgroundColor: "white", borderRadius: "4px"} : {}}>
            <InputLabel>{q.title}</InputLabel>
            <Select fullWidth label={q.title} value={answerValue} onChange={handleChange}>
              <MenuItem value="False">No</MenuItem>
              <MenuItem value="True">Yes</MenuItem>
            </Select>
          </FormControl>);
        break;
      }
      case "Whole Number":
      case "Decimal":
        input = <TextField fullWidth style={noBackground ? {backgroundColor: "white", borderRadius: "4px"} : {}} type="number" InputLabelProps={{shrink: true}} label={q.title} placeholder={q.placeholder} value={answerValue} onChange={handleChange} />;
        break;
      case "Date": input = <TextField fullWidth style={noBackground ? {backgroundColor: "white", borderRadius: "4px"} : {}} type="date" InputLabelProps={{shrink: true}} label={q.title} placeholder={q.placeholder} value={answerValue} onChange={handleChange} />; break;
      case "Phone Number": input = <MuiTelInput fullWidth style={noBackground ? {backgroundColor: "white", borderRadius: "4px"} : {}} label={q.title} placeholder="" value={answerValue} onChange={(value) => { props.changeFunction(props.question.id, value); }} defaultCountry="US" focusOnSelectCountry excludedCountries={["TA", "AC"]} />; break;
      case "Email": input = <TextField fullWidth style={noBackground ? {backgroundColor: "white", borderRadius: "4px"} : {}} type="email" label={q.title} placeholder="john@doe.com" value={answerValue} onChange={handleChange} />; break;
      case "Text Area": input = <TextField fullWidth style={noBackground ? {backgroundColor: "white", borderRadius: "4px"} : {}} multiline rows={4} label={q.title} placeholder={q.placeholder} value={answerValue} onChange={handleChange} />; break;
      default: return null;
    }
    return input;
  }

}

