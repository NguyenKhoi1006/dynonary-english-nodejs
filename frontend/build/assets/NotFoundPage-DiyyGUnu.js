import { c as createSvgIcon, j as jsxRuntimeExports, u as useNavigate, B as Box } from "./index-C9E49YYM.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { B as Button } from "./Button-xZvr9MJV.js";
const HomeIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
}), "Home");
function NotFoundPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "background.default",
    textAlign: "center",
    px: 2
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h1", sx: {
      fontWeight: 900,
      fontSize: "8rem",
      background: "linear-gradient(135deg, #2563EB, #7C3AED)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      lineHeight: 1,
      mb: 2
    }, children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 700, mb: 1 }, children: "Trang không tìm thấy" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 4, maxWidth: 400 }, children: "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "contained", size: "large", startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(HomeIcon, {}), onClick: () => navigate("/dashboard"), children: "Về trang chủ" })
  ] });
}
export {
  NotFoundPage as default
};
