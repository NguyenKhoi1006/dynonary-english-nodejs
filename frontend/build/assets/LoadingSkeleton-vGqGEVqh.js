import { j as jsxRuntimeExports, B as Box } from "./index-C9E49YYM.js";
import { G as Grid, a as Card, b as CardContent } from "./DashboardLayout-CLktiGAC.js";
import { S as Skeleton } from "./Skeleton-uoTd0EY2.js";
function LoadingSkeleton({ type = "card", count = 3 }) {
  if (type === "stats") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 6, lg: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5, "&:last-child": { pb: 2.5 } }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "space-between", mb: 2 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", width: 44, height: 44, sx: { borderRadius: 2.5 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", width: 60, height: 22 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "60%", height: 40 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "40%", height: 20 })
    ] }) }) }, i)) });
  }
  if (type === "list") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { sx: { mb: 1.5, borderRadius: 2.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2, "&:last-child": { pb: 2 }, display: "flex", alignItems: "center", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "circular", width: 44, height: 44 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "50%", height: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "30%", height: 16 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { textAlign: "right" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: 70, height: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: 50, height: 16 })
      ] })
    ] }) }, i)) });
  }
  if (type === "detail") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "40%", height: 40, sx: { mb: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "60%", height: 20, sx: { mb: 3 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", width: "100%", height: 200, sx: { mb: 3, borderRadius: 3 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "100%", height: 16, sx: { mb: 0.5 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "100%", height: 16, sx: { mb: 0.5 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "80%", height: 16 })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, sm: 6, lg: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { sx: { borderRadius: 3 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", height: 140, sx: { borderRadius: "12px 12px 0 0" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "80%", height: 24, sx: { mb: 0.5 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "50%", height: 18, sx: { mb: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 0.5, mb: 1.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", width: 60, height: 22 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "rounded", width: 60, height: 22 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { variant: "text", width: "40%", height: 28 })
    ] })
  ] }) }, i)) });
}
export {
  LoadingSkeleton as L
};
