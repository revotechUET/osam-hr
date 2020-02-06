import HomePage from './../container/HomePage';
import PrivatePage from './../container/PrivatePage';
import SettingPage from './../container/Setting';
import StaffPage from './../container/Staff';
import DepartmentPage from './../container/Department';
import StaffEditPage from './../container/StaffEdit';
import StaffNewPage from './../container/StaffNew';
import StaffCheckingPage from './../container/StaffChecking';
import StaffCheckingNewPage from './../container/StaffCheckingNew';
import DepartmentNewPage from './../container/DepartmentNew';
import StaffLeavePage from './../container/StaffLeave';
import StaffLeaveNewPage from './../container/StaffLeaveNew';
import ContractManagementPage from './../container/ContractManagement';
import ContractNewPage from './../container/ContractNew';
import NotificationPage from './../container/Notification';
import NotificationNewPage from './../container/NotificationNew';
import DayOffSettingPage from './../container/DayOffSetting';
import PayrollPage from './../container/Payroll';
import MyNotifyPage from './../container/MyNotify';
import MyNotifyDetailPage from './../container/MyNotifyDetail';

export default [
    {
        type: "normal",
        path: "/staffs",
        exact: true,
        component: StaffPage,
    },
    {
        type: "normal",
        path: "/staffs/edit/:editUser",
        exact: true,
        component: StaffEditPage,
    },
    {
        type: "normal",
        path: "/departments",
        exact: true,
        component: DepartmentPage,
    },
    {
        type: "normal",
        path: "/setting",
        exact: true,
        component: SettingPage
    },
    {
        type: "normal",
        path: "/staffs/new",
        exact: true,
        component: StaffNewPage
    },
    {
        type: "normal",
        path: "/departments/new",
        exact: true,
        component: DepartmentNewPage
    },
    {
        type: "normal",
        path: "/checking",
        exact: true,
        component: StaffCheckingPage
    },
    {
        type: "normal",
        path: "/checking/new",
        exact: true,
        component: StaffCheckingNewPage
    },
    {
        type: "normal",
        path: "/leaves",
        exact: true,
        component: StaffLeavePage
    },
    {
        type: "normal",
        path: "/leaves/new",
        exact: true,
        component: StaffLeaveNewPage
    },
    {
        type: "normal",
        path: "/contracts",
        exact: true,
        component: ContractManagementPage
    },
    {
        type: "normal",
        path: "/contracts/new",
        exact: true,
        component: ContractNewPage
    },
    {
        type: "normal",
        path: "/notifies",
        exact: true,
        component: NotificationPage
    },
    {
        type: "normal",
        path: "/notifies/new",
        exact: true,
        component: NotificationNewPage
    },
    {
        type: "normal",
        path: "/setting/day-off",
        exact: true,
        component: DayOffSettingPage
    },
    {
        type: "normal",
        path: "/payroll",
        exact: true,
        component: PayrollPage
    },
    {
        type: "normal",
        path: "/my-notifies",
        exact: true,
        component: MyNotifyPage
    },
    {
        type: "normal",
        path: "/my-notifies/:id",
        exact: true,
        component: MyNotifyDetailPage
    }
];