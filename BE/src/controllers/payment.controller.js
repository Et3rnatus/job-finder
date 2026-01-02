const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const vnpayConfig = require("../config/vnpay.config");


 //Tạo URL thanh toán VNPay
exports.createPayment = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const orderId = Date.now().toString();


    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: "Demo thanh toan VNPay",
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: "127.0.0.1",
      vnp_CreateDate: createDate
    };

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: true });
    const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
    const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params.vnp_SecureHash = secureHash;

    const paymentUrl =
      vnpayConfig.vnp_Url + "?" + qs.stringify(vnp_Params, { encode: true });

    return res.json({ paymentUrl });
  } catch (error) {
    console.error("CREATE PAYMENT ERROR ❌:", error);
    return res.status(500).json({ message: "Create payment failed" });
  }
};


// Callback từ VNPay
exports.vnpayReturn = async (req, res) => {
  console.log("VNPay return:", req.query);

  const { vnp_ResponseCode } = req.query;

  if (vnp_ResponseCode === "00") {
    return res.redirect("http://localhost:5173/payment-success");
  }

  return res.redirect("http://localhost:5173/payment-failed");
};


function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();

  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key])
      .replace(/%20/g, "+");
  });

  return sorted;
}
