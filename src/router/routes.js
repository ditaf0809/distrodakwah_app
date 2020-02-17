import LoginPage from "pages/Auth/Login";
import CreateAccountPage from "pages/Auth/CreateAccount";
import FreeAccountPage from "pages/Auth/RegisterFreeMember";
import StorefrontPage from "pages/Storefront";
import DetailProductPage from "pages/DetailProduct";
import DashboardPage from "pages/ResellerArea/Dashboard";
import ListCustomerPage from "pages/ResellerArea/ListCustomer";
import ShippingPage from "pages/Shipping";
import OrderSummaryPage from "pages/OrderSummary";
import CartPage from "pages/Cart";
import InvoicePage from "pages/Invoice";
import OrderListPage from "pages/ResellerArea/OrderList";
import DetailOrderPage from "pages/ResellerArea/DetailOrder";
import SettingStorePage from "pages/ResellerArea/SettingStore";
import AllProductBrandPage from "pages/AllProductBrand";
import SearchPage from "pages/Search";
import FeedbackPage from "pages/ResellerArea/Feedback";
import HelpDeskPage from "pages/ResellerArea/HelpDesk";
import DownloadCatalogPage from "pages/ResellerArea/DownloadCatalog";
import ResetPassword from "pages/Auth/ResetPassword";
import UpdatePassword from "pages/Auth/UpdatePassword";
import UpdatePasswordHasToken from "pages/Auth/UpdatePasswordHasToken";
import MaintenancePage from "pages/Maintenance";

import LoginTesting from "pages/Auth/LoginTesting";

const routes = [
  {
    path: "/",
    meta: {
      requiresAuth: true
    },
    component: StorefrontPage
  },
  {
    path: "/activation",
    component: CreateAccountPage
  },
  {
    path: "/resetPassword",
    component: ResetPassword
  },
  {
    path: "/updatePassword",
    component: UpdatePassword
  },
  {
    path: "/updatePassword/HasToken",
    component: UpdatePasswordHasToken
  },
  {
    path: "/free",
    component: FreeAccountPage
  },
  {
    path: "/login/:message?",
    component: LoginPage
  },
  {
    path: "/login-testing/:message?",
    component: LoginTesting
  },
  {
    path: "/detail/:id",
    component: DetailProductPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/cart",
    component: CartPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/shipping",
    component: ShippingPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/orderSummary",
    component: OrderSummaryPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/invoice",
    component: InvoicePage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/orderList/:status?",
    component: OrderListPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/detailOrder/:id",
    component: DetailOrderPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/listCustomer",
    component: ListCustomerPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/settingStore",
    component: SettingStorePage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/allProductBrand/:category/:category_id",
    component: AllProductBrandPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/search",
    component: SearchPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/feedback",
    component: FeedbackPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/helpdesk",
    component: HelpDeskPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/downloadCatalog",
    component: DownloadCatalogPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/maintenance",
    component: MaintenancePage
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
