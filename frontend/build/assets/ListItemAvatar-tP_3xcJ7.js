import { n as generateUtilityClass, v as generateUtilityClasses, r as reactExports, o as useDefaultProps, f as _objectWithoutPropertiesLoose, _ as _extends, j as jsxRuntimeExports, h as clsx, k as composeClasses, p as styled } from "./index-C9E49YYM.js";
import { a as ListContext } from "./Menu-C8O2LlbM.js";
function getListItemAvatarUtilityClass(slot) {
  return generateUtilityClass("MuiListItemAvatar", slot);
}
generateUtilityClasses("MuiListItemAvatar", ["root", "alignItemsFlexStart"]);
const _excluded = ["className"];
const useUtilityClasses = (ownerState) => {
  const {
    alignItems,
    classes
  } = ownerState;
  const slots = {
    root: ["root", alignItems === "flex-start" && "alignItemsFlexStart"]
  };
  return composeClasses(slots, getListItemAvatarUtilityClass, classes);
};
const ListItemAvatarRoot = styled("div", {
  name: "MuiListItemAvatar",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.alignItems === "flex-start" && styles.alignItemsFlexStart];
  }
})(({
  ownerState
}) => _extends({
  minWidth: 56,
  flexShrink: 0
}, ownerState.alignItems === "flex-start" && {
  marginTop: 8
}));
const ListItemAvatar = /* @__PURE__ */ reactExports.forwardRef(function ListItemAvatar2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiListItemAvatar"
  });
  const {
    className
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded);
  const context = reactExports.useContext(ListContext);
  const ownerState = _extends({}, props, {
    alignItems: context.alignItems
  });
  const classes = useUtilityClasses(ownerState);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ListItemAvatarRoot, _extends({
    className: clsx(classes.root, className),
    ownerState,
    ref
  }, other));
});
export {
  ListItemAvatar as L
};
