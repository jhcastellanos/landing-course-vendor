export interface Course {
  id: number;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  fullPrice: number;
  discountPercentage: number;
  finalPrice: number;
  isActive?: boolean;
  startDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  courseId: number;
  customerEmail: string;
  customerName?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  approvalUrl: string;
}

export interface CapturePaymentRequest {
  orderId: string;
}

export interface CapturePaymentResponse {
  success: boolean;
  purchaseCode: string;
  message: string;
  transactionId?: string;
}
