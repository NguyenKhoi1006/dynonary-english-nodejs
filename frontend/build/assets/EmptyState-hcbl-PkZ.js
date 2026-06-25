import { c as createSvgIcon, j as jsxRuntimeExports, B as Box } from "./index-C9E49YYM.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { B as Button } from "./Button-xZvr9MJV.js";
const InboxIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5v-3h3.56c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2H19zm0-5h-4.99c0 1.1-.9 2-2 2s-2-.9-2-2H5V5h14z"
}), "InboxOutlined");
function EmptyState({
  icon,
  title = "Không có dữ liệu",
  description = "Chưa có nội dung nào ở đây.",
  actionLabel,
  onAction
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Box,
    {
      sx: {
        textAlign: "center",
        py: 8,
        px: 2,
        animation: "fadeIn 0.4s ease"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { mb: 2, color: "text.disabled", opacity: 0.6 }, children: icon || /* @__PURE__ */ jsxRuntimeExports.jsx(InboxIcon, { sx: { fontSize: 64 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 0.5, color: "text.secondary" }, children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.disabled", sx: { mb: actionLabel ? 3 : 0, maxWidth: 360, mx: "auto" }, children: description }),
        actionLabel && onAction && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "contained", onClick: onAction, children: actionLabel })
      ]
    }
  );
}
export {
  EmptyState as E
};
