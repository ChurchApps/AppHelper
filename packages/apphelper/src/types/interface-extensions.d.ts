// Interface extensions for donation functionality
declare module "@churchapps/helpers" {
  interface StripeDonationInterface {
    provider?: "stripe" | "paypal";
    gatewayId?: string;
  }

  interface PaymentMethodInterface {
    gatewayId?: string;
  }

  interface StripeCardUpdateInterface {
    provider?: "stripe" | "paypal";
    gatewayId?: string;
  }

  interface StripeBankAccountUpdateInterface {
    provider?: "stripe" | "paypal";
    gatewayId?: string;
  }

  interface StripeBankAccountVerifyInterface {
    provider?: "stripe" | "paypal";
    gatewayId?: string;
  }

  interface SubscriptionInterface {
    gatewayId?: string;
  }

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
    provider?: "stripe" | "paypal";
    gatewayId?: string;

    constructor(obj?: any);
  }
}