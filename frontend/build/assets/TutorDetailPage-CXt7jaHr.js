import { t as useParams, u as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Box } from "./index-C9E49YYM.js";
import { D as DashboardLayout, G as Grid, a as Card, b as CardContent, A as Avatar, d as Chip, C as CalendarIcon, M as MessageIcon, L as ListItem, c as SchoolIcon, e as ListItemText } from "./DashboardLayout-CLktiGAC.js";
import { t as tutorApi, r as reviewApi, E as ErrorState } from "./ErrorState-Dy_lFwoL.js";
import { S as Skeleton } from "./Skeleton-uoTd0EY2.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { B as Button } from "./Button-xZvr9MJV.js";
import { B as BackIcon } from "./ArrowBack-5sU864y4.js";
import { R as Rating } from "./Rating-uFNSJWI9.js";
import { L as List } from "./Menu-C8O2LlbM.js";
import { L as ListItemAvatar } from "./ListItemAvatar-tP_3xcJ7.js";
import { D as Divider } from "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
import "./useControlled-D8uc4CAn.js";
function TutorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = reactExports.useState(null);
  const [reviews, setReviews] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      tutorApi.getById(id),
      reviewApi.getTutorReviews(id).catch(() => ({ reviews: [] }))
    ]).then(([profile, reviewData]) => {
      if (!cancelled) {
        setTutor(profile);
        setReviews(reviewData.reviews || []);
      }
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Không thể tải thông tin gia sư");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: { xs: 2, md: 0 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Lỗi tải dữ liệu", message: error, onRetry: () => navigate("/tutors") }) }) });
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { p: { xs: 2, md: 0 } }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", width: 120, height: 36, sx: { mb: 2 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 3, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, md: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { sx: { borderRadius: 3, p: 3, textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "circular", width: 96, height: 96, sx: { mx: "auto", mb: 2 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "60%", sx: { mx: "auto" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "40%", sx: { mx: "auto" } })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { item: true, xs: 12, md: 8, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", height: 100, sx: { mb: 2 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", height: 100 })
        ] })
      ] })
    ] }) });
  }
  if (!tutor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { textAlign: "center", py: 6 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", color: "text.secondary", children: "Không tìm thấy gia sư" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(BackIcon, {}), onClick: () => navigate("/tutors"), sx: { mt: 2 }, children: "Quay lại" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { animation: "fadeIn 0.4s ease" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(BackIcon, {}), onClick: () => navigate("/tutors"), sx: { mb: 2 }, children: "Quay lại" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 3, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, md: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3, textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { src: tutor.avt, sx: { width: 96, height: 96, mx: "auto", mb: 2, bgcolor: "primary.main", fontSize: "2rem" }, children: tutor.name.charAt(0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h5", sx: { fontWeight: 800 }, children: tutor.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rating, { value: tutor.rating, precision: 0.1, size: "small", readOnly: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "body2", color: "text.secondary", children: [
            "(",
            tutor.totalReviews,
            " đánh giá)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center", mb: 2 }, children: tutor.subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: s, size: "small", color: "primary", variant: "outlined" }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h4", color: "primary", sx: { fontWeight: 800, mb: 2 }, children: [
          tutor.hourlyRate.toLocaleString(),
          "đ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1rem", fontWeight: 400, color: "#94A3B8" }, children: "/giờ" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "contained", fullWidth: true, size: "large", sx: { mb: 1 }, startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, {}), children: "Đặt lịch học" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outlined", fullWidth: true, startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageIcon, {}), children: "Nhắn tin" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { item: true, xs: 12, md: 8, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [
          { label: "Buổi học", value: tutor.totalSessions, color: "#2563EB" },
          { label: "Học viên", value: tutor.totalStudents, color: "#7C3AED" },
          { label: "Đánh giá", value: tutor.totalReviews, color: "#10B981" },
          { label: "Cấp độ", value: tutor.level === "expert" ? "Chuyên gia" : tutor.level === "advanced" ? "Nâng cao" : "Trung cấp", color: "#F59E0B" }
        ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 6, sm: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 2.5, textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h5", sx: { fontWeight: 800, color: stat.color }, children: stat.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", children: stat.label })
        ] }) }) }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3, mb: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 1.5 }, children: "Giới thiệu" }),
          tutor.bio.split("\n\n").map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1, whiteSpace: "pre-line" }, children: p }, i))
        ] }) }),
        tutor.qualifications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3, mb: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 1.5 }, children: "Bằng cấp & Chứng chỉ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(List, { disablePadding: true, children: tutor.qualifications.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(ListItem, { sx: { px: 0, py: 0.5 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ListItemAvatar, { sx: { minWidth: 36 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolIcon, { color: "primary", fontSize: "small" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ListItemText, { primary: q, primaryTypographyProps: { variant: "body2" } })
          ] }, i)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 2 }, children: "Đánh giá" }),
          reviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: "Chưa có đánh giá nào." }) : reviews.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mb: i < reviews.length - 1 ? 2 : 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { sx: { width: 32, height: 32, bgcolor: "grey.400", fontSize: "0.8rem" }, children: r.studentName.charAt(0) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600 }, children: r.studentName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.5 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Rating, { value: r.rating, size: "small", readOnly: true }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.disabled", children: new Date(r.createdDate).toLocaleDateString("vi-VN") })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", sx: { ml: 5.5 }, children: r.comment }),
            i < reviews.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { mt: 2 } })
          ] }, r.uid))
        ] }) })
      ] })
    ] })
  ] }) });
}
export {
  TutorDetailPage as default
};
