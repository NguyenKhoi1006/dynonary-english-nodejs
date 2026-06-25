import { c as createSvgIcon, j as jsxRuntimeExports, u as useNavigate, r as reactExports, B as Box, R as React } from "./index-C9E49YYM.js";
import { P as PeopleIcon, C as CalendarIcon, c as SchoolIcon, S as StarIcon, D as DashboardLayout, G as Grid, a as Card, b as CardContent, A as Avatar, d as Chip } from "./DashboardLayout-CLktiGAC.js";
import { s as schedulingApi, E as ErrorState } from "./ErrorState-Dy_lFwoL.js";
import { B as Breadcrumbs } from "./Breadcrumbs-ChnP2Vff.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-vGqGEVqh.js";
import { E as EmptyState } from "./EmptyState-hcbl-PkZ.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { B as Button } from "./Button-xZvr9MJV.js";
import { A as AddIcon } from "./Add-DxeB5otR.js";
import { S as Stack } from "./Stack-Blw_Ey9f.js";
import "./Menu-C8O2LlbM.js";
import "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
import "./Skeleton-uoTd0EY2.js";
import "./useThemeProps-BlB5Q0sr.js";
const ScheduleIcon = createSvgIcon([/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8"
}, "0"), /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
}, "1")], "Schedule");
function TutorDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [sessions, setSessions] = reactExports.useState([]);
  const [reviews, setReviews] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    schedulingApi.getMySessions("tutor").then((data) => {
      if (!cancelled) setSessions(data.sessions || []);
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Không thể tải dữ liệu");
      return { sessions: [] };
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const confirmedCount = sessions.filter((s) => s.status === "confirmed").length;
  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const uniqueStudents = new Set(sessions.map((s) => s.studentId)).size;
  const stats = [
    { label: "Học viên", value: uniqueStudents.toString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PeopleIcon, {}), color: "#2563EB", bg: "rgba(37,99,235,0.1)", trend: "" },
    { label: "Buổi học đang mở", value: confirmedCount.toString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, {}), color: "#7C3AED", bg: "rgba(124,58,237,0.1)", trend: "" },
    { label: "Buổi đã dạy", value: completedCount.toString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolIcon, {}), color: "#10B981", bg: "rgba(16,185,129,0.1)", trend: "" },
    { label: "Hôm nay", value: todaySessions.length.toString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(StarIcon, {}), color: "#F59E0B", bg: "rgba(245,158,11,0.1)", trend: "" }
  ];
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "tutor", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: { xs: 2, md: 0 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Lỗi tải dữ liệu", message: error, onRetry: () => window.location.reload() }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "tutor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Bảng điều khiển" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800 }, children: "Bảng điều khiển" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", children: todaySessions.length > 0 ? `Hôm nay bạn có ${todaySessions.length} buổi học.` : "Chào mừng trở lại!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "contained", startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, {}), onClick: () => navigate("/my-courses"), "aria-label": "Tạo khóa học mới", children: "Tạo khóa học mới" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "stats", count: 4 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, sx: { mb: 4 }, children: stats.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 6, lg: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3, transition: "all 0.3s", "&:hover": { transform: "translateY(-4px)" } }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5, "&:last-child": { pb: 2.5 } }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
        width: 44,
        height: 44,
        borderRadius: 2.5,
        bgcolor: stat.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: 24 } }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800 }, children: stat.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: stat.label })
    ] }) }) }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 3, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { item: true, xs: 12, md: 7, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, { sx: { fontSize: 18, mr: 0.5, verticalAlign: "middle", color: "primary.main" } }),
          "Hôm nay"
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "list", count: 4 }) : todaySessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, { sx: { fontSize: 64 } }),
            title: "Hôm nay không có buổi học nào",
            description: "Bạn có thể cài đặt lịch dạy để học viên đặt lịch.",
            actionLabel: "Cài đặt lịch"
          }
        ) : todaySessions.map((s) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { mb: 1.5, borderRadius: 2.5, "&:hover": { transform: "none" } }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2, "&:last-child": { pb: 2 }, display: "flex", alignItems: "center", gap: 2 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { src: s.studentAvt, sx: { width: 40, height: 40, bgcolor: "secondary.main" }, "aria-hidden": "true", children: ((_a = s.studentName) == null ? void 0 : _a.charAt(0)) || "?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 700 }, children: s.studentName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", children: s.courseName || "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { textAlign: "right" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", sx: { fontWeight: 600, display: "block" }, children: [
                s.startTime,
                " - ",
                s.endTime
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: s.status === "confirmed" ? "Đã xác nhận" : s.status === "pending" ? "Chờ" : s.status === "completed" ? "Hoàn thành" : "Đã hủy",
                  size: "small",
                  color: s.status === "confirmed" ? "info" : s.status === "pending" ? "warning" : s.status === "completed" ? "success" : "error",
                  sx: { height: 20, fontSize: "0.65rem", mt: 0.3 }
                }
              )
            ] })
          ] }) }, s.uid);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { item: true, xs: 12, md: 5, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StarIcon, { sx: { fontSize: 18, mr: 0.5, verticalAlign: "middle", color: "#F59E0B" } }),
          "Truy cập nhanh"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 1.5, sx: { mb: 3 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "contained",
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, {}),
              onClick: () => navigate("/my-courses"),
              sx: { py: 1.5, justifyContent: "flex-start", pl: 2 },
              fullWidth: true,
              "aria-label": "Tạo khóa học mới",
              children: "Tạo khóa học mới"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outlined",
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(ScheduleIcon, {}),
              sx: { py: 1.5, justifyContent: "flex-start", pl: 2 },
              fullWidth: true,
              "aria-label": "Cài đặt lịch dạy",
              children: "Cài đặt lịch dạy"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outlined",
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(PeopleIcon, {}),
              onClick: () => navigate("/students"),
              sx: { py: 1.5, justifyContent: "flex-start", pl: 2 },
              fullWidth: true,
              "aria-label": "Xem học viên",
              children: "Xem học viên"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
export {
  TutorDashboardPage as default
};
