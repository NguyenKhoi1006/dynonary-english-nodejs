import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Box } from "./index-C9E49YYM.js";
import { D as DashboardLayout, d as Chip, G as Grid, a as Card, b as CardContent, A as Avatar } from "./DashboardLayout-CLktiGAC.js";
import { t as tutorApi, E as ErrorState } from "./ErrorState-Dy_lFwoL.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { T as TextField } from "./TextField-7kYAUi4b.js";
import { I as InputAdornment } from "./InputAdornment-CzrE54Zk.js";
import { S as SearchIcon } from "./Search-C444El5K.js";
import { S as Skeleton } from "./Skeleton-uoTd0EY2.js";
import { R as Rating } from "./Rating-uFNSJWI9.js";
import { P as Pagination } from "./Pagination-D6uK--yH.js";
import "./Menu-C8O2LlbM.js";
import "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
import "./Button-xZvr9MJV.js";
import "./useControlled-D8uc4CAn.js";
const subjects = ["Tất cả", "English", "Math", "Science", "Programming", "Music", "Art"];
function TutorBrowsePage() {
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [activeSubject, setActiveSubject] = reactExports.useState("Tất cả");
  const [tutors, setTutors] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [page, setPage] = reactExports.useState(1);
  const [total, setTotal] = reactExports.useState(0);
  const pageSize = 20;
  reactExports.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    tutorApi.list({ page, pageSize, subject: activeSubject !== "Tất cả" ? activeSubject : void 0 }).then((data) => {
      if (!cancelled) {
        setTutors(data.tutors || []);
        setTotal(data.total || 0);
      }
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Không thể tải danh sách gia sư");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [page, activeSubject]);
  const filtered = tutors.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.subjects.some((s) => s.toLowerCase().includes(q));
  });
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: { xs: 2, md: 0 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Lỗi tải dữ liệu", message: error, onRetry: () => window.location.reload() }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { animation: "fadeIn 0.4s ease" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800, mb: 0.5 }, children: "Tìm gia sư" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 3 }, children: "Chọn gia sư phù hợp nhất với bạn" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextField,
      {
        fullWidth: true,
        placeholder: "Tìm theo tên gia sư hoặc môn học...",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        sx: { mb: 2 },
        InputProps: {
          startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(InputAdornment, { position: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, {}) }),
          sx: { borderRadius: 3, bgcolor: "background.paper" }
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }, children: subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, sm: 6, lg: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5, display: "flex", flexDirection: "column", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "circular", width: 72, height: 72, sx: { mb: 1.5 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: 120, sx: { mb: 0.5 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: 80 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", width: 80, height: 22, sx: { my: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "80%" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: 100, sx: { mt: 1 } })
    ] }) }) }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { textAlign: "center", py: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", color: "text.secondary", children: "Không tìm thấy gia sư phù hợp" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, children: filtered.map((tutor) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, sm: 6, lg: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          sx: {
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            transition: "all 0.25s",
            "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 28px rgba(0,0,0,0.1)" }
          },
          onClick: () => navigate(`/tutors/${tutor.uid}`),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { src: tutor.avt, sx: { width: 72, height: 72, mb: 1.5, bgcolor: "primary.main", fontSize: "1.5rem" }, children: tutor.name.charAt(0) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle1", sx: { fontWeight: 700 }, children: tutor.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Rating, { value: tutor.rating, precision: 0.1, size: "small", readOnly: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
                "(",
                tutor.totalReviews,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center", mb: 1 }, children: tutor.subjects.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: sub, size: "small", variant: "outlined", sx: { height: 22, fontSize: "0.7rem" } }, sub)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", sx: { mb: "auto" }, children: tutor.level === "expert" ? "Chuyên gia" : tutor.level === "advanced" ? "Nâng cao" : "Trung cấp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { mt: 1.5, width: "100%", pt: 1.5, borderTop: "1px solid", borderColor: "divider" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h6", color: "primary", sx: { fontWeight: 800 }, children: [
              tutor.hourlyRate.toLocaleString(),
              "đ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", fontWeight: 400, color: "#94A3B8" }, children: "/giờ" })
            ] }) })
          ] })
        }
      ) }, tutor.uid)) }),
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
  TutorBrowsePage as default
};
