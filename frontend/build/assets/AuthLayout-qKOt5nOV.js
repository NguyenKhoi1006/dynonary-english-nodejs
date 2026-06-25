import { _ as _extends, r as reactExports, f as _objectWithoutPropertiesLoose, j as jsxRuntimeExports, h as clsx, i as capitalize, k as composeClasses, m as createTheme, n as generateUtilityClass, o as useDefaultProps, p as styled$1, c as createSvgIcon, q as useAppSelector, B as Box } from "./index-C9E49YYM.js";
import { s as styled, u as useThemeProps } from "./useThemeProps-BlB5Q0sr.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
const _excluded = ["className", "component", "disableGutters", "fixed", "maxWidth", "classes"];
const defaultTheme = createTheme();
const defaultCreateStyledComponent = styled("div", {
  name: "MuiContainer",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[`maxWidth${capitalize(String(ownerState.maxWidth))}`], ownerState.fixed && styles.fixed, ownerState.disableGutters && styles.disableGutters];
  }
});
const useThemePropsDefault = (inProps) => useThemeProps({
  props: inProps,
  name: "MuiContainer",
  defaultTheme
});
const useUtilityClasses = (ownerState, componentName) => {
  const getContainerUtilityClass = (slot) => {
    return generateUtilityClass(componentName, slot);
  };
  const {
    classes,
    fixed,
    disableGutters,
    maxWidth
  } = ownerState;
  const slots = {
    root: ["root", maxWidth && `maxWidth${capitalize(String(maxWidth))}`, fixed && "fixed", disableGutters && "disableGutters"]
  };
  return composeClasses(slots, getContainerUtilityClass, classes);
};
function createContainer(options = {}) {
  const {
    // This will allow adding custom styled fn (for example for custom sx style function)
    createStyledComponent = defaultCreateStyledComponent,
    useThemeProps: useThemeProps2 = useThemePropsDefault,
    componentName = "MuiContainer"
  } = options;
  const ContainerRoot = createStyledComponent(({
    theme,
    ownerState
  }) => _extends({
    width: "100%",
    marginLeft: "auto",
    boxSizing: "border-box",
    marginRight: "auto",
    display: "block"
  }, !ownerState.disableGutters && {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    // @ts-ignore module augmentation fails if custom breakpoints are used
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  }), ({
    theme,
    ownerState
  }) => ownerState.fixed && Object.keys(theme.breakpoints.values).reduce((acc, breakpointValueKey) => {
    const breakpoint = breakpointValueKey;
    const value = theme.breakpoints.values[breakpoint];
    if (value !== 0) {
      acc[theme.breakpoints.up(breakpoint)] = {
        maxWidth: `${value}${theme.breakpoints.unit}`
      };
    }
    return acc;
  }, {}), ({
    theme,
    ownerState
  }) => _extends({}, ownerState.maxWidth === "xs" && {
    // @ts-ignore module augmentation fails if custom breakpoints are used
    [theme.breakpoints.up("xs")]: {
      // @ts-ignore module augmentation fails if custom breakpoints are used
      maxWidth: Math.max(theme.breakpoints.values.xs, 444)
    }
  }, ownerState.maxWidth && // @ts-ignore module augmentation fails if custom breakpoints are used
  ownerState.maxWidth !== "xs" && {
    // @ts-ignore module augmentation fails if custom breakpoints are used
    [theme.breakpoints.up(ownerState.maxWidth)]: {
      // @ts-ignore module augmentation fails if custom breakpoints are used
      maxWidth: `${theme.breakpoints.values[ownerState.maxWidth]}${theme.breakpoints.unit}`
    }
  }));
  const Container2 = /* @__PURE__ */ reactExports.forwardRef(function Container22(inProps, ref) {
    const props = useThemeProps2(inProps);
    const {
      className,
      component = "div",
      disableGutters = false,
      fixed = false,
      maxWidth = "lg"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded);
    const ownerState = _extends({}, props, {
      component,
      disableGutters,
      fixed,
      maxWidth
    });
    const classes = useUtilityClasses(ownerState, componentName);
    return (
      // @ts-ignore theme is injected by the styled util
      /* @__PURE__ */ jsxRuntimeExports.jsx(ContainerRoot, _extends({
        as: component,
        ownerState,
        className: clsx(classes.root, className),
        ref
      }, other))
    );
  });
  return Container2;
}
const Container = createContainer({
  createStyledComponent: styled$1("div", {
    name: "MuiContainer",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, styles[`maxWidth${capitalize(String(ownerState.maxWidth))}`], ownerState.fixed && styles.fixed, ownerState.disableGutters && styles.disableGutters];
    }
  }),
  useThemeProps: (inProps) => useDefaultProps({
    props: inProps,
    name: "MuiContainer"
  })
});
const VisibilityOff = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"
}), "VisibilityOff");
function AuthLayout({ children, title, subtitle }) {
  const { themeMode } = useAppSelector((s) => s.ui);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Box,
    {
      sx: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: themeMode === "dark" ? "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)" : "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F8FAFC 100%)",
        position: "relative",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
          position: "absolute",
          top: -200,
          right: -200,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: themeMode === "dark" ? "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" : "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: themeMode === "dark" ? "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" : "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)",
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Container, { maxWidth: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Box,
          {
            sx: {
              position: "relative",
              zIndex: 1,
              background: (theme) => theme.palette.mode === "dark" ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: 4,
              border: (theme) => `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)"}`,
              boxShadow: (theme) => theme.palette.mode === "dark" ? "0 25px 50px rgba(0,0,0,0.3)" : "0 25px 50px rgba(15,23,42,0.08)",
              p: { xs: 3, sm: 5 }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { textAlign: "center", mb: 4 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Typography,
                  {
                    variant: "h3",
                    sx: {
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 0.5
                    },
                    children: "DynoLMS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h5", sx: { fontWeight: 700, mt: 2, mb: 0.5 }, children: title }),
                subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: subtitle })
              ] }),
              children
            ]
          }
        ) })
      ]
    }
  );
}
export {
  AuthLayout as A,
  VisibilityOff as V
};
