import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminBilling } from './pages/admin/AdminBilling';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'shop', Component: ShopPage },
      { path: 'product/:id', Component: ProductDetailPage },
      { path: 'login', Component: LoginPage },
      { path: 'signup', Component: SignupPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'cart', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'admin', Component: AdminDashboard },
      { path: 'admin/products', Component: AdminProducts },
      { path: 'admin/orders', Component: AdminOrders },
      { path: 'admin/billing', Component: AdminBilling },
      { path: 'admin/customers', Component: AdminCustomers },
      { path: '*', Component: NotFound },
    ],
  },
]);
