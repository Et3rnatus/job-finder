const API_BASE_URL = "http://127.0.0.1:3001/api/payments";

const paymentService = {
  /**
   * Tạo thanh toán VietQR (DEMO)
   * @param {string} packageId
   * @returns {Promise<{qrUrl: string, orderId: string}>}
   */
  createVietQRPayment: async (packageId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/vietqr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ packageId }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Create VietQR payment failed");
    }

    return res.json();
  },

  /**
   * Admin duyệt thanh toán (DEMO)
   * @param {string} orderId
   */
  approvePayment: async (orderId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ orderId }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Approve payment failed");
    }

    return res.json();
  },

  /**
   * Admin xem danh sách giao dịch (DEMO)
   */
  getAllPayments: async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/admin`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      throw new Error("Get payments failed");
    }

    return res.json();
  },
};

export default paymentService;
