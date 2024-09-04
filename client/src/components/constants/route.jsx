import {
  Dashboard as DashboardIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Message as MessageIcon,
} from "@mui/icons-material";

export const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/user",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chat",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/message",
    icon: <MessageIcon />,
  },
];
