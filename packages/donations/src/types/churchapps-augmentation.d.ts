import "@churchapps/helpers";

declare module "@churchapps/helpers" {
  interface PaymentMethodInterface {
    gatewayId?: string;
  }

  interface StripeCardUpdateInterface {
    gatewayId?: string;
    provider?: "stripe" | "paypal";
  }

  interface StripeBankAccountUpdateInterface {
    gatewayId?: string;
    provider?: "stripe" | "paypal";
  }

  interface StripeBankAccountVerifyInterface {
    gatewayId?: string;
    provider?: "stripe" | "paypal";
  }

  interface StripeDonationInterface {
    gatewayId?: string;
    provider?: "stripe" | "paypal";
  }

  interface MultiGatewayDonationInterface {
    gatewayId?: string;
  }

  interface PayPalDonationInterface {
    gatewayId?: string;
  }

  interface SubscriptionInterface {
    gatewayId?: string;
  }
}
