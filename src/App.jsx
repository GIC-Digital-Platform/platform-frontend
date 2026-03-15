import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import {
  CoffeeOutlined,
  TeamOutlined,
  ShopFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import CafesPage from './pages/cafes/CafesPage';
import AddEditCafePage from './pages/cafes/AddEditCafePage';
import EmployeesPage from './pages/employees/EmployeesPage';
import AddEditEmployeePage from './pages/employees/AddEditEmployeePage';

const { Sider, Content } = Layout;

const NAV_ITEMS = [
  { key: 'cafes', to: '/cafes', icon: <ShopFilled />, label: 'Cafes' },
  { key: 'employees', to: '/employees', icon: <TeamOutlined />, label: 'Employees' },
];

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const activeKey = location.pathname.startsWith('/employees') ? 'employees' : 'cafes';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
        collapsedWidth={64}
        collapsed={collapsed}
        className="app-sidebar"
      >
        {/* Header */}
        <div className="sidebar-brand" style={{ flexDirection: 'column', alignItems: collapsed ? 'center' : 'flex-start' }}>
          <div className="sidebar-brand-icon">
            <CoffeeOutlined style={{ fontSize: 20, color: '#fff' }} />
          </div>
          {!collapsed && (
            <div>
              <div className="sidebar-brand-name">Café Employee</div>
              <div className="sidebar-brand-sub">MANAGEMENT SYSTEM</div>
            </div>
          )}
        </div>

        {/* Page Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ key, to, icon, label }) => (
            <NavLink
              key={key}
              to={to}
              title={collapsed ? label : undefined}
              className={`sidebar-nav-item ${activeKey === key ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
            >
              <span className="sidebar-nav-icon">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          {!collapsed && <span>Collapse</span>}
        </div>
      </Sider>

      <Layout style={{ background: '#f5f2ef' }}>
        <Content style={{ background: '#f5f2ef' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/cafes" replace /> },
      { path: 'cafes', element: <CafesPage /> },
      { path: 'cafes/new', element: <AddEditCafePage /> },
      { path: 'cafes/edit/:id', element: <AddEditCafePage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'employees/new', element: <AddEditEmployeePage /> },
      { path: 'employees/edit/:id', element: <AddEditEmployeePage /> },
      { path: '*', element: <Navigate to="/cafes" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
