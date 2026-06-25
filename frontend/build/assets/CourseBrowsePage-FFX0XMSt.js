import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Box } from "./index-C9E49YYM.js";
import { D as DashboardLayout, d as Chip, G as Grid, a as Card, b as CardContent, c as SchoolIcon, P as PeopleIcon, S as StarIcon } from "./DashboardLayout-CLktiGAC.js";
import { c as courseApi, E as ErrorState } from "./ErrorState-Dy_lFwoL.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { T as TextField } from "./TextField-7kYAUi4b.js";
import { I as InputAdornment } from "./InputAdornment-CzrE54Zk.js";
import { S as SearchIcon } from "./Search-C444El5K.js";
import { S as Skeleton } from "./Skeleton-uoTd0EY2.js";
import { T as TimeIcon } from "./AccessTime-CPkUHXVu.js";
import { P as Pagination } from "./Pagination-D6uK--yH.js";
import "./Menu-C8O2LlbM.js";
import "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
import "./Button-xZvr9MJV.js";
import "./useControlled-D8uc4CAn.js";
const levels = ["Tất cả", "Beginner", "Intermediate", "Advanced", "Expert"];
const subjects = ["Tất cả", "English", "Math", "Science", "Programming"];
function CourseBrowsePage() {
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [activeLevel, setActiveLevel] = reactExports.useState("Tất cả");
  const [activeSubject, setActiveSubject] = reactExports.useState("Tất cả");
  const [courses, setCourses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [page, setPage] = reactExports.useState(1);
  const [total, setTotal] = reactExports.useState(0);
  const pageSize = 20;
  reactExports.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    courseApi.list({
      page,
      pageSize,
      subject: activeSubject !== "Tất cả" ? activeSubject : void 0,
      level: activeLevel !== "Tất cả" ? activeLevel.toLowerCase() : void 0
    }).then((data) => {
      if (!cancelled) {
        setCourses(data.courses || []);
        setTotal(data.total || 0);
      }
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Không thể tải danh sách khóa học");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [page, activeLevel, activeSubject]);
  const filtered = courses.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.tutorName.toLowerCase().includes(q);
  });
  const gradientForSubject = (subject) => {
    const map = {
      English: "#2563EB, #1D4ED8",
      Programming: "#7C3AED, #5B21B6",
      Math: "#10B981, #059669",
      Science: "#F59E0B, #D97706"
    };
    return map[subject] || "#64748B, #475569";
  };
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: { xs: 2, md: 0 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Lỗi tải dữ liệu", message: error, onRetry: () => window.location.reload() }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { animation: "fadeIn 0.4s ease" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800, mb: 0.5 }, children: "Khóa học" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 3 }, children: "Nâng cao kiến thức với các khóa học chất lượng" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextField,
      {
        fullWidth: true,
        placeholder: "Tìm khóa học...",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        sx: { mb: 2 },
        InputProps: {
          startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(InputAdornment, { position: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, {}) }),
          sx: { borderRadius: 3, bgcolor: "background.paper" }
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }, children: subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Chip,
      {
        label: s,
        onClick: () => {
          setActiveSubject(s);
          setPage(1);
        },
        color: activeSubject === s ? "primary" : "default",
        variant: activeSubject === s ? "filled" : "outlined",
        sx: { fontWeight: 600, borderRadius: 2 }
      },
      s
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }, children: levels.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Chip,
      {
        label: l,
        onClick: () => {
          setActiveLevel(l);
          setPage(1);
        },
        color: activeLevel === l ? "secondary" : "default",
        variant: activeLevel === l ? "filled" : "outlined",
        sx: { fontWeight: 600, borderRadius: 2 }
      },
      l
    )) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, sm: 6, lg: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { sx: { borderRadius: 3, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rectangular", height: 140 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "80%" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "50%" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", width: 100, height: 22, sx: { my: 1 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "60%" })
      ] })
    ] }) }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { textAlign: "center", py: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", color: "text.secondary", children: "Không tìm thấy khóa học phù hợp" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, children: filtered.map((course) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, sm: 6, lg: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          sx: {
            borderRadius: 3,
            cursor: "pointer",
            height: "100%",
            transition: "all 0.25s",
            "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(0,0,0,0.1)" }
          },
          onClick: () => navigate(`/courses/${course.uid}`),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
              height: 140,
              borderRadius: "12px 12px 0 0",
              background: `linear-gradient(135deg, ${gradientForSubject(course.subject)})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolIcon, { sx: { fontSize: 48, color: "rgba(255,255,255,0.3)" } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle1", sx: { fontWeight: 700, mb: 0.5 }, children: course.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", sx: { display: "block", mb: 1 }, children: course.tutorName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 0.5, mb: 1.5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: course.level, size: "small", variant: "outlined", sx: { height: 22, fontSize: "0.7rem" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: course.subject, size: "small", color: "primary", variant: "outlined", sx: { height: 22, fontSize: "0.7rem" } })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5, mb: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.3 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TimeIcon, { sx: { fontSize: 14, color: "text.secondary" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
                    course.totalLessons,
                    " bài"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.3 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PeopleIcon, { sx: { fontSize: 14, color: "text.secondary" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
                    course.totalStudents,
                    " học viên"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.3 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StarIcon, { sx: { fontSize: 14, color: "#F59E0B" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", children: course.rating })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h6", color: "primary", sx: { fontWeight: 800 }, children: [
                course.price.toLocaleString(),
                "đ"
              ] })
            ] })
          ]
        }
      ) }, course.uid)) }),
      total > pageSize && /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", justifyContent: "center", mt: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Pagination,
        {
          count: Math.ceil(total / pageSize),
          page,
          onChange: (_, v) => setPage(v),
          color: "primary"
        }
      ) })
    ] })
  ] }) });
}
export {
  CourseBrowsePage as default
};
