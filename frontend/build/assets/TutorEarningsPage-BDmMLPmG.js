import { c as createSvgIcon, j as jsxRuntimeExports, r as reactExports, B as Box, R as React } from "./index-C9E49YYM.js";
import { D as DashboardLayout, G as Grid, C as CalendarIcon, a as Card, b as CardContent, A as Avatar, d as Chip } from "./DashboardLayout-CLktiGAC.js";
import { B as Breadcrumbs } from "./Breadcrumbs-ChnP2Vff.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { T as TrendingIcon } from "./TrendingUp-Cgos76ad.js";
import { T as TableContainer, a as Table, b as TableHead, c as TableRow, d as TableCell, e as TableBody } from "./TableRow-lv0MAnSL.js";
import "./Menu-C8O2LlbM.js";
import "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
const WalletIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z"
}), "AccountBalance");
const monthlyData = [
  { month: "T1", amount: 32e5 },
  { month: "T2", amount: 28e5 },
  { month: "T3", amount: 45e5 },
  { month: "T4", amount: 38e5 },
  { month: "T5", amount: 52e5 },
  { month: "T6", amount: 48e5 }
];
const transactions = [
  { id: "TXN001", student: "Nguyễn Minh Anh", avt: "", course: "IELTS Speaking", date: "24/06/2026", amount: 5e5, status: "completed" },
  { id: "TXN002", student: "Trần Hoàng Nam", avt: "", course: "IELTS Writing", date: "23/06/2026", amount: 35e4, status: "completed" },
  { id: "TXN003", student: "Lê Thu Trang", avt: "", course: "Giao tiếp", date: "22/06/2026", amount: 4e5, status: "completed" },
  { id: "TXN004", student: "Phạm Đức Mạnh", avt: "", course: "TOEIC Reading", date: "20/06/2026", amount: 3e5, status: "pending" },
  { id: "TXN005", student: "Vũ Thị Hương", avt: "", course: "Ngữ pháp", date: "18/06/2026", amount: 25e4, status: "completed" },
  { id: "TXN006", student: "Đặng Công Tuấn", avt: "", course: "IELTS Speaking", date: "15/06/2026", amount: 5e5, status: "completed" },
  { id: "TXN007", student: "Nguyễn Minh Anh", avt: "", course: "IELTS Speaking", date: "12/06/2026", amount: 5e5, status: "completed" },
  { id: "TXN008", student: "Lê Thu Trang", avt: "", course: "Giao tiếp", date: "10/06/2026", amount: 6e5, status: "completed" }
];
function TutorEarningsPage() {
  const [loading, setLoading] = reactExports.useState(true);
  const totalEarnings = transactions.filter((t) => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const maxAmount = Math.max(...monthlyData.map((d) => d.amount));
  reactExports.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "tutor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Doanh thu" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800, mb: 3 }, children: "Doanh thu" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, sx: { mb: 4 }, children: [
      { label: "Tổng doanh thu", value: `${totalEarnings.toLocaleString()}đ`, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WalletIcon, {}), color: "#2563EB", bg: "rgba(37,99,235,0.1)" },
      { label: "Tháng này", value: "4.800.000đ", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, {}), color: "#10B981", bg: "rgba(16,185,129,0.1)" },
      { label: "Tăng trưởng", value: "+15%", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingIcon, {}), color: "#F59E0B", bg: "rgba(245,158,11,0.1)" }
    ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, sm: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5, mb: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
        width: 44,
        height: 44,
        borderRadius: 2.5,
        bgcolor: stat.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: 24 } }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h5", sx: { fontWeight: 800 }, children: stat.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: stat.label })
    ] }) }) }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3, mb: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 2 }, children: "Doanh thu theo tháng" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", alignItems: "flex-end", gap: 1.5, height: 160, pt: 2 }, children: monthlyData.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", sx: { fontWeight: 600, color: "text.secondary" }, children: [
          (d.amount / 1e6).toFixed(1),
          "tr"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
          width: "100%",
          height: `${d.amount / maxAmount * 120}px`,
          bgcolor: i === monthlyData.length - 1 ? "primary.main" : "primary.light",
          borderRadius: "6px 6px 0 0",
          transition: "height 0.3s",
          opacity: 0.8
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.disabled", children: d.month })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 2 }, children: "Giao dịch gần đây" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { sx: { bgcolor: "action.hover" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Mã GD" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Học viên" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Khóa học" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Ngày" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Số tiền" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Trạng thái" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: transactions.map((txn) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { hover: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontWeight: 600 }, children: txn.id }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { sx: { width: 28, height: 28, fontSize: "0.7rem", bgcolor: "primary.main" }, children: txn.student.charAt(0) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: txn.student })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: txn.course }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", children: txn.date }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "body2", sx: { fontWeight: 700, color: "success.main" }, children: [
            "+",
            txn.amount.toLocaleString(),
            "đ"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Chip,
            {
              label: txn.status === "completed" ? "Hoàn thành" : "Chờ",
              size: "small",
              color: txn.status === "completed" ? "success" : "warning",
              sx: { fontWeight: 600, fontSize: "0.7rem" }
            }
          ) })
        ] }, txn.id)) })
      ] }) })
    ] }) })
  ] }) });
}
export {
  TutorEarningsPage as default
};
