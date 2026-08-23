import {
  ChartPieIcon,
  RectangleAdIcon,
  FilterCircleDollarIcon,
  TrophyIcon,
  ChalkboardUserIcon,
  ClipboardUserIcon,
  BusinessTimeIcon,
  FileInvoiceDollarIcon,
  UsersGroupIcon,
} from "@/components/Icons";

export interface NavItemConfig {
  id: string;
  translationKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavSectionConfig {
  translationKey: string;
  items: NavItemConfig[];
}

export const navigationSections: NavSectionConfig[] = [
  {
    translationKey: "dashboardPage.sidebar.sections.overview",
    items: [
      {
        id: "dashboard",
        translationKey: "dashboardPage.sidebar.items.dashboard",
        icon: ChartPieIcon,
      },
    ],
  },
  {
    translationKey: "dashboardPage.sidebar.sections.salesAndAds",
    items: [
      {
        id: "source",
        translationKey: "dashboardPage.sidebar.items.adSources",
        icon: RectangleAdIcon,
      },
      {
        id: "presale",
        translationKey: "dashboardPage.sidebar.items.preSalesData",
        icon: FilterCircleDollarIcon,
      },
      {
        id: "saleresult",
        translationKey: "dashboardPage.sidebar.items.salesResults",
        icon: TrophyIcon,
      },
    ],
  },
  {
    translationKey: "dashboardPage.sidebar.sections.trainingAndStudents",
    items: [
      {
        id: "classe",
        translationKey: "dashboardPage.sidebar.items.classList",
        icon: ChalkboardUserIcon,
      },
      {
        id: "studentattendance",
        translationKey: "dashboardPage.sidebar.items.studentAttendance",
        icon: ClipboardUserIcon,
      },
    ],
  },
  {
    translationKey: "dashboardPage.sidebar.sections.hrAndPayroll",
    items: [
      {
        id: "employee",
        translationKey: "dashboardPage.sidebar.items.employeeList",
        icon: UsersGroupIcon,
      },
      {
        id: "stafftimekeeping",
        translationKey: "dashboardPage.sidebar.items.staffTimekeeping",
        icon: BusinessTimeIcon,
      },
      {
        id: "payroll",
        translationKey: "dashboardPage.sidebar.items.payrollAndCommissions",
        icon: FileInvoiceDollarIcon,
      },
    ],
  },
];

export function findNavItemById(id: string): NavItemConfig | undefined {
  for (const section of navigationSections) {
    const item = section.items.find((i) => i.id === id);
    if (item) return item;
  }
  return undefined;
}
