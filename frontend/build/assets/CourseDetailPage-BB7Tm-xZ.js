import { c as createSvgIcon, j as jsxRuntimeExports, t as useParams, u as useNavigate, r as reactExports, B as Box } from "./index-C9E49YYM.js";
import { D as DashboardLayout, G as Grid, a as Card, c as SchoolIcon, b as CardContent, d as Chip, S as StarIcon, A as Avatar, P as PeopleIcon } from "./DashboardLayout-CLktiGAC.js";
import { c as courseApi, E as ErrorState } from "./ErrorState-Dy_lFwoL.js";
import { S as Skeleton } from "./Skeleton-uoTd0EY2.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { B as Button } from "./Button-xZvr9MJV.js";
import { B as BackIcon } from "./ArrowBack-5sU864y4.js";
import { L as LockIcon } from "./Lock-Q15UZe7H.js";
import { D as Divider } from "./Divider-BPDNo2-X.js";
import { B as BookIcon } from "./MenuBook-Da2QH-xE.js";
import { T as TimeIcon } from "./AccessTime-CPkUHXVu.js";
import "./Menu-C8O2LlbM.js";
import "./Person-BnomLngj.js";
const CheckIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z"
}), "CheckCircle");
const PlayIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2M9.5 16.5v-9l7 4.5z"
}), "PlayCircle");
function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    courseApi.getById(id).then((data) => {
      if (!cancelled) setCourse(data);
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Không thể tải thông tin khóa học");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: { xs: 2, md: 0 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Lỗi tải dữ liệu", message: error, onRetry: () => navigate("/courses") }) }) });
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { p: { xs: 2, md: 0 } }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", width: 120, height: 36, sx: { mb: 2 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 3, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { item: true, xs: 12, md: 8, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", height: 200, sx: { mb: 2 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", height: 300 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, md: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", height: 400 }) })
      ] })
    ] }) });
  }
  if (!course) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { textAlign: "center", py: 6 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", color: "text.secondary", children: "Không tìm thấy khóa học" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(BackIcon, {}), onClick: () => navigate("/courses"), sx: { mt: 2 }, children: "Quay lại" })
    ] }) });
  }
  const lessons = course.lessons || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { animation: "fadeIn 0.4s ease" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(BackIcon, {}), onClick: () => navigate("/courses"), sx: { mb: 2 }, children: "Quay lại" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 3, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { item: true, xs: 12, md: 8, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { sx: { borderRadius: 3, mb: 3, overflow: "hidden" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
            height: 200,
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolIcon, { sx: { fontSize: 80, color: "rgba(255,255,255,0.15)" } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800, mb: 1 }, children: course.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5, mb: 1.5, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: course.level, size: "small", color: "secondary", variant: "outlined" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: course.subject, size: "small", color: "primary", variant: "outlined" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.3 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StarIcon, { sx: { fontSize: 16, color: "#F59E0B" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: course.rating })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 2, mb: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { sx: { width: 36, height: 36, bgcolor: "primary.main", fontSize: "0.9rem" }, children: course.tutorName.charAt(0) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: course.tutorName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PeopleIcon, { fontSize: "small", color: "action" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
                  course.totalStudents,
                  " học viên"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", sx: { whiteSpace: "pre-line" }, children: course.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 2 }, children: "Chương trình học" }),
          lessons.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: "Chưa có bài học nào." }) : lessons.map((lesson, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5 }, children: [
                lesson.isFreePreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(PlayIcon, { color: "primary", fontSize: "small" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LockIcon, { fontSize: "small", color: "disabled" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "subtitle2", sx: { fontWeight: 600 }, children: [
                    i + 1,
                    ". ",
                    lesson.title
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
                    Math.round(lesson.duration / 60),
                    " phút · ",
                    lesson.contentType
                  ] })
                ] })
              ] }),
              lesson.isFreePreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: "Miễn phí", size: "small", color: "success", variant: "outlined", sx: { height: 22 } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: "Premium", size: "small", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LockIcon, { sx: { fontSize: 14 } }), sx: { height: 22 } })
            ] }),
            i < lessons.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {})
          ] }, lesson.uid))
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, md: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3, position: "sticky", top: 24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h4", color: "primary", sx: { fontWeight: 800, mb: 2 }, children: [
          course.price.toLocaleString(),
          "đ"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "contained", fullWidth: true, size: "large", sx: { mb: 2 }, children: "Đăng ký ngay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookIcon, { fontSize: "small", color: "action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "body2", children: [
              course.totalLessons,
              " bài học"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TimeIcon, { fontSize: "small", color: "action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "body2", children: [
              Math.round(course.totalDuration / 60),
              " phút học"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckIcon, { fontSize: "small", color: "action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: "Tài liệu PDF đi kèm" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckIcon, { fontSize: "small", color: "action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: "Chứng chỉ hoàn thành" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { mb: 2 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 1.5 }, children: "Khóa học này bao gồm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "body2", color: "text.secondary", children: [
            "✅ ",
            course.totalLessons,
            " bài giảng video"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: "✅ Tài liệu PDF tải về" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: "✅ Bài tập thực hành" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: "✅ Hỗ trợ từ gia sư" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: "✅ Quyền truy cập trọn đời" })
        ] })
      ] }) }) })
    ] })
  ] }) });
}
export {
  CourseDetailPage as default
};
