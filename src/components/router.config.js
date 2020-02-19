import LeaveDetailPage from '../container/LeaveDetaiPage';
import LeaveEditPage from '../container/LeaveEditPage';
import TestPage from '../container/TestPage';
import ContractManagementPage from './../container/ContractManagement';
import ContractNewPage from './../container/ContractNew';
import DayOffSettingPage from './../container/DayOffSetting';
import DepartmentPage from './../container/Department';
import DepartmentNewPage from './../container/DepartmentNew';
import MyNotifyPage from './../container/MyNotify';
import MyNotifyDetailPage from './../container/MyNotifyDetail';
import NotificationPage from './../container/Notification';
import NotificationNewPage from './../container/NotificationNew';
import PayrollPage from './../container/Payroll';
import SettingPage from './../container/Setting';
import StaffPage from './../container/Staff';
import StaffCheckingPage from './../container/StaffChecking';
import StaffCheckingNewPage from './../container/StaffCheckingNew';
import StaffEditPage from './../container/StaffEdit';
import StaffLeavePage from './../container/StaffLeave';
import StaffLeaveNewPage from './../container/StaffLeaveNew';
import StaffNewPage from './../container/StaffNew';

export default [
  {
    path: "/",
    component: StaffPage,
  },
  {
    path: "/staffs",
    exact: true,
    component: StaffPage,
  },
  {
    path: "/staffs/edit/:editUser",
    exact: true,
    component: StaffEditPage,
  },
  {
    path: "/departments",
    exact: true,
    component: DepartmentPage,
  },
  {
    path: "/setting",
    exact: true,
    component: SettingPage
  },
  {
    path: "/staffs/new",
    exact: true,
    component: StaffNewPage
  },
  {
    path: "/departments/new",
    exact: true,
    component: DepartmentNewPage
  },
  {
    path: "/checking",
    exact: true,
    component: StaffCheckingPage
  },
  {
    path: "/checking/new",
    exact: true,
    component: StaffCheckingNewPage
  },
  {
    path: "/leaves",
    exact: true,
    component: StaffLeavePage
  },
  {
    path: "/leaves/new",
    exact: true,
    component: StaffLeaveNewPage
  },
  {
    path: "/leaves/:id",
    exact: true,
    component: LeaveDetailPage
  },
  {
    path: "/leaves/:id/edit",
    exact: true,
    component: LeaveEditPage
  },
  {
    path: "/contracts",
    exact: true,
    component: ContractManagementPage
  },
  {
    path: "/contracts/new",
    exact: true,
    component: ContractNewPage
  },
  {
    path: "/notifies",
    exact: true,
    component: NotificationPage
  },
  {
    path: "/notifies/new",
    exact: true,
    component: NotificationNewPage
  },
  {
    path: "/setting/day-off",
    exact: true,
    component: DayOffSettingPage
  },
  {
    path: "/payroll",
    exact: true,
    component: PayrollPage
  },
  {
    path: "/my-notifies",
    exact: true,
    component: MyNotifyPage
  },
  {
    path: "/my-notifies/:id",
    exact: true,
    component: MyNotifyDetailPage
  },
  {
    path: "/test",
    exact: true,
    component: TestPage,
  },
];
