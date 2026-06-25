import { r as reactExports, j as jsxRuntimeExports, B as Box, I as IconButton } from "./index-C9E49YYM.js";
import { D as DashboardLayout, P as PeopleIcon, a as Card, A as Avatar, d as Chip, M as MessageIcon } from "./DashboardLayout-CLktiGAC.js";
import { s as schedulingApi, E as ErrorState } from "./ErrorState-Dy_lFwoL.js";
import { B as Breadcrumbs } from "./Breadcrumbs-ChnP2Vff.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-vGqGEVqh.js";
import { E as EmptyState } from "./EmptyState-hcbl-PkZ.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { T as TextField } from "./TextField-7kYAUi4b.js";
import { I as InputAdornment } from "./InputAdornment-CzrE54Zk.js";
import { S as SearchIcon } from "./Search-C444El5K.js";
import { T as TableContainer, a as Table, b as TableHead, c as TableRow, d as TableCell, e as TableBody } from "./TableRow-lv0MAnSL.js";
import "./Menu-C8O2LlbM.js";
import "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
import "./Button-xZvr9MJV.js";
import "./Skeleton-uoTd0EY2.js";
import "./useControlled-D8uc4CAn.js";
function TutorStudentsPage() {
  const [search, setSearch] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [students, setStudents] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    schedulingApi.getMySessions("tutor").then((data) => {
      if (!cancelled) {
        const sessions = data.sessions || [];
        const map = /* @__PURE__ */ new Map();
        for (const s of sessions) {
          if (!s.studentId) continue;
          const existing = map.get(s.studentId);
          if (existing) {
            existing.totalSessions++;
            if (s.courseName && !existing.courseNames.includes(s.courseName)) {
              existing.courseNames.push(s.courseName);
            }
            if (s.date > existing.lastSession) {
              existing.lastSession = s.date;
            }
          } else {
            map.set(s.studentId, {
              studentId: s.studentId,
              studentName: s.studentName,
              studentAvt: s.studentAvt,
              courseNames: s.courseName ? [s.courseName] : [],
              totalSessions: 1,
              lastSession: s.date
            });
          }
        }
        setStudents(Array.from(map.values()));
      }
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Không thể tải danh sách học viên");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const filtered = students.filter(
    (s) => s.studentName.toLowerCase().includes(search.toLowerCase())
  );
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "tutor", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: { xs: 2, md: 0 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Lỗi tải dữ liệu", message: error, onRetry: () => window.location.reload() }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "tutor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Học viên" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800, mb: 0.5 }, children: "Học viên của tôi" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 3 }, children: "Quản lý học viên và theo dõi tiến độ" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextField,
      {
        fullWidth: true,
        placeholder: "Tìm học viên...",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        sx: { mb: 3 },
        InputProps: {
          startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(InputAdornment, { position: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, {}) }),
          sx: { borderRadius: 3, bgcolor: "background.paper", maxWidth: 400 }
        }
      }
    ),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "table", count: 6 }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PeopleIcon, { sx: { fontSize: 64 } }),
        title: "Không tìm thấy học viên",
        description: search ? "Thử tìm kiếm với từ khóa khác" : "Bạn chưa có học viên nào. Khi học viên đặt lịch, họ sẽ xuất hiện ở đây."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { sx: { bgcolor: "action.hover" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Học viên" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Khóa học" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Buổi học" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 }, children: "Buổi cuối" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontWeight: 700 } })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((student) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { hover: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { src: student.studentAvt, sx: { width: 36, height: 36, bgcolor: "primary.main", fontSize: "0.9rem" }, children: ((_a = student.studentName) == null ? void 0 : _a.charAt(0)) || "?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: student.studentName }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", gap: 0.5, flexWrap: "wrap" }, children: student.courseNames.length > 0 ? student.courseNames.map((name, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: name, size: "small", variant: "outlined", sx: { height: 22, fontSize: "0.7rem" } }, i)) : /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", children: "Chưa đăng ký" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: student.totalSessions }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", children: student.lastSession ? new Date(student.lastSession).toLocaleDateString("vi-VN") : "N/A" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { size: "small", color: "primary", "aria-label": `Nhắn tin với ${student.studentName}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageIcon, { fontSize: "small" }) }) })
        ] }, student.studentId);
      }) })
    ] }) }) })
  ] }) });
}
export {
  TutorStudentsPage as default
};
