import React, { useState } from "react";
import { ApiHelper } from "../../helpers/ApiHelper";
import { Box, Stack } from "@mui/material";
import { NotificationInterface, UserContextInterface } from "../../interfaces";
import { ArrayHelper, DateHelper, PersonHelper } from "../../helpers";

interface Props {
  context: UserContextInterface;
}

export const Notifications: React.FC<Props> = (props) => {

  const [notifications, setNotifications] = useState<NotificationInterface[]>([]);

  const loadData = async () => {
    const n: NotificationInterface[] = await ApiHelper.get("/notifications/my", "MessagingApi");
    setNotifications(n);
  }

  React.useEffect(() => { loadData(); }, []); //eslint-disable-line

  const getMainLinks = () => {
    let result: JSX.Element[] = [];
    notifications.forEach(notification => {
      let datePosted = new Date(notification.timeSent);
      const displayDuration = DateHelper.getDisplayDuration(datePosted);

      result.push(
        <div className="note" style={{ cursor: "pointer" }} onClick={(e) => { e.preventDefault(); }}>
          <Box sx={{ width: "100%" }} className="note-contents">
            <Stack direction="row" justifyContent="space-between">
              <div>
                <span className="text-grey">{displayDuration}</span>
                <p>{notification.message}</p>
              </div>
            </Stack>
          </Box>
        </div>
      );
    })
    return result;
  }


  return (
    <>
      {getMainLinks()}
    </>
  );
};
