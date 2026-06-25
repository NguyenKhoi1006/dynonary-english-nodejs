import { c as createSvgIcon, j as jsxRuntimeExports, u as useNavigate, q as useAppSelector, r as reactExports, B as Box, R as React } from "./index-C9E49YYM.js";
import { C as CalendarIcon, P as PeopleIcon, M as MessageIcon, D as DashboardLayout, G as Grid, a as Card, b as CardContent, A as Avatar, S as StarIcon, c as SchoolIcon, d as Chip } from "./DashboardLayout-CLktiGAC.js";
import { s as schedulingApi, m as messagingApi, E as ErrorState } from "./ErrorState-Dy_lFwoL.js";
import { B as Breadcrumbs } from "./Breadcrumbs-ChnP2Vff.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-vGqGEVqh.js";
import { E as EmptyState } from "./EmptyState-hcbl-PkZ.js";
import { T as TimeIcon } from "./AccessTime-CPkUHXVu.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { B as Button } from "./Button-xZvr9MJV.js";
import { S as Stack } from "./Stack-Blw_Ey9f.js";
import { S as SearchIcon } from "./Search-C444El5K.js";
import "./Menu-C8O2LlbM.js";
import "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
import "./Skeleton-uoTd0EY2.js";
import "./useThemeProps-BlB5Q0sr.js";
const ArrowIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
}), "ArrowForward");
function formatRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày`;
}
function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((s) => s.user);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [sessions, setSessions] = reactExports.useState([]);
  const [conversations, setConversations] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      schedulingApi.getMySessions("student").catch(() => ({ sessions: [] })),
      messagingApi.getConversations().catch(() => ({ conversations: [] }))
    ]).then(([sessionData, convData]) => {
      if (!cancelled) {
        setSessions(sessionData.sessions || []);
        setConversations(convData.conversations || []);
      }
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Không thể tải dữ liệu");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const upcomingSessions = sessions.filter((s) => s.status === "confirmed" || s.status === "pending");
  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const confirmedCount = upcomingSessions.filter((s) => s.status === "confirmed").length;
  const stats = [
    { label: "Buổi học", value: completedCount.toString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, {}), color: "#2563EB", bg: "rgba(37,99,235,0.1)" },
    { label: "Buổi sắp tới", value: confirmedCount.toString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PeopleIcon, {}), color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
    { label: "Hội thoại", value: conversations.length.toString(), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageIcon, {}), color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    { label: "Học hôm nay", value: upcomingSessions.some((s) => s.date === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)) ? "Có" : "Không", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TimeIcon, {}), color: "#F59E0B", bg: "rgba(245,158,11,0.1)" }
  ];
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: { xs: 2, md: 0 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Lỗi tải dữ liệu", message: error, onRetry: () => window.location.reload() }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mb: 4 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h4", sx: { fontWeight: 800, mb: 0.5 }, children: [
        "Chào",
        (currentUser == null ? void 0 : currentUser.name) ? ` ${currentUser.name}` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", children: upcomingSessions.length > 0 ? `Hôm nay bạn có ${upcomingSessions.filter((s) => s.date === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).length} buổi học.` : "Chào mừng bạn đến với DynoLMS!" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "stats", count: 4 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, sx: { mb: 4 }, children: stats.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 6, md: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: {
      borderRadius: 3,
      transition: "all 0.3s",
      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(0,0,0,0.08)" }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5, "&:last-child": { pb: 2.5 } }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
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
          "Buổi học sắp tới"
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "list", count: 3 }) : upcomingSessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, { sx: { fontSize: 64 } }),
            title: "Chưa có buổi học nào",
            description: "Hãy tìm gia sư và đặt lịch học ngay!",
            actionLabel: "Tìm gia sư",
            onAction: () => navigate("/tutors")
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          upcomingSessions.slice(0, 5).map((s) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { mb: 1.5, borderRadius: 2.5, "&:hover": { transform: "none" } }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2, "&:last-child": { pb: 2 }, display: "flex", alignItems: "center", gap: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { src: s.tutorAvt, sx: { width: 44, height: 44, bgcolor: "primary.main" }, "aria-hidden": "true", children: ((_a = s.tutorName) == null ? void 0 : _a.charAt(0)) || "?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 700 }, children: s.tutorName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: s.courseName || "" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { textAlign: "right" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "primary", sx: { fontWeight: 700, display: "block" }, children: new Date(s.date).toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", children: s.startTime })
              ] })
            ] }) }, s.uid);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              endIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, {}),
              onClick: () => navigate("/sessions"),
              sx: { mt: 1 },
              "aria-label": "Xem tất cả buổi học",
              children: "Xem tất cả"
            }
          )
        ] })
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
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, {}),
              onClick: () => navigate("/tutors"),
              sx: { py: 1.5, justifyContent: "flex-start", pl: 2 },
              fullWidth: true,
              "aria-label": "Tìm gia sư",
              children: "Tìm gia sư"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outlined",
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolIcon, {}),
              onClick: () => navigate("/courses"),
              sx: { py: 1.5, justifyContent: "flex-start", pl: 2 },
              fullWidth: true,
              "aria-label": "Khám phá khóa học",
              children: "Khám phá khóa học"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outlined",
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, {}),
              onClick: () => navigate("/sessions"),
              sx: { py: 1.5, justifyContent: "flex-start", pl: 2 },
              fullWidth: true,
              "aria-label": "Xem lịch học",
              children: "Lịch học"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageIcon, { sx: { fontSize: 18, mr: 0.5, verticalAlign: "middle", color: "#7C3AED" } }),
          "Tin nhắn gần đây"
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "list", count: 3 }) : conversations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageIcon, { sx: { fontSize: 48 } }),
            title: "Chưa có tin nhắn",
            description: "Khi bạn nhận được tin nhắn từ gia sư, chúng sẽ hiển thị ở đây."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          conversations.slice(0, 4).map((conv, i) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { mb: 1, borderRadius: 2.5, "&:hover": { transform: "none" } }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 1.5, "&:last-child": { pb: 1.5 }, display: "flex", alignItems: "center", gap: 1.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { src: conv.userAvt, sx: { width: 36, height: 36, fontSize: "0.9rem", bgcolor: conv.unreadCount > 0 ? "primary.main" : "grey.400" }, "aria-hidden": "true", children: ((_a = conv.userName) == null ? void 0 : _a.charAt(0)) || "?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "subtitle2", sx: { fontWeight: 600, fontSize: "0.85rem" }, children: [
                  conv.userName,
                  conv.unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: conv.unreadCount, size: "small", color: "primary", sx: { ml: 0.5, height: 18, fontSize: "0.65rem" } })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", sx: {
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }, children: conv.lastMessage })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.disabled", children: formatRelativeTime(conv.lastMessageDate) })
            ] }) }, conv.userId);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { endIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, {}), onClick: () => navigate("/messages"), sx: { mt: 0.5 }, "aria-label": "Xem tất cả tin nhắn", children: "Xem tất cả" })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  DashboardPage as default
};
