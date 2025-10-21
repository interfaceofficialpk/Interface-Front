import {
  Wallet,
  Users,
  AppWindow,
  Bell,
  GraduationCap,
  User,
  File,
  Plane,
  FileArchive,
} from "lucide-react";

export const navItems = [
  // Finances
  {
    type: "collapsible",
    icon: Wallet,
    title: "Finances",
    roles: ["Admin", "Employee"],
    permission: ["Finances_Overview", "Incomes_Read", "Expenses_Read"],
    links: [
      {
        to: "/dashboard/finances",
        text: "Overview",
        roles: ["Admin", "Employee"],
        permission: ["Finances_Overview"],
      },
      {
        to: "/dashboard/finances/incomes",
        text: "Incomes",
        roles: ["Admin", "Employee"],
        permission: ["Incomes_Read"],
      },
      {
        to: "/dashboard/finances/expenses",
        text: "Expenses",
        roles: ["Admin", "Employee"],
        permission: ["Expenses_Read"],
      },
    ],
  },

  // Users
  {
    type: "collapsible",
    icon: Users,
    title: "Users",
    roles: ["Admin", "Employee"],
    permission: [
      "Users_Overview",
      "Employees_Read",
      "Partners_Read",
      "Students_Read",
      "Students_Own_Read",
      "ImmigrationClients_Read",
      "ImmigrationClients_Own_Read",
    ],
    links: [
      {
        to: "/dashboard/users",
        text: "Overview",
        roles: ["Admin", "Employee"],
        permission: ["Users_Overview"],
      },
      {
        to: "/dashboard/users/employees",
        text: "Employees",
        roles: ["Admin"],
        permission: ["Employees_Read"],
      },
      {
        to: "/dashboard/users/partners",
        text: "Partners",
        roles: ["Admin"],
        permission: ["Partners_Read"],
      },
      {
        to: "/dashboard/users/students",
        text: "Students",
        roles: ["Admin", "Employee"],
        permission: ["Students_Read"],
      },
      {
        to: "/dashboard/users/my-students",
        text: "My Students",
        roles: ["Employee"],
        permission: ["Students_Own_Read"],
      },
      {
        to: "/dashboard/users/immigration-clients",
        text: "Immigration Clients",
        roles: ["Admin", "Employee"],
        permission: ["ImmigrationClients_Read"],
      },
      {
        to: "/dashboard/users/my-immigration-clients",
        text: "My Immigration Clients",
        roles: ["Employee"],
        permission: ["ImmigrationClients_Own_Read"],
      },
    ],
  },

  // Portal
  {
    type: "collapsible",
    icon: AppWindow,
    title: "Portal",
    roles: ["Admin", "Employee"],
    permission: [
      "Portal_Overview",
      "Locations_Read",
      "Nationalities_Read",
      "UniversityTypes_Read",
      "ProgramTypes_Read",
      "DocumentTypes_Read",
      "ExpenseTypes_Read",
      "IncomeTypes_Read",
      "Currencies_Read",
      "VisaApplicationTypes_Read",
      "ClientSources_Read",
      "CaseTypes_Read",
      "Services_Read",
    ],
    links: [
      {
        to: "/dashboard/portal",
        text: "Overview",
        roles: ["Admin", "Employee"],
        permission: ["Portal_Overview"],
      },
      {
        to: "/dashboard/portal/client-sources",
        text: "Client Sources",
        roles: ["Admin", "Employee"],
        permission: ["ClientSources_Read"],
      },
      {
        to: "/dashboard/portal/locations",
        text: "Locations",
        roles: ["Admin", "Employee"],
        permission: ["Locations_Read"],
      },
      {
        to: "/dashboard/portal/nationalities",
        text: "Nationalities",
        roles: ["Admin", "Employee"],
        permission: ["Nationalities_Read"],
      },
      {
        to: "/dashboard/portal/university-types",
        text: "University Types",
        roles: ["Admin", "Employee"],
        permission: ["UniversityTypes_Read"],
      },
      {
        to: "/dashboard/portal/program-types",
        text: "Program Types",
        roles: ["Admin", "Employee"],
        permission: ["ProgramTypes_Read"],
      },
      {
        to: "/dashboard/portal/document-types",
        text: "Document Types",
        roles: ["Admin", "Employee"],
        permission: ["DocumentTypes_Read"],
      },
      {
        to: "/dashboard/portal/expense-types",
        text: "Expense Types",
        roles: ["Admin", "Employee"],
        permission: ["ExpenseTypes_Read"],
      },
      {
        to: "/dashboard/portal/income-types",
        text: "Income Types",
        roles: ["Admin", "Employee"],
        permission: ["IncomeTypes_Read"],
      },
      {
        to: "/dashboard/portal/currencies",
        text: "Currencies",
        roles: ["Admin", "Employee"],
        permission: ["Currencies_Read"],
      },
      {
        to: "/dashboard/portal/visa-application-types",
        text: "Visa Application Types",
        roles: ["Admin", "Employee"],
        permission: ["VisaApplicationTypes_Read"],
      },
      {
        to: "/dashboard/portal/immigration-client-case-types",
        text: "Immigration Client Case Types",
        roles: ["Admin", "Employee"],
        permission: ["CaseTypes_Read"],
      },
      {
        to: "/dashboard/portal/services",
        text: "Services",
        roles: ["Admin", "Employee"],
        permission: ["Services_Read"],
      },
    ],
  },

  // My Documents
  {
    type: "static",
    icon: File,
    title: "My Documents",
    to: "/dashboard/documents",
    roles: ["Student", "ImmigrationClient"],
    permission: ["Documents_Own_Read"],
  },

  // My Uni Applications
  // {
  //   type: "static",
  //   icon: GraduationCap,
  //   title: "University Applications",
  //   to: "/dashboard/university-applications",
  //   roles: ["Student"],
  //   permission: ["UniversityApplications_Own_Read"],
  // },

  // My Visa Applications
  // {
  //   type: "static",
  //   icon: Plane,
  //   title: "Visa Applications",
  //   to: "/dashboard/visa-applications",
  //   roles: ["Student", "ImmigrationClient"],
  //   permission: ["VisaApplications_Own_Read"],
  // },

  // Universities
  {
    type: "static",
    icon: GraduationCap,
    title: "Universities",
    to: "/dashboard/universities",
    roles: ["Admin", "Employee", "Student"],
    permission: ["Universities_Read"],
  },
  {
    type: "static",
    icon: FileArchive,
    title: "All Documents",
    to: "/dashboard/all-documents",
    roles: ["Admin"],
    // permission: ["Universities_Read"],
  },

  // Communitites
  {
    type: "static",
    icon: Users,
    title: "Communities",
    to: "/dashboard/communities",
    permission: ["Communities_Read"],
  },

  // Notifications
  // {
  //   type: "static",
  //   icon: Bell,
  //   title: "Notifications",
  //   to: "/dashboard/notifications",
  // },

  //Profile
  // {
  //   type: "static",
  //   icon: User,
  //   title: "Profile",
  //   to: "/dashboard/profile",
  // },
];
