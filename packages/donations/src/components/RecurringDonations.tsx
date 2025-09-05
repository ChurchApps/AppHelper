"use client";

import React, { useState, useEffect } from "react";
import { DisplayBox } from "@churchapps/apphelper";
import { ApiHelper, UserHelper, CurrencyHelper, DateHelper } from "@churchapps/helpers";
import { Locale } from "../helpers";
import { Permissions, SubscriptionInterface } from "@churchapps/helpers";
import { RecurringDonationsEdit } from ".";
import { Icon, Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";

interface Props { customerId: string, paymentMethods: any[], appName: string, dataUpdate: (message?: string) => void, };

export const RecurringDonations: React.FC<Props> = (props) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionInterface[]>([]);
  const [mode, setMode] = useState("display");
  const [editSubscription, setEditSubscription] = useState<SubscriptionInterface>();

  const loadData = () => {
    if (props.customerId) {
      ApiHelper.get("/customers/" + props.customerId + "/subscriptions", "GivingApi").then((subResult: any) => {
        const subs: SubscriptionInterface[] = [];
        const requests = subResult.data?.map((s: any) => ApiHelper.get("/subscriptionfunds?subscriptionId=" + s.id, "GivingApi").then((subFunds: any) => {
          s.funds = subFunds;
          subs.push(s);
        }));
        if (requests) {
          return Promise.all(requests).then(() => {
            setSubscriptions(subs);
          });
        }
      });
    }
  };

  const handleUpdate = (message?: string) => {
    loadData();
    setMode("display");
    if (message) props.dataUpdate(message);
  };

  const handleEdit = (sub: SubscriptionInterface) => (e: React.MouseEvent) => {
    e.preventDefault();
    setEditSubscription(sub);
    setMode("edit");
  };

  const getPaymentMethod = (sub: SubscriptionInterface) => {
    const pm = props.paymentMethods.find((pm: any) => pm.id === (sub.default_payment_method || sub.default_source));
    if (!pm) return <span style={{ color: "red" }}>{Locale.label("donation.recurring.notFound")}</span>;
    return `${pm.name} ****${pm.last4 || ''}`;
  };

  const getInterval = (subscription: SubscriptionInterface) => {
    const interval = (subscription.plan?.interval_count || 1) + " " + (subscription.plan?.interval || "month");
    return (subscription.plan?.interval_count || 1) > 1 ? interval + "s" : interval;
  };

  const getFunds = (subscription: SubscriptionInterface) => {
    const result: React.ReactElement[] = [];
    subscription.funds?.forEach((fund: any) => {
      result.push(<div key={subscription.id + fund.id}>
          {fund.name} <span style={{ float: "right" }}>{CurrencyHelper.formatCurrency(fund.amount)}</span>
        </div>);
    });
    const total = ((subscription.plan?.amount || 0) / 100);
    result.push(<div key={subscription.id + "-total"} style={{ borderTop: "solid #dee2e6 1px" }}>
        Total <span style={{ float: "right" }}>{CurrencyHelper.formatCurrency(total)}</span>
      </div>);
    return result;
  };

  const getEditOptions = (sub: SubscriptionInterface) => {
    if ((!UserHelper.checkAccess(Permissions.givingApi.settings.edit) && props.appName !== "B1App") || props?.paymentMethods?.length === 0) return null;
    return <button 
      type="button"
      aria-label="edit-button" 
      onClick={handleEdit(sub)} 
      style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6" }}
    >
      <Icon>edit</Icon>
    </button>;
  };

  const getTableHeader = () => {
    const result: React.ReactElement[] = [];
    result.push(<TableRow key="header" sx={{ textAlign: "left" }}><TableCell><b>{Locale.label("donation.recurring.startDate")}</b></TableCell><TableCell><b>{Locale.label("donation.recurring.amount")}</b></TableCell><TableCell><b>{Locale.label("donation.recurring.interval")}</b></TableCell><TableCell><b>{Locale.label("donation.recurring.paymentMethod")}</b></TableCell>{props?.paymentMethods?.length > 0 && <TableCell></TableCell>}</TableRow>);
    return result;
  };

  const getTableRows = () => {
    const rows: React.ReactElement[] = [];

    subscriptions.forEach((sub: any) => {
      rows.push(<TableRow key={sub.id}>
          <TableCell>{DateHelper.prettyDate(new Date((sub.billing_cycle_anchor || 0) * 1000))}</TableCell>
          <TableCell>{getFunds(sub)}</TableCell>
          <TableCell>{Locale.label("donation.recurring.every")} {getInterval(sub)}</TableCell>
          <TableCell className="capitalize">{getPaymentMethod(sub)}</TableCell>
          <TableCell align="right">{getEditOptions(sub)}</TableCell>
        </TableRow>);
    });
    return rows;
  };

  const getSubscriptionsTable = () => (
    <Table>
      <TableHead>{getTableHeader()}</TableHead>
      <TableBody>{getTableRows()}</TableBody>
    </Table>
  );

  useEffect(loadData, []); //eslint-disable-line

  if (!subscriptions.length) return null;
  if (mode === "display") {
    return (
      <DisplayBox data-testid="recurring-donations" headerIcon="restart_alt" headerText="Recurring Donations">
        {getSubscriptionsTable()}
      </DisplayBox>
    );
  }
  if (mode === "edit" && editSubscription) {
    return (
      <RecurringDonationsEdit customerId={props.customerId} paymentMethods={props.paymentMethods} editSubscription={editSubscription} subscriptionUpdated={handleUpdate} />
    );
  }
  return null;
};
