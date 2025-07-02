import ProductDetail from "../pages/Product/ProductDetail";

const DASHBOARD_PATH = "/dashboard";
const CATEGORY_PATH = `${DASHBOARD_PATH}/category`;
const PRODUCT_PATH = `${DASHBOARD_PATH}/product`;
const PRODUCT_V2_PATH = `${DASHBOARD_PATH}/product-v2`;
const USER_PATH = `${DASHBOARD_PATH}/user`;
const BRANCH_PATH = `${DASHBOARD_PATH}/branch`;
const REPORT_PATH = `${DASHBOARD_PATH}/report`;
const FEEDBACK_PATH = `${DASHBOARD_PATH}/feedback`;
const ORDER_PATH = `${DASHBOARD_PATH}/orders`;
const SIZE_PATH = `${DASHBOARD_PATH}/size`;
const COLOR_PATH = `${DASHBOARD_PATH}/color`;
const PROFILE_PATH = `${DASHBOARD_PATH}/profiledashboard`;

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: DASHBOARD_PATH,
  CATEGORY_DASHBOARD: CATEGORY_PATH,
  PRODUCT_DASHBOARD: PRODUCT_PATH,
  PRODUCT_V2_DASHBOARD: PRODUCT_V2_PATH,
  USER_DASHBOARD: USER_PATH,
  BRANCH_DASHBOARD: BRANCH_PATH,
  REPORT_DASHBOARD: REPORT_PATH,
  FEEDBACK_DASHBOARD: FEEDBACK_PATH,
  ORDER_DASHBOARD: ORDER_PATH,
  SIZE_DASHBOARD: SIZE_PATH,
  COLOR_DASHBOARD: COLOR_PATH,
  PROFILE_DASHBOARD: PROFILE_PATH,
  ABOUT: "/about",
  CONTACT: "/contact",
  PRODUCTDETAIL: "/productdetail",
  CART: "/cart", // Đã thêm "/" để đồng bộ với các route khác
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation", // Thêm đường dẫn cho trang xác nhận đơn hàng
  SHOP: "/shop"
};
