export interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal";
  provider: "stripe" | "paypal";
  name: string;
  last4?: string;
  email?: string;
}

export interface PaymentGateway {
  id: string;
  provider: "stripe" | "paypal";
  publicKey: string;
  enabled: boolean;
}