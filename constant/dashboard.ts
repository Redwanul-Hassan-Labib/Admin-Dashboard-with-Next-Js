import { IconMapKey } from '@/components/dashboard/dashboard-sidebar';

export const customer = [
  {
    title: 'Dashboard',
    url: '/customer',
    icon: 'LayoutDashboard' as IconMapKey,
  },
  {
    title: 'My Orders',
    url: '/customer/orders',
    icon: 'ShoppingCart' as IconMapKey,
  },
];

export const admin = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: 'LayoutDashboard' as IconMapKey,
  },
  {
    title: 'Orders',
    url: '/admin/orders',
    icon: 'ShoppingCart' as IconMapKey,
  },
  {
    title: 'Products',
    url: '/admin/products',
    icon: 'Package' as IconMapKey,
  },
  {
    title: 'Categories',
    url: '/admin/categories',
    icon: 'Tags' as IconMapKey,
  },
  {
    title: 'Blogs',
    url: '/admin/blogs',
    icon: 'Newspaper' as IconMapKey,
  },
  {
    title: 'Customers',
    url: '/admin/customers',
    icon: 'Users' as IconMapKey,
  },
];

export const sidebar = {
  customer,
  admin,
};
