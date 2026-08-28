import { Config } from '../constants/Config';
import { Donation, ApiResponse } from '../types';
import api from './api';

export interface PaymentInitializationParams {
  amount: number;
  currency: string;
  email: string;
  category: Donation['category'];
  gateway: Donation['paymentGateway'];
  phoneNumber?: string;
  isAnonymous?: boolean;
}

export const PaymentService = {
  getGatewayPublicKey(gateway: Donation['paymentGateway']): string {
    switch (gateway) {
      case 'Paystack':
        return Config.paystackPublicKey;
      case 'Flutterwave':
        return Config.flutterwavePublicKey;
      case 'Stripe':
        return Config.stripePublicKey;
      case 'Mobile Money (MoMo)':
        return Config.momoPrimaryKey;
      default:
        return '';
    }
  },

  async initializeTransaction(params: PaymentInitializationParams): Promise<ApiResponse<{ authorizationUrl?: string; reference: string }>> {
    return api.post('/donations/initialize', {
      ...params,
      publicKey: this.getGatewayPublicKey(params.gateway)
    });
  },

  async verifyTransaction(reference: string, gateway: Donation['paymentGateway']): Promise<ApiResponse<Donation>> {
    return api.post<Donation>('/donations/verify', {
      reference,
      gateway
    });
  }
};

export default PaymentService;
