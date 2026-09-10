import SSLCommerzPayment from "sslcommerz-lts";
import env from "./env.js";

const sslcz = new SSLCommerzPayment(
  env.SSLCOMMERZ_STORE_ID,
  env.SSLCOMMERZ_STORE_PASSWORD,
  env.SSLCOMMERZ_IS_LIVE,
);

export default sslcz;
