import { c as createSvgIcon, j as jsxRuntimeExports, q as useAppSelector, r as reactExports, B as Box } from "./index-C9E49YYM.js";
import { D as DashboardLayout, a as Card, b as CardContent, A as Avatar, d as Chip, G as Grid } from "./DashboardLayout-CLktiGAC.js";
import { B as Breadcrumbs } from "./Breadcrumbs-ChnP2Vff.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { T as TextField } from "./TextField-7kYAUi4b.js";
import { P as PersonIcon } from "./Person-BnomLngj.js";
import { E as EmailIcon } from "./Email-Bg0hrN3w.js";
import { D as Divider } from "./Divider-BPDNo2-X.js";
import { B as Button } from "./Button-xZvr9MJV.js";
import "./Menu-C8O2LlbM.js";
import "./useControlled-D8uc4CAn.js";
const BadgeIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2M9 12c.83 0 1.5.67 1.5 1.5S9.83 15 9 15s-1.5-.67-1.5-1.5S8.17 12 9 12m3 6H6v-.75c0-1 2-1.5 3-1.5s3 .5 3 1.5zm1-9h-2V4h2zm5 7.5h-4V15h4zm0-3h-4V12h4z"
}), "Badge");
const CalendarIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 18H4V8h16z"
}), "CalendarToday");
const CameraIcon = createSvgIcon([/* @__PURE__ */ jsxRuntimeExports.jsx("circle", {
  cx: "12",
  cy: "12",
  r: "3.2"
}, "0"), /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5"
}, "1")], "CameraAlt");
const SaveIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3m3-10H5V5h10z"
}), "Save");
function ProfilePage() {
  var _a, _b, _c;
  const { currentUser } = useAppSelector((s) => s.user);
  const [name, setName] = reactExports.useState((currentUser == null ? void 0 : currentUser.name) || "");
  const role = (currentUser == null ? void 0 : currentUser.role) || "student";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { maxWidth: 800 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Hồ sơ" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800, mb: 3 }, children: "Hồ sơ của tôi" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3, mb: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 3, mb: 3, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              src: (currentUser == null ? void 0 : currentUser.avt) || "",
              sx: { width: 88, height: 88, bgcolor: "primary.main", fontSize: "2rem" },
              children: (_b = (_a = currentUser == null ? void 0 : currentUser.name) == null ? void 0 : _a.charAt(0)) == null ? void 0 : _b.toUpperCase()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
            position: "absolute",
            bottom: 0,
            right: 0,
            bgcolor: "primary.main",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px solid",
            borderColor: "background.paper"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CameraIcon, { sx: { fontSize: 14, color: "#fff" } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h5", sx: { fontWeight: 700 }, children: currentUser == null ? void 0 : currentUser.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 0.5, mt: 0.5 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Chip,
              {
                label: role === "admin" ? "Admin" : role === "tutor" ? "Gia sư" : "Học viên",
                size: "small",
                color: role === "admin" ? "error" : role === "tutor" ? "secondary" : "primary",
                sx: { fontWeight: 700 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Chip,
              {
                label: (currentUser == null ? void 0 : currentUser.membership) === "premium" ? "Premium" : "Free",
                size: "small",
                variant: "outlined",
                color: (currentUser == null ? void 0 : currentUser.membership) === "premium" ? "warning" : "default",
                sx: { fontWeight: 700 }
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            fullWidth: true,
            label: "Họ tên",
            value: name,
            onChange: (e) => setName(e.target.value),
            InputProps: {
              startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(PersonIcon, { fontSize: "small", sx: { mr: 1, color: "action.active" } })
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            fullWidth: true,
            label: "Email",
            value: (currentUser == null ? void 0 : currentUser.email) || "",
            disabled: true,
            InputProps: {
              startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(EmailIcon, { fontSize: "small", sx: { mr: 1, color: "action.active" } })
            }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { my: 3 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", gap: 2, flexWrap: "wrap" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "contained", startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIcon, {}), children: "Lưu thay đổi" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 3 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 2 }, children: "Thông tin tài khoản" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 1.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeIcon, { fontSize: "small", color: "action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: "UID: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "body2", children: [
            (_c = currentUser == null ? void 0 : currentUser.uid) == null ? void 0 : _c.slice(0, 16),
            "..."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon, { fontSize: "small", color: "action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: "Tham gia từ: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: "Tháng 6, 2026" })
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  ProfilePage as default
};
