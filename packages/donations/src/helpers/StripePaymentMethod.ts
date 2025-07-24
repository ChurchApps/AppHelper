export class StripePaymentMethod {
  id: string;
  type: string;
  name: string;
  last4: string;
  exp_month?: string;
  exp_year?: string;
  status?: string;
  account_holder_name?: string;
  account_holder_type?: string;

  constructor(obj?: any) {
    this.id = obj?.id || null;
    this.type = obj?.type || (obj?.object && obj.object === "bank_account" ? "bank" : null);
    this.name = obj?.card?.brand || obj?.bank_name || null;
    this.last4 = obj?.last4 || obj?.card?.last4 || null;
    this.exp_month = obj?.exp_month || obj?.card?.exp_month || null;
    this.exp_year = obj?.exp_year || obj?.card?.exp_year || null;
    this.status = obj?.status || null;
    this.account_holder_name = obj?.account_holder_name || "";
    this.account_holder_type = obj?.account_holder_type || "individual";
  }
}