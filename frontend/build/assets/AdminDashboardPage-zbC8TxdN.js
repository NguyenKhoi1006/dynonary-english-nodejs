import { r as reactExports, j as jsxRuntimeExports, B as Box, R as React } from "./index-C9E49YYM.js";
import { D as DashboardLayout, G as Grid, a as Card, b as CardContent, d as Chip, P as PeopleIcon, c as SchoolIcon, C as CalendarIcon } from "./DashboardLayout-CLktiGAC.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-vGqGEVqh.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { T as TrendingIcon } from "./TrendingUp-Cgos76ad.js";
import { B as BookIcon } from "./MenuBook-Da2QH-xE.js";
import "./Menu-C8O2LlbM.js";
import "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
import "./Skeleton-uoTd0EY2.js";
const statCards = [
  { label: "Tổng người dùng", value: "1,247", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PeopleIcon, {}), color: "#2563EB", bg: "rgba(37,99,235,0.1)", trend: "+12%" },
  { label: "Tổng gia sư", value: "86", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolIcon, {}), color: "#7C3AED", bg: "rgba(124,58,237,0.1)", trend: "+8%" },
  { label: "Tổng khóa học", value: "234", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookIcon, {}), color: "#10B981", bg: "rgba(16,185,129,0.1)", trend: "+15%" },
  { label: "Tổng buổi học", value: "3,892", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, {}), color: "#F59E0B", bg: "rgba(245,158,11,0.1)", trend: "+23%" }
];
function AdminDashboardPage() {
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { animation: "fadeIn 0.4s ease" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800, mb: 0.5 }, children: "Quản trị hệ thống" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 3 }, children: "Tổng quan hoạt động của nền tảng DynoLMS" }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "stats", count: 4 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, sx: { mb: 4 }, children: statCards.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 6, lg: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5, "&:last-child": { pb: 2.5 } }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
          width: 44,
          height: 44,
          borderRadius: 2.5,
          bgcolor: stat.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: 24 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Chip,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingIcon, { sx: { fontSize: 14 } }),
            label: stat.trend,
            size: "small",
            color: "success",
            variant: "outlined",
            sx: { height: 22, fontSize: "0.7rem" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800 }, children: stat.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: stat.label })
    ] }) }) }, i)) })
  ] }) });
}
export {
  AdminDashboardPage as default
};
