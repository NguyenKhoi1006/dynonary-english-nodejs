import { n as generateUtilityClass, v as generateUtilityClasses, r as reactExports, f as _objectWithoutPropertiesLoose, _ as _extends, j as jsxRuntimeExports, h as clsx, i as capitalize, k as composeClasses, p as styled, E as ButtonBase, a0 as rootShouldForwardProp, o as useDefaultProps, J as useTheme, a1 as Paper, w as useId, a2 as lighten_1, a3 as darken_1, F as alpha_1, c as createSvgIcon, u as useNavigate, B as Box, I as IconButton } from "./index-C9E49YYM.js";
import { D as DashboardLayout, c as SchoolIcon, G as Grid, a as Card, b as CardContent, d as Chip, P as PeopleIcon, f as MenuItem } from "./DashboardLayout-CLktiGAC.js";
import { E as ErrorState, c as courseApi } from "./ErrorState-Dy_lFwoL.js";
import { B as Breadcrumbs } from "./Breadcrumbs-ChnP2Vff.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-vGqGEVqh.js";
import { E as EmptyState } from "./EmptyState-hcbl-PkZ.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { B as Button } from "./Button-xZvr9MJV.js";
import { A as AddIcon } from "./Add-DxeB5otR.js";
import { V as ViewIcon } from "./Visibility-DhXG6qrB.js";
import { u as useFormControl, T as TextField } from "./TextField-7kYAUi4b.js";
import { u as useControlled } from "./useControlled-D8uc4CAn.js";
import { F as Fade, M as Modal, B as Backdrop } from "./Menu-C8O2LlbM.js";
import "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
import "./Skeleton-uoTd0EY2.js";
function getSwitchBaseUtilityClass(slot) {
  return generateUtilityClass("PrivateSwitchBase", slot);
}
generateUtilityClasses("PrivateSwitchBase", ["root", "checked", "disabled", "input", "edgeStart", "edgeEnd"]);
const _excluded$5 = ["autoFocus", "checked", "checkedIcon", "className", "defaultChecked", "disabled", "disableFocusRipple", "edge", "icon", "id", "inputProps", "inputRef", "name", "onBlur", "onChange", "onFocus", "readOnly", "required", "tabIndex", "type", "value"];
const useUtilityClasses$5 = (ownerState) => {
  const {
    classes,
    checked,
    disabled,
    edge
  } = ownerState;
  const slots = {
    root: ["root", checked && "checked", disabled && "disabled", edge && `edge${capitalize(edge)}`],
    input: ["input"]
  };
  return composeClasses(slots, getSwitchBaseUtilityClass, classes);
};
const SwitchBaseRoot = styled(ButtonBase, {
  name: "MuiSwitchBase"
})(({
  ownerState
}) => _extends({
  padding: 9,
  borderRadius: "50%"
}, ownerState.edge === "start" && {
  marginLeft: ownerState.size === "small" ? -3 : -12
}, ownerState.edge === "end" && {
  marginRight: ownerState.size === "small" ? -3 : -12
}));
const SwitchBaseInput = styled("input", {
  name: "MuiSwitchBase",
  shouldForwardProp: rootShouldForwardProp
})({
  cursor: "inherit",
  position: "absolute",
  opacity: 0,
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  zIndex: 1
});
const SwitchBase = /* @__PURE__ */ reactExports.forwardRef(function SwitchBase2(props, ref) {
  const {
    autoFocus,
    checked: checkedProp,
    checkedIcon,
    className,
    defaultChecked,
    disabled: disabledProp,
    disableFocusRipple = false,
    edge = false,
    icon,
    id,
    inputProps,
    inputRef,
    name,
    onBlur,
    onChange,
    onFocus,
    readOnly,
    required = false,
    tabIndex,
    type,
    value
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded$5);
  const [checked, setCheckedState] = useControlled({
    controlled: checkedProp,
    default: Boolean(defaultChecked),
    name: "SwitchBase",
    state: "checked"
  });
  const muiFormControl = useFormControl();
  const handleFocus = (event) => {
    if (onFocus) {
      onFocus(event);
    }
    if (muiFormControl && muiFormControl.onFocus) {
      muiFormControl.onFocus(event);
    }
  };
  const handleBlur = (event) => {
    if (onBlur) {
      onBlur(event);
    }
    if (muiFormControl && muiFormControl.onBlur) {
      muiFormControl.onBlur(event);
    }
  };
  const handleInputChange = (event) => {
    if (event.nativeEvent.defaultPrevented) {
      return;
    }
    const newChecked = event.target.checked;
    setCheckedState(newChecked);
    if (onChange) {
      onChange(event, newChecked);
    }
  };
  let disabled = disabledProp;
  if (muiFormControl) {
    if (typeof disabled === "undefined") {
      disabled = muiFormControl.disabled;
    }
  }
  const hasLabelFor = type === "checkbox" || type === "radio";
  const ownerState = _extends({}, props, {
    checked,
    disabled,
    disableFocusRipple,
    edge
  });
  const classes = useUtilityClasses$5(ownerState);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchBaseRoot, _extends({
    component: "span",
    className: clsx(classes.root, className),
    centerRipple: true,
    focusRipple: !disableFocusRipple,
    disabled,
    tabIndex: null,
    role: void 0,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ownerState,
    ref
  }, other, {
    children: [/* @__PURE__ */ jsxRuntimeExports.jsx(SwitchBaseInput, _extends({
      autoFocus,
      checked: checkedProp,
      defaultChecked,
      className: classes.input,
      disabled,
      id: hasLabelFor ? id : void 0,
      name,
      onChange: handleInputChange,
      readOnly,
      ref: inputRef,
      required,
      ownerState,
      tabIndex,
      type
    }, type === "checkbox" && value === void 0 ? {} : {
      value
    }, inputProps)), checked ? checkedIcon : icon]
  }));
});
function getDialogUtilityClass(slot) {
  return generateUtilityClass("MuiDialog", slot);
}
const dialogClasses = generateUtilityClasses("MuiDialog", ["root", "scrollPaper", "scrollBody", "container", "paper", "paperScrollPaper", "paperScrollBody", "paperWidthFalse", "paperWidthXs", "paperWidthSm", "paperWidthMd", "paperWidthLg", "paperWidthXl", "paperFullWidth", "paperFullScreen"]);
const DialogContext = /* @__PURE__ */ reactExports.createContext({});
const _excluded$4 = ["aria-describedby", "aria-labelledby", "BackdropComponent", "BackdropProps", "children", "className", "disableEscapeKeyDown", "fullScreen", "fullWidth", "maxWidth", "onBackdropClick", "onClick", "onClose", "open", "PaperComponent", "PaperProps", "scroll", "TransitionComponent", "transitionDuration", "TransitionProps"];
const DialogBackdrop = styled(Backdrop, {
  name: "MuiDialog",
  slot: "Backdrop",
  overrides: (props, styles) => styles.backdrop
})({
  // Improve scrollable dialog support.
  zIndex: -1
});
const useUtilityClasses$4 = (ownerState) => {
  const {
    classes,
    scroll,
    maxWidth,
    fullWidth,
    fullScreen
  } = ownerState;
  const slots = {
    root: ["root"],
    container: ["container", `scroll${capitalize(scroll)}`],
    paper: ["paper", `paperScroll${capitalize(scroll)}`, `paperWidth${capitalize(String(maxWidth))}`, fullWidth && "paperFullWidth", fullScreen && "paperFullScreen"]
  };
  return composeClasses(slots, getDialogUtilityClass, classes);
};
const DialogRoot = styled(Modal, {
  name: "MuiDialog",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  "@media print": {
    // Use !important to override the Modal inline-style.
    position: "absolute !important"
  }
});
const DialogContainer = styled("div", {
  name: "MuiDialog",
  slot: "Container",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.container, styles[`scroll${capitalize(ownerState.scroll)}`]];
  }
})(({
  ownerState
}) => _extends({
  height: "100%",
  "@media print": {
    height: "auto"
  },
  // We disable the focus ring for mouse, touch and keyboard users.
  outline: 0
}, ownerState.scroll === "paper" && {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}, ownerState.scroll === "body" && {
  overflowY: "auto",
  overflowX: "hidden",
  textAlign: "center",
  "&::after": {
    content: '""',
    display: "inline-block",
    verticalAlign: "middle",
    height: "100%",
    width: "0"
  }
}));
const DialogPaper = styled(Paper, {
  name: "MuiDialog",
  slot: "Paper",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.paper, styles[`scrollPaper${capitalize(ownerState.scroll)}`], styles[`paperWidth${capitalize(String(ownerState.maxWidth))}`], ownerState.fullWidth && styles.paperFullWidth, ownerState.fullScreen && styles.paperFullScreen];
  }
})(({
  theme,
  ownerState
}) => _extends({
  margin: 32,
  position: "relative",
  overflowY: "auto",
  // Fix IE11 issue, to remove at some point.
  "@media print": {
    overflowY: "visible",
    boxShadow: "none"
  }
}, ownerState.scroll === "paper" && {
  display: "flex",
  flexDirection: "column",
  maxHeight: "calc(100% - 64px)"
}, ownerState.scroll === "body" && {
  display: "inline-block",
  verticalAlign: "middle",
  textAlign: "left"
  // 'initial' doesn't work on IE11
}, !ownerState.maxWidth && {
  maxWidth: "calc(100% - 64px)"
}, ownerState.maxWidth === "xs" && {
  maxWidth: theme.breakpoints.unit === "px" ? Math.max(theme.breakpoints.values.xs, 444) : `max(${theme.breakpoints.values.xs}${theme.breakpoints.unit}, 444px)`,
  [`&.${dialogClasses.paperScrollBody}`]: {
    [theme.breakpoints.down(Math.max(theme.breakpoints.values.xs, 444) + 32 * 2)]: {
      maxWidth: "calc(100% - 64px)"
    }
  }
}, ownerState.maxWidth && ownerState.maxWidth !== "xs" && {
  maxWidth: `${theme.breakpoints.values[ownerState.maxWidth]}${theme.breakpoints.unit}`,
  [`&.${dialogClasses.paperScrollBody}`]: {
    [theme.breakpoints.down(theme.breakpoints.values[ownerState.maxWidth] + 32 * 2)]: {
      maxWidth: "calc(100% - 64px)"
    }
  }
}, ownerState.fullWidth && {
  width: "calc(100% - 64px)"
}, ownerState.fullScreen && {
  margin: 0,
  width: "100%",
  maxWidth: "100%",
  height: "100%",
  maxHeight: "none",
  borderRadius: 0,
  [`&.${dialogClasses.paperScrollBody}`]: {
    margin: 0,
    maxWidth: "100%"
  }
}));
const Dialog = /* @__PURE__ */ reactExports.forwardRef(function Dialog2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiDialog"
  });
  const theme = useTheme();
  const defaultTransitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };
  const {
    "aria-describedby": ariaDescribedby,
    "aria-labelledby": ariaLabelledbyProp,
    BackdropComponent,
    BackdropProps,
    children,
    className,
    disableEscapeKeyDown = false,
    fullScreen = false,
    fullWidth = false,
    maxWidth = "sm",
    onBackdropClick,
    onClick,
    onClose,
    open,
    PaperComponent = Paper,
    PaperProps = {},
    scroll = "paper",
    TransitionComponent = Fade,
    transitionDuration = defaultTransitionDuration,
    TransitionProps
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded$4);
  const ownerState = _extends({}, props, {
    disableEscapeKeyDown,
    fullScreen,
    fullWidth,
    maxWidth,
    scroll
  });
  const classes = useUtilityClasses$4(ownerState);
  const backdropClick = reactExports.useRef();
  const handleMouseDown = (event) => {
    backdropClick.current = event.target === event.currentTarget;
  };
  const handleBackdropClick = (event) => {
    if (onClick) {
      onClick(event);
    }
    if (!backdropClick.current) {
      return;
    }
    backdropClick.current = null;
    if (onBackdropClick) {
      onBackdropClick(event);
    }
    if (onClose) {
      onClose(event, "backdropClick");
    }
  };
  const ariaLabelledby = useId(ariaLabelledbyProp);
  const dialogContextValue = reactExports.useMemo(() => {
    return {
      titleId: ariaLabelledby
    };
  }, [ariaLabelledby]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogRoot, _extends({
    className: clsx(classes.root, className),
    closeAfterTransition: true,
    components: {
      Backdrop: DialogBackdrop
    },
    componentsProps: {
      backdrop: _extends({
        transitionDuration,
        as: BackdropComponent
      }, BackdropProps)
    },
    disableEscapeKeyDown,
    onClose,
    open,
    ref,
    onClick: handleBackdropClick,
    ownerState
  }, other, {
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, _extends({
      appear: true,
      in: open,
      timeout: transitionDuration,
      role: "presentation"
    }, TransitionProps, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContainer, {
        className: clsx(classes.container),
        onMouseDown: handleMouseDown,
        ownerState,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPaper, _extends({
          as: PaperComponent,
          elevation: 24,
          role: "dialog",
          "aria-describedby": ariaDescribedby,
          "aria-labelledby": ariaLabelledby
        }, PaperProps, {
          className: clsx(classes.paper, PaperProps.className),
          ownerState,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContext.Provider, {
            value: dialogContextValue,
            children
          })
        }))
      })
    }))
  }));
});
function getDialogActionsUtilityClass(slot) {
  return generateUtilityClass("MuiDialogActions", slot);
}
generateUtilityClasses("MuiDialogActions", ["root", "spacing"]);
const _excluded$3 = ["className", "disableSpacing"];
const useUtilityClasses$3 = (ownerState) => {
  const {
    classes,
    disableSpacing
  } = ownerState;
  const slots = {
    root: ["root", !disableSpacing && "spacing"]
  };
  return composeClasses(slots, getDialogActionsUtilityClass, classes);
};
const DialogActionsRoot = styled("div", {
  name: "MuiDialogActions",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, !ownerState.disableSpacing && styles.spacing];
  }
})(({
  ownerState
}) => _extends({
  display: "flex",
  alignItems: "center",
  padding: 8,
  justifyContent: "flex-end",
  flex: "0 0 auto"
}, !ownerState.disableSpacing && {
  "& > :not(style) ~ :not(style)": {
    marginLeft: 8
  }
}));
const DialogActions = /* @__PURE__ */ reactExports.forwardRef(function DialogActions2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiDialogActions"
  });
  const {
    className,
    disableSpacing = false
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded$3);
  const ownerState = _extends({}, props, {
    disableSpacing
  });
  const classes = useUtilityClasses$3(ownerState);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogActionsRoot, _extends({
    className: clsx(classes.root, className),
    ownerState,
    ref
  }, other));
});
function getDialogContentUtilityClass(slot) {
  return generateUtilityClass("MuiDialogContent", slot);
}
generateUtilityClasses("MuiDialogContent", ["root", "dividers"]);
function getDialogTitleUtilityClass(slot) {
  return generateUtilityClass("MuiDialogTitle", slot);
}
const dialogTitleClasses = generateUtilityClasses("MuiDialogTitle", ["root"]);
const _excluded$2 = ["className", "dividers"];
const useUtilityClasses$2 = (ownerState) => {
  const {
    classes,
    dividers
  } = ownerState;
  const slots = {
    root: ["root", dividers && "dividers"]
  };
  return composeClasses(slots, getDialogContentUtilityClass, classes);
};
const DialogContentRoot = styled("div", {
  name: "MuiDialogContent",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.dividers && styles.dividers];
  }
})(({
  theme,
  ownerState
}) => _extends({
  flex: "1 1 auto",
  // Add iOS momentum scrolling for iOS < 13.0
  WebkitOverflowScrolling: "touch",
  overflowY: "auto",
  padding: "20px 24px"
}, ownerState.dividers ? {
  padding: "16px 24px",
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`
} : {
  [`.${dialogTitleClasses.root} + &`]: {
    paddingTop: 0
  }
}));
const DialogContent = /* @__PURE__ */ reactExports.forwardRef(function DialogContent2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiDialogContent"
  });
  const {
    className,
    dividers = false
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded$2);
  const ownerState = _extends({}, props, {
    dividers
  });
  const classes = useUtilityClasses$2(ownerState);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentRoot, _extends({
    className: clsx(classes.root, className),
    ownerState,
    ref
  }, other));
});
const _excluded$1 = ["className", "id"];
const useUtilityClasses$1 = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"]
  };
  return composeClasses(slots, getDialogTitleUtilityClass, classes);
};
const DialogTitleRoot = styled(Typography, {
  name: "MuiDialogTitle",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  padding: "16px 24px",
  flex: "0 0 auto"
});
const DialogTitle = /* @__PURE__ */ reactExports.forwardRef(function DialogTitle2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiDialogTitle"
  });
  const {
    className,
    id: idProp
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded$1);
  const ownerState = props;
  const classes = useUtilityClasses$1(ownerState);
  const {
    titleId = idProp
  } = reactExports.useContext(DialogContext);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitleRoot, _extends({
    component: "h2",
    className: clsx(classes.root, className),
    ownerState,
    ref,
    variant: "h6",
    id: idProp != null ? idProp : titleId
  }, other));
});
function getSwitchUtilityClass(slot) {
  return generateUtilityClass("MuiSwitch", slot);
}
const switchClasses = generateUtilityClasses("MuiSwitch", ["root", "edgeStart", "edgeEnd", "switchBase", "colorPrimary", "colorSecondary", "sizeSmall", "sizeMedium", "checked", "disabled", "input", "thumb", "track"]);
const _excluded = ["className", "color", "edge", "size", "sx"];
const useUtilityClasses = (ownerState) => {
  const {
    classes,
    edge,
    size,
    color,
    checked,
    disabled
  } = ownerState;
  const slots = {
    root: ["root", edge && `edge${capitalize(edge)}`, `size${capitalize(size)}`],
    switchBase: ["switchBase", `color${capitalize(color)}`, checked && "checked", disabled && "disabled"],
    thumb: ["thumb"],
    track: ["track"],
    input: ["input"]
  };
  const composedClasses = composeClasses(slots, getSwitchUtilityClass, classes);
  return _extends({}, classes, composedClasses);
};
const SwitchRoot = styled("span", {
  name: "MuiSwitch",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.edge && styles[`edge${capitalize(ownerState.edge)}`], styles[`size${capitalize(ownerState.size)}`]];
  }
})({
  display: "inline-flex",
  width: 34 + 12 * 2,
  height: 14 + 12 * 2,
  overflow: "hidden",
  padding: 12,
  boxSizing: "border-box",
  position: "relative",
  flexShrink: 0,
  zIndex: 0,
  // Reset the stacking context.
  verticalAlign: "middle",
  // For correct alignment with the text.
  "@media print": {
    colorAdjust: "exact"
  },
  variants: [{
    props: {
      edge: "start"
    },
    style: {
      marginLeft: -8
    }
  }, {
    props: {
      edge: "end"
    },
    style: {
      marginRight: -8
    }
  }, {
    props: {
      size: "small"
    },
    style: {
      width: 40,
      height: 24,
      padding: 7,
      [`& .${switchClasses.thumb}`]: {
        width: 16,
        height: 16
      },
      [`& .${switchClasses.switchBase}`]: {
        padding: 4,
        [`&.${switchClasses.checked}`]: {
          transform: "translateX(16px)"
        }
      }
    }
  }]
});
const SwitchSwitchBase = styled(SwitchBase, {
  name: "MuiSwitch",
  slot: "SwitchBase",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.switchBase, {
      [`& .${switchClasses.input}`]: styles.input
    }, ownerState.color !== "default" && styles[`color${capitalize(ownerState.color)}`]];
  }
})(({
  theme
}) => ({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 1,
  // Render above the focus ripple.
  color: theme.vars ? theme.vars.palette.Switch.defaultColor : `${theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.grey[300]}`,
  transition: theme.transitions.create(["left", "transform"], {
    duration: theme.transitions.duration.shortest
  }),
  [`&.${switchClasses.checked}`]: {
    transform: "translateX(20px)"
  },
  [`&.${switchClasses.disabled}`]: {
    color: theme.vars ? theme.vars.palette.Switch.defaultDisabledColor : `${theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600]}`
  },
  [`&.${switchClasses.checked} + .${switchClasses.track}`]: {
    opacity: 0.5
  },
  [`&.${switchClasses.disabled} + .${switchClasses.track}`]: {
    opacity: theme.vars ? theme.vars.opacity.switchTrackDisabled : `${theme.palette.mode === "light" ? 0.12 : 0.2}`
  },
  [`& .${switchClasses.input}`]: {
    left: "-100%",
    width: "300%"
  }
}), ({
  theme
}) => ({
  "&:hover": {
    backgroundColor: theme.vars ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(theme.palette.action.active, theme.palette.action.hoverOpacity),
    // Reset on touch devices, it doesn't add specificity
    "@media (hover: none)": {
      backgroundColor: "transparent"
    }
  },
  variants: [...Object.entries(theme.palette).filter(([, value]) => value.main && value.light).map(([color]) => ({
    props: {
      color
    },
    style: {
      [`&.${switchClasses.checked}`]: {
        color: (theme.vars || theme).palette[color].main,
        "&:hover": {
          backgroundColor: theme.vars ? `rgba(${theme.vars.palette[color].mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(theme.palette[color].main, theme.palette.action.hoverOpacity),
          "@media (hover: none)": {
            backgroundColor: "transparent"
          }
        },
        [`&.${switchClasses.disabled}`]: {
          color: theme.vars ? theme.vars.palette.Switch[`${color}DisabledColor`] : `${theme.palette.mode === "light" ? lighten_1(theme.palette[color].main, 0.62) : darken_1(theme.palette[color].main, 0.55)}`
        }
      },
      [`&.${switchClasses.checked} + .${switchClasses.track}`]: {
        backgroundColor: (theme.vars || theme).palette[color].main
      }
    }
  }))]
}));
const SwitchTrack = styled("span", {
  name: "MuiSwitch",
  slot: "Track",
  overridesResolver: (props, styles) => styles.track
})(({
  theme
}) => ({
  height: "100%",
  width: "100%",
  borderRadius: 14 / 2,
  zIndex: -1,
  transition: theme.transitions.create(["opacity", "background-color"], {
    duration: theme.transitions.duration.shortest
  }),
  backgroundColor: theme.vars ? theme.vars.palette.common.onBackground : `${theme.palette.mode === "light" ? theme.palette.common.black : theme.palette.common.white}`,
  opacity: theme.vars ? theme.vars.opacity.switchTrack : `${theme.palette.mode === "light" ? 0.38 : 0.3}`
}));
const SwitchThumb = styled("span", {
  name: "MuiSwitch",
  slot: "Thumb",
  overridesResolver: (props, styles) => styles.thumb
})(({
  theme
}) => ({
  boxShadow: (theme.vars || theme).shadows[1],
  backgroundColor: "currentColor",
  width: 20,
  height: 20,
  borderRadius: "50%"
}));
const Switch = /* @__PURE__ */ reactExports.forwardRef(function Switch2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiSwitch"
  });
  const {
    className,
    color = "primary",
    edge = false,
    size = "medium",
    sx
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded);
  const ownerState = _extends({}, props, {
    color,
    edge,
    size
  });
  const classes = useUtilityClasses(ownerState);
  const icon = /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchThumb, {
    className: classes.thumb,
    ownerState
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchRoot, {
    className: clsx(classes.root, className),
    sx,
    ownerState,
    children: [/* @__PURE__ */ jsxRuntimeExports.jsx(SwitchSwitchBase, _extends({
      type: "checkbox",
      icon,
      checkedIcon: icon,
      ref,
      ownerState
    }, other, {
      classes: _extends({}, classes, {
        root: classes.switchBase
      })
    })), /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchTrack, {
      className: classes.track,
      ownerState
    })]
  });
});
const DeleteIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"
}), "Delete");
function TutorCoursesPage() {
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [courses, setCourses] = reactExports.useState([]);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [formTitle, setFormTitle] = reactExports.useState("");
  const [formDesc, setFormDesc] = reactExports.useState("");
  const [formSubject, setFormSubject] = reactExports.useState("english");
  const [formLevel, setFormLevel] = reactExports.useState("intermediate");
  const [formPrice, setFormPrice] = reactExports.useState("");
  const fetchCourses = () => {
    setLoading(true);
    setError(null);
    courseApi.getMyCourses().then((data) => setCourses(data.courses || [])).catch((err) => setError(err.message || "Không thể tải khóa học")).finally(() => setLoading(false));
  };
  reactExports.useEffect(() => {
    fetchCourses();
  }, []);
  const handleCreate = async () => {
    if (!formTitle.trim()) return;
    setSubmitting(true);
    try {
      await courseApi.create({
        title: formTitle,
        description: formDesc,
        subject: formSubject,
        level: formLevel,
        price: parseFloat(formPrice) || 0,
        isPublished: false,
        lessons: []
      });
      setOpenCreate(false);
      setFormTitle("");
      setFormDesc("");
      setFormSubject("english");
      setFormLevel("intermediate");
      setFormPrice("");
      fetchCourses();
    } catch (err) {
      alert(err.message || "Tạo khóa học thất bại");
    } finally {
      setSubmitting(false);
    }
  };
  const handleTogglePublish = async (course) => {
    try {
      await courseApi.update(course.uid, { isPublished: !course.isPublished });
      fetchCourses();
    } catch {
    }
  };
  const handleDelete = async (courseId) => {
    if (!window.confirm("Xóa khóa học này?")) return;
    try {
      await courseApi.delete(courseId);
      fetchCourses();
    } catch {
    }
  };
  if (error && courses.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "tutor", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: { xs: 2, md: 0 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Lỗi tải dữ liệu", message: error, onRetry: fetchCourses }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "tutor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Khóa học của tôi" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800 }, children: "Khóa học của tôi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", children: "Quản lý tất cả khóa học bạn đang dạy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "contained", startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, {}), onClick: () => setOpenCreate(true), "aria-label": "Tạo khóa học", children: "Tạo khóa học" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "card", count: 4 }) : courses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolIcon, { sx: { fontSize: 64 } }),
        title: "Chưa có khóa học nào",
        description: "Tạo khóa học đầu tiên để bắt đầu dạy học!",
        actionLabel: "Tạo khóa học",
        onAction: () => setOpenCreate(true)
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 2.5, children: courses.map((course) => /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { sx: {
      borderRadius: 3,
      transition: "all 0.25s",
      "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
        height: 100,
        borderRadius: "12px 12px 0 0",
        background: `linear-gradient(135deg, ${course.isPublished ? "#2563EB" : "#64748B"}, ${course.isPublished ? "#1D4ED8" : "#475569"})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolIcon, { sx: { fontSize: 40, color: "rgba(255,255,255,0.2)" } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { sx: { p: 2.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle1", sx: { fontWeight: 700, flex: 1 }, children: course.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 0.5, ml: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { size: "small", onClick: () => navigate(`/courses/${course.uid}`), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ViewIcon, { fontSize: "small" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { size: "small", color: "error", onClick: () => handleDelete(course.uid), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteIcon, { fontSize: "small" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 0.5, mb: 1.5, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: course.level, size: "small", variant: "outlined", sx: { height: 22, fontSize: "0.7rem" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: course.subject, size: "small", color: "primary", variant: "outlined", sx: { height: 22, fontSize: "0.7rem" } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 2, mb: 1.5 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
            course.totalLessons,
            " bài học"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PeopleIcon, { sx: { fontSize: 14, color: "text.secondary" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
              course.totalStudents,
              " học viên"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "subtitle2", color: "primary", sx: { fontWeight: 700, ml: "auto" }, children: [
            course.price.toLocaleString(),
            "đ"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: course.isPublished,
              onChange: () => handleTogglePublish(course),
              size: "small"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: course.isPublished ? "success.main" : "text.disabled", sx: { fontWeight: 600 }, children: course.isPublished ? "Đã xuất bản" : "Nháp" })
        ] })
      ] })
    ] }) }, course.uid)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: openCreate, onClose: () => setOpenCreate(false), maxWidth: "sm", fullWidth: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { sx: { fontWeight: 700 }, children: "Tạo khóa học mới" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { pt: 1, display: "flex", flexDirection: "column", gap: 2 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            fullWidth: true,
            label: "Tên khóa học",
            required: true,
            value: formTitle,
            onChange: (e) => setFormTitle(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            fullWidth: true,
            label: "Mô tả",
            multiline: true,
            rows: 3,
            value: formDesc,
            onChange: (e) => setFormDesc(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TextField, { fullWidth: true, label: "Môn học", select: true, value: formSubject, onChange: (e) => setFormSubject(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { value: "english", children: "English" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { value: "math", children: "Math" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { value: "programming", children: "Programming" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { value: "science", children: "Science" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { item: true, xs: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TextField, { fullWidth: true, label: "Cấp độ", select: true, value: formLevel, onChange: (e) => setFormLevel(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { value: "beginner", children: "Beginner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { value: "intermediate", children: "Intermediate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { value: "advanced", children: "Advanced" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { value: "expert", children: "Expert" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            fullWidth: true,
            label: "Giá (VNĐ)",
            type: "number",
            value: formPrice,
            onChange: (e) => setFormPrice(e.target.value)
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogActions, { sx: { p: 2, pt: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setOpenCreate(false), children: "Hủy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "contained", onClick: handleCreate, disabled: !formTitle.trim() || submitting, children: submitting ? "Đang tạo..." : "Tạo khóa học" })
      ] })
    ] })
  ] }) });
}
export {
  TutorCoursesPage as default
};
