'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Course } from '@/types';
import { paymentApi } from '@/lib/api';

interface CheckoutModalProps {
  course: Course;
  onClose: () => void;
}

export default function CheckoutModal({ course, onClose }: CheckoutModalProps) {
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [purchaseCode, setPurchaseCode] = useState('');
  const [error, setError] = useState('');

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const isPayPalConfigured = paypalClientId && paypalClientId !== 'YOUR_PAYPAL_CLIENT_ID';

  const handleCreateOrder = async () => {
    try {
      setError('');
      const response = await paymentApi.createOrder({
        courseId: course.id,
        customerEmail,
        customerName,
      });
      return response.orderId;
    } catch (err) {
      setError('Failed to create order. Please try again.');
      throw err;
    }
  };

  const handleApprove = async (data: any) => {
    try {
      setProcessing(true);
      const response = await paymentApi.captureOrder({
        orderId: data.orderID,
      });

      if (response.success) {
        setPurchaseCode(response.purchaseCode);
        setSuccess(true);
      } else {
        setError(response.message || 'Payment failed');
      }
    } catch (err) {
      setError('Failed to process payment. Please contact support.');
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid = customerEmail && customerEmail.includes('@');

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Purchase Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for purchasing <strong>{course.name}</strong>
          </p>
          <div className="bg-gray-50 border-2 border-primary rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Your Purchase Code</p>
            <p className="text-xl font-bold text-primary tracking-wider">
              {purchaseCode}
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            We've sent a confirmation email to <strong>{customerEmail}</strong> with your purchase code.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Course Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price:</span>
              <div className="flex items-center gap-2">
                {course.discountPercentage > 0 && (
                  <span className="text-gray-500 line-through text-sm">
                    ${course.fullPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-bold text-primary">
                  ${course.finalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Payment Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Method
            </h3>
            {!isFormValid ? (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                  Please enter your email address to continue with payment
                </p>
              </div>
            ) : !isPayPalConfigured ? (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 mb-2">PayPal Not Configured</h4>
                    <p className="text-sm text-yellow-800 mb-3">
                      The PayPal payment gateway is not yet configured. To enable payments:
                    </p>
                    <ol className="text-sm text-yellow-800 list-decimal list-inside space-y-1 mb-3">
                      <li>Create a PayPal Business account or Sandbox account at <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="underline">developer.paypal.com</a></li>
                      <li>Get your Client ID from the PayPal Developer Dashboard</li>
                      <li>Add it to the <code className="bg-yellow-100 px-1 py-0.5 rounded">.env.local</code> file</li>
                    </ol>
                    <div className="bg-yellow-100 rounded p-3 font-mono text-xs">
                      NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id_here
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="paypal-button-container">
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: 'USD',
                    intent: 'capture',
                    disableFunding: 'paylater,credit',
                  }}
                >
                  <PayPalButtons
                    disabled={processing}
                    createOrder={handleCreateOrder}
                    onApprove={handleApprove}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      setError('Payment failed. Please try again.');
                    }}
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'paypal',
                      height: 55,
                    }}
                    forceReRender={[customerEmail]}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-sm text-gray-500 text-center">
            <p>Secure payment powered by PayPal</p>
            <p className="mt-1">Accepts PayPal, Visa, and Mastercard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
