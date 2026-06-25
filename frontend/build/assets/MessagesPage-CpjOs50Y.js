import { r as reactExports, n as generateUtilityClass, v as generateUtilityClasses, o as useDefaultProps, f as _objectWithoutPropertiesLoose, _ as _extends, H as useSlotProps, h as clsx, j as jsxRuntimeExports, i as capitalize, k as composeClasses, p as styled, c as createSvgIcon, q as useAppSelector, B as Box, I as IconButton } from "./index-C9E49YYM.js";
import { D as DashboardLayout, a as Card, L as ListItem, A as Avatar, e as ListItemText } from "./DashboardLayout-CLktiGAC.js";
import { m as messagingApi, E as ErrorState } from "./ErrorState-Dy_lFwoL.js";
import { B as Breadcrumbs } from "./Breadcrumbs-ChnP2Vff.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-vGqGEVqh.js";
import { E as EmptyState } from "./EmptyState-hcbl-PkZ.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { T as TextField } from "./TextField-7kYAUi4b.js";
import { I as InputAdornment } from "./InputAdornment-CzrE54Zk.js";
import { S as SearchIcon } from "./Search-C444El5K.js";
import { L as List } from "./Menu-C8O2LlbM.js";
import { L as ListItemAvatar } from "./ListItemAvatar-tP_3xcJ7.js";
import "./Divider-BPDNo2-X.js";
import "./Person-BnomLngj.js";
import "./Button-xZvr9MJV.js";
import "./Skeleton-uoTd0EY2.js";
import "./useControlled-D8uc4CAn.js";
const usePreviousProps = (value) => {
  const ref = reactExports.useRef({});
  reactExports.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
function useBadge(parameters) {
  const {
    badgeContent: badgeContentProp,
    invisible: invisibleProp = false,
    max: maxProp = 99,
    showZero = false
  } = parameters;
  const prevProps = usePreviousProps({
    badgeContent: badgeContentProp,
    max: maxProp
  });
  let invisible = invisibleProp;
  if (invisibleProp === false && badgeContentProp === 0 && !showZero) {
    invisible = true;
  }
  const {
    badgeContent,
    max = maxProp
  } = invisible ? prevProps : parameters;
  const displayValue = badgeContent && Number(badgeContent) > max ? `${max}+` : badgeContent;
  return {
    badgeContent,
    invisible,
    max,
    displayValue
  };
}
function getBadgeUtilityClass(slot) {
  return generateUtilityClass("MuiBadge", slot);
}
const badgeClasses = generateUtilityClasses("MuiBadge", [
  "root",
  "badge",
  "dot",
  "standard",
  "anchorOriginTopRight",
  "anchorOriginBottomRight",
  "anchorOriginTopLeft",
  "anchorOriginBottomLeft",
  "invisible",
  "colorError",
  "colorInfo",
  "colorPrimary",
  "colorSecondary",
  "colorSuccess",
  "colorWarning",
  "overlapRectangular",
  "overlapCircular",
  // TODO: v6 remove the overlap value from these class keys
  "anchorOriginTopLeftCircular",
  "anchorOriginTopLeftRectangular",
  "anchorOriginTopRightCircular",
  "anchorOriginTopRightRectangular",
  "anchorOriginBottomLeftCircular",
  "anchorOriginBottomLeftRectangular",
  "anchorOriginBottomRightCircular",
  "anchorOriginBottomRightRectangular"
]);
const _excluded = ["anchorOrigin", "className", "classes", "component", "components", "componentsProps", "children", "overlap", "color", "invisible", "max", "badgeContent", "slots", "slotProps", "showZero", "variant"];
const RADIUS_STANDARD = 10;
const RADIUS_DOT = 4;
const useUtilityClasses = (ownerState) => {
  const {
    color,
    anchorOrigin,
    invisible,
    overlap,
    variant,
    classes = {}
  } = ownerState;
  const slots = {
    root: ["root"],
    badge: ["badge", variant, invisible && "invisible", `anchorOrigin${capitalize(anchorOrigin.vertical)}${capitalize(anchorOrigin.horizontal)}`, `anchorOrigin${capitalize(anchorOrigin.vertical)}${capitalize(anchorOrigin.horizontal)}${capitalize(overlap)}`, `overlap${capitalize(overlap)}`, color !== "default" && `color${capitalize(color)}`]
  };
  return composeClasses(slots, getBadgeUtilityClass, classes);
};
const BadgeRoot = styled("span", {
  name: "MuiBadge",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  position: "relative",
  display: "inline-flex",
  // For correct alignment with the text.
  verticalAlign: "middle",
  flexShrink: 0
});
const BadgeBadge = styled("span", {
  name: "MuiBadge",
  slot: "Badge",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.badge, styles[ownerState.variant], styles[`anchorOrigin${capitalize(ownerState.anchorOrigin.vertical)}${capitalize(ownerState.anchorOrigin.horizontal)}${capitalize(ownerState.overlap)}`], ownerState.color !== "default" && styles[`color${capitalize(ownerState.color)}`], ownerState.invisible && styles.invisible];
  }
})(({
  theme
}) => {
  var _theme$vars;
  return {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    position: "absolute",
    boxSizing: "border-box",
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(12),
    minWidth: RADIUS_STANDARD * 2,
    lineHeight: 1,
    padding: "0 6px",
    height: RADIUS_STANDARD * 2,
    borderRadius: RADIUS_STANDARD,
    zIndex: 1,
    // Render the badge on top of potential ripples.
    transition: theme.transitions.create("transform", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    variants: [...Object.keys(((_theme$vars = theme.vars) != null ? _theme$vars : theme).palette).filter((key) => {
      var _theme$vars2, _theme$vars3;
      return ((_theme$vars2 = theme.vars) != null ? _theme$vars2 : theme).palette[key].main && ((_theme$vars3 = theme.vars) != null ? _theme$vars3 : theme).palette[key].contrastText;
    }).map((color) => ({
      props: {
        color
      },
      style: {
        backgroundColor: (theme.vars || theme).palette[color].main,
        color: (theme.vars || theme).palette[color].contrastText
      }
    })), {
      props: {
        variant: "dot"
      },
      style: {
        borderRadius: RADIUS_DOT,
        height: RADIUS_DOT * 2,
        minWidth: RADIUS_DOT * 2,
        padding: 0
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchorOrigin.vertical === "top" && ownerState.anchorOrigin.horizontal === "right" && ownerState.overlap === "rectangular",
      style: {
        top: 0,
        right: 0,
        transform: "scale(1) translate(50%, -50%)",
        transformOrigin: "100% 0%",
        [`&.${badgeClasses.invisible}`]: {
          transform: "scale(0) translate(50%, -50%)"
        }
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchorOrigin.vertical === "bottom" && ownerState.anchorOrigin.horizontal === "right" && ownerState.overlap === "rectangular",
      style: {
        bottom: 0,
        right: 0,
        transform: "scale(1) translate(50%, 50%)",
        transformOrigin: "100% 100%",
        [`&.${badgeClasses.invisible}`]: {
          transform: "scale(0) translate(50%, 50%)"
        }
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchorOrigin.vertical === "top" && ownerState.anchorOrigin.horizontal === "left" && ownerState.overlap === "rectangular",
      style: {
        top: 0,
        left: 0,
        transform: "scale(1) translate(-50%, -50%)",
        transformOrigin: "0% 0%",
        [`&.${badgeClasses.invisible}`]: {
          transform: "scale(0) translate(-50%, -50%)"
        }
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchorOrigin.vertical === "bottom" && ownerState.anchorOrigin.horizontal === "left" && ownerState.overlap === "rectangular",
      style: {
        bottom: 0,
        left: 0,
        transform: "scale(1) translate(-50%, 50%)",
        transformOrigin: "0% 100%",
        [`&.${badgeClasses.invisible}`]: {
          transform: "scale(0) translate(-50%, 50%)"
        }
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchorOrigin.vertical === "top" && ownerState.anchorOrigin.horizontal === "right" && ownerState.overlap === "circular",
      style: {
        top: "14%",
        right: "14%",
        transform: "scale(1) translate(50%, -50%)",
        transformOrigin: "100% 0%",
        [`&.${badgeClasses.invisible}`]: {
          transform: "scale(0) translate(50%, -50%)"
        }
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchorOrigin.vertical === "bottom" && ownerState.anchorOrigin.horizontal === "right" && ownerState.overlap === "circular",
      style: {
        bottom: "14%",
        right: "14%",
        transform: "scale(1) translate(50%, 50%)",
        transformOrigin: "100% 100%",
        [`&.${badgeClasses.invisible}`]: {
          transform: "scale(0) translate(50%, 50%)"
        }
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchorOrigin.vertical === "top" && ownerState.anchorOrigin.horizontal === "left" && ownerState.overlap === "circular",
      style: {
        top: "14%",
        left: "14%",
        transform: "scale(1) translate(-50%, -50%)",
        transformOrigin: "0% 0%",
        [`&.${badgeClasses.invisible}`]: {
          transform: "scale(0) translate(-50%, -50%)"
        }
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchorOrigin.vertical === "bottom" && ownerState.anchorOrigin.horizontal === "left" && ownerState.overlap === "circular",
      style: {
        bottom: "14%",
        left: "14%",
        transform: "scale(1) translate(-50%, 50%)",
        transformOrigin: "0% 100%",
        [`&.${badgeClasses.invisible}`]: {
          transform: "scale(0) translate(-50%, 50%)"
        }
      }
    }, {
      props: {
        invisible: true
      },
      style: {
        transition: theme.transitions.create("transform", {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.leavingScreen
        })
      }
    }]
  };
});
const Badge = /* @__PURE__ */ reactExports.forwardRef(function Badge2(inProps, ref) {
  var _ref, _slots$root, _ref2, _slots$badge, _slotProps$root, _slotProps$badge;
  const props = useDefaultProps({
    props: inProps,
    name: "MuiBadge"
  });
  const {
    anchorOrigin: anchorOriginProp = {
      vertical: "top",
      horizontal: "right"
    },
    className,
    component,
    components = {},
    componentsProps = {},
    children,
    overlap: overlapProp = "rectangular",
    color: colorProp = "default",
    invisible: invisibleProp = false,
    max: maxProp = 99,
    badgeContent: badgeContentProp,
    slots,
    slotProps,
    showZero = false,
    variant: variantProp = "standard"
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded);
  const {
    badgeContent,
    invisible: invisibleFromHook,
    max,
    displayValue: displayValueFromHook
  } = useBadge({
    max: maxProp,
    invisible: invisibleProp,
    badgeContent: badgeContentProp,
    showZero
  });
  const prevProps = usePreviousProps({
    anchorOrigin: anchorOriginProp,
    color: colorProp,
    overlap: overlapProp,
    variant: variantProp,
    badgeContent: badgeContentProp
  });
  const invisible = invisibleFromHook || badgeContent == null && variantProp !== "dot";
  const {
    color = colorProp,
    overlap = overlapProp,
    anchorOrigin = anchorOriginProp,
    variant = variantProp
  } = invisible ? prevProps : props;
  const displayValue = variant !== "dot" ? displayValueFromHook : void 0;
  const ownerState = _extends({}, props, {
    badgeContent,
    invisible,
    max,
    displayValue,
    showZero,
    anchorOrigin,
    color,
    overlap,
    variant
  });
  const classes = useUtilityClasses(ownerState);
  const RootSlot = (_ref = (_slots$root = slots == null ? void 0 : slots.root) != null ? _slots$root : components.Root) != null ? _ref : BadgeRoot;
  const BadgeSlot = (_ref2 = (_slots$badge = slots == null ? void 0 : slots.badge) != null ? _slots$badge : components.Badge) != null ? _ref2 : BadgeBadge;
  const rootSlotProps = (_slotProps$root = slotProps == null ? void 0 : slotProps.root) != null ? _slotProps$root : componentsProps.root;
  const badgeSlotProps = (_slotProps$badge = slotProps == null ? void 0 : slotProps.badge) != null ? _slotProps$badge : componentsProps.badge;
  const rootProps = useSlotProps({
    elementType: RootSlot,
    externalSlotProps: rootSlotProps,
    externalForwardedProps: other,
    additionalProps: {
      ref,
      as: component
    },
    ownerState,
    className: clsx(rootSlotProps == null ? void 0 : rootSlotProps.className, classes.root, className)
  });
  const badgeProps = useSlotProps({
    elementType: BadgeSlot,
    externalSlotProps: badgeSlotProps,
    ownerState,
    className: clsx(classes.badge, badgeSlotProps == null ? void 0 : badgeSlotProps.className)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(RootSlot, _extends({}, rootProps, {
    children: [children, /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeSlot, _extends({}, badgeProps, {
      children: displayValue
    }))]
  }));
});
const SendIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"
}), "Send");
function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = /* @__PURE__ */ new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 6e4) return "Vừa xong";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)} phút`;
  if (diff < 864e5) return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  return d.toLocaleDateString("vi-VN");
}
function MessagesPage() {
  var _a;
  const [activeConv, setActiveConv] = reactExports.useState(null);
  const [input, setInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [conversations, setConversations] = reactExports.useState([]);
  const [messages, setMessages] = reactExports.useState([]);
  const [messagesLoading, setMessagesLoading] = reactExports.useState(false);
  const [sending, setSending] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const { currentUser } = useAppSelector((s) => s.user);
  const role = (currentUser == null ? void 0 : currentUser.role) === "tutor" ? "tutor" : "student";
  const messagesEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    messagingApi.getConversations().then((data) => {
      if (!cancelled) {
        const convs = data.conversations || [];
        setConversations(convs);
        if (convs.length > 0 && !activeConv) {
          setActiveConv(convs[0].userId);
        }
      }
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Không thể tải danh sách tin nhắn");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  reactExports.useEffect(() => {
    if (!activeConv) return;
    let cancelled = false;
    setMessagesLoading(true);
    messagingApi.getMessages(activeConv).then((data) => {
      if (!cancelled) setMessages(data.messages || []);
    }).catch(() => {
      if (!cancelled) setMessages([]);
    }).finally(() => {
      if (!cancelled) setMessagesLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [activeConv]);
  reactExports.useEffect(() => {
    var _a2;
    (_a2 = messagesEndRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const activeConvData = conversations.find((c) => c.userId === activeConv);
  const filteredConvs = conversations.filter(
    (c) => c.userName.toLowerCase().includes(search.toLowerCase())
  );
  const handleSend = async () => {
    if (!input.trim() || !activeConv || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    const optimistic = {
      uid: `temp-${Date.now()}`,
      senderId: (currentUser == null ? void 0 : currentUser.uid) || "",
      senderName: (currentUser == null ? void 0 : currentUser.name) || "",
      senderAvt: (currentUser == null ? void 0 : currentUser.avt) || "",
      receiverId: activeConv,
      content: text,
      isRead: false,
      createdDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      await messagingApi.send({ receiverId: activeConv, content: text });
    } catch {
      setMessages((prev) => prev.filter((m) => m.uid !== optimistic.uid));
      setInput(text);
    } finally {
      setSending(false);
    }
  };
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: { xs: 2, md: 0 } }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Lỗi tải dữ liệu", message: error, onRetry: () => window.location.reload() }) }) });
  }
  conversations.findIndex((c) => c.userId === activeConv);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Tin nhắn" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h4", sx: { fontWeight: 800, mb: 3 }, children: "Tin nhắn" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 2, minHeight: "calc(100vh - 260px)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: {
        width: { xs: "100%", md: 340 },
        flexShrink: 0,
        display: { xs: activeConv ? "none" : "block", md: "block" },
        overflow: "auto",
        maxHeight: "calc(100vh - 300px)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            fullWidth: true,
            size: "small",
            placeholder: "Tìm kiếm...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            sx: { mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 3 } },
            InputProps: {
              startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(InputAdornment, { position: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, { fontSize: "small", color: "action" }) })
            },
            inputProps: { "aria-label": "Tìm kiếm hội thoại" }
          }
        ),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "list", count: 5 }) : filteredConvs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            title: "Chưa có tin nhắn",
            description: "Khi bạn nhắn tin với gia sư hoặc học viên, cuộc hội thoại sẽ hiển thị ở đây."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(List, { sx: { p: 0 }, children: filteredConvs.map((conv, i) => {
          var _a2;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              onClick: () => setActiveConv(conv.userId),
              sx: {
                mb: 1,
                borderRadius: 2.5,
                cursor: "pointer",
                bgcolor: activeConv === conv.userId ? "action.selected" : "background.paper",
                "&:hover": { bgcolor: "action.hover" }
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ListItem, { sx: { p: 1.5 }, alignItems: "flex-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ListItemAvatar, { sx: { minWidth: 48 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { src: conv.userAvt, sx: { bgcolor: "primary.main" }, "aria-hidden": "true", children: ((_a2 = conv.userName) == null ? void 0 : _a2.charAt(0)) || "?" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ListItemText,
                  {
                    primary: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "space-between" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 700, fontSize: "0.85rem" }, children: conv.userName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.disabled", children: formatTime(conv.lastMessageDate) })
                    ] }),
                    secondary: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", sx: {
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 220
                    }, children: conv.lastMessage })
                  }
                ),
                conv.unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { ml: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { badgeContent: conv.unreadCount, color: "primary", sx: { "& .MuiBadge-badge": { fontSize: "0.65rem", fontWeight: 700, minWidth: 18, height: 18 } } }) })
              ] })
            },
            conv.userId
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
        flex: 1,
        display: { xs: activeConv ? "flex" : "none", md: "flex" },
        flexDirection: "column",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden"
      }, children: activeConvData ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: {
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1.5
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconButton,
            {
              sx: { display: { md: "none" } },
              onClick: () => setActiveConv(null),
              "aria-label": "Quay lại danh sách",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, { fontSize: "small" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { src: activeConvData.userAvt, sx: { width: 36, height: 36, bgcolor: "primary.main" }, "aria-hidden": "true", children: ((_a = activeConvData.userName) == null ? void 0 : _a.charAt(0)) || "?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 700 }, children: activeConvData.userName }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: {
          flex: 1,
          overflow: "auto",
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.5
        }, children: [
          messagesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { type: "list", count: 4 }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { textAlign: "center", py: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: "Chưa có tin nhắn. Hãy gửi lời chào đầu tiên!" }) }) : messages.map((msg) => {
            const isMe = msg.senderId === (currentUser == null ? void 0 : currentUser.uid);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: { xs: "85%", sm: "70%" } }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
                bgcolor: isMe ? "primary.main" : "action.hover",
                color: isMe ? "#fff" : "text.primary",
                px: 2,
                py: 1.2,
                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: msg.content }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.disabled", sx: { display: "block", mt: 0.3, px: 1 }, children: formatTime(msg.createdDate) })
            ] }, msg.uid);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: {
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          gap: 1,
          alignItems: "center"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              fullWidth: true,
              size: "small",
              placeholder: "Nhập tin nhắn...",
              value: input,
              onChange: (e) => setInput(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              },
              sx: { "& .MuiOutlinedInput-root": { borderRadius: 3 } },
              inputProps: { "aria-label": "Nhập tin nhắn" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconButton,
            {
              color: "primary",
              disabled: !input.trim() || sending,
              onClick: handleSend,
              "aria-label": "Gửi tin nhắn",
              sx: { bgcolor: input.trim() ? "primary.main" : "transparent", color: input.trim() ? "#fff" : void 0, "&:hover": { bgcolor: input.trim() ? "primary.dark" : "action.hover" } },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SendIcon, {})
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", color: "text.secondary", children: "Chọn một hội thoại để bắt đầu" }) }) })
    ] })
  ] }) });
}
export {
  MessagesPage as default
};
