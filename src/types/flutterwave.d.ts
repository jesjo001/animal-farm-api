declare module 'flutterwave-node-v3' {
  interface FlutterwaveConfig {
    publicKey: string;
    secretKey: string;
  }

  interface ChargeData {
    tx_ref: string;
    amount: number;
    currency: string;
    redirect_url: string;
    payment_options: string;
    customer: {
      email: string;
      phonenumber: string;
      name: string;
    };
    customizations: {
      title: string;
      description: string;
      logo: string;
    };
  }

  interface ChargeResponse {
    status: string;
    message: string;
    data: {
      link: string;
    };
  }

  interface VerifyData {
    id: string;
  }

  interface VerifyResponse {
    status: string;
    message: string;
    data: {
      status: string;
      tx_ref: string;
      id: string;
    };
  }

  class Flutterwave {
    constructor(publicKey: string, secretKey: string);

    Charge: {
      card: (data: ChargeData) => Promise<ChargeResponse>;
    };

    Transaction: {
      verify: (data: VerifyData) => Promise<VerifyResponse>;
    };
  }

  export = Flutterwave;
}