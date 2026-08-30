import { Config } from '../constants/Config';
import { Donation, ApiResponse } from '../types';
import { apiClient } from '../lib/apiClient';

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
    try {
      const data = await apiClient.post<{ authorizationUrl?: string; reference: string }>('/donations/initialize', {
        ...params,
        publicKey: this.getGatewayPublicKey(params.gateway),
      });
      return { success: true, data: (data as any)?.data ?? data };
    } catch (err: any) {
      return { success: false, data: null as any, error: err.message || 'Initialization failed' };
    }
  },

  async verifyTransaction(reference: string, gateway: Donation['paymentGateway']): Promise<ApiResponse<Donation>> {
    try {
      const data = await apiClient.post<Donation>('/donations/verify', {
        reference,
        gateway,
      });
      return { success: true, data: (data as any)?.data ?? data };
    } catch (err: any) {
      return { success: false, data: null as any, error: err.message || 'Verification failed' };
    }
  },
};

export default PaymentService;
