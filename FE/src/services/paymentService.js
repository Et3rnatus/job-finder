const API_BASE_URL = "http://127.0.0.1:3001/api/payments";

const paymentService = {
  /**
   * Tạo thanh toán MoMo
   * @param {number} amount
   * @returns {Promise<{payUrl: string, orderId?: string}>}
   */
  createMoMoPayment: async (amount) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/momo/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ amount }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Create MoMo payment failed");
    }

    return res.json();
  },

  /**
   * (DEMO) Lấy lịch sử thanh toán – dùng sau
   */
  getPaymentHistory: async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/history`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      throw new Error("Get payment history failed");
    }

    return res.json();
  },
};

export default paymentService;
