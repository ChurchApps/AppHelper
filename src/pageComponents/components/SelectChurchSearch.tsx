import { Button, TextField } from "@mui/material";
import React from "react";
import { ApiHelper, Locale } from "../../helpers"
import { ChurchInterface } from "@churchapps/helpers";
import { SelectableChurch } from "./SelectableChurch";
import { SelectChurchRegister } from "./SelectChurchRegister";

interface Props {
  selectChurch: (churchId: string) => void,
  registeredChurchCallback?: (church: ChurchInterface) => void,
  appName: string
}

export const SelectChurchSearch: React.FC<Props> = (props) => {
  const [searchText, setSearchText] = React.useState("");
  const [churches, setChurches] = React.useState<ChurchInterface[]>(null);
  const [showRegister, setShowRegister] = React.useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = escape(searchText.trim());
    ApiHelper.post("/churches/search", { name: term }, "MembershipApi").then(data => setChurches(data));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(null); } }

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm(Locale.label("selectChurch.confirmRegister"))) {
      setShowRegister(true);
    }
  }

  const getRegisterLink = () => (
    <div>
      <a style={{ display: "block", textAlign: "center" }} href="about:blank" onClick={handleRegisterClick}>
        {Locale.label("selectChurch.register")}
      </a>
    </div>
  )

  const getChurches = () => {
    const result: JSX.Element[] = [];
    churches.forEach(church => {
      result.push(<SelectableChurch church={church} selectChurch={props.selectChurch} />);
    });
    result.push(getRegisterLink());
    return result;
  }

  const getResults = () => {
    if (churches === null) return;
    else if (churches.length === 0) return <><p>{Locale.label("selectChurch.noMatches")}</p>{getRegisterLink()}</>
    else return getChurches();
  }

  if (showRegister) return (<SelectChurchRegister selectChurch={props.selectChurch} registeredChurchCallback={props.registeredChurchCallback} appName={props.appName} initialChurchName={searchText} />)
  else return (
    <>
      <TextField fullWidth name="searchText" label="Name" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown}
        InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" onClick={handleSubmit}>{Locale.label("common.search")}</Button> }}
      />
      {getResults()}
    </>

  );
};
