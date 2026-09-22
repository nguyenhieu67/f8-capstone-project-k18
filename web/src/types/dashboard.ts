export interface DashboardLeaderboardRowI {
  id: number; // employee id
  fullName: string;
  ordersCount: number;
  salesVolume: number;
  commissionRate: number;
  commission: number;
}

export interface DashboardRejectionReasonI {
  reason: string;
  count: number;
  percent: number;
}

export interface DashboardTrendPointI {
  month: string;
  revenue: number;
  leadsCount: number;
  registeredStudents: number;
}

export interface DashboardResultI {
  month: string;
  revenue: {
    current: number;
    previous: number;
    changePercent: number | null;
  };
  leads: {
    total: number;
    converted: number;
    conversionRate: number;
  };
  registeredStudents: number;
  payrollTotal: number;
  leaderboard: DashboardLeaderboardRowI[];
  rejectionReasons: DashboardRejectionReasonI[];

  trend: DashboardTrendPointI[];
}
