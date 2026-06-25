import { c as createSvgIcon, j as jsxRuntimeExports, u as useNavigate, a as useAppDispatch, r as reactExports, B as Box, A as Alert, I as IconButton, L as Link, l as loginWithEmail, g as getUserProfile, s as setUser, b as loginWithGoogle, d as loginWithFacebook } from "./index-C9E49YYM.js";
import { A as AuthLayout, V as VisibilityOff } from "./AuthLayout-qKOt5nOV.js";
import { T as TextField } from "./TextField-7kYAUi4b.js";
import { I as InputAdornment } from "./InputAdornment-CzrE54Zk.js";
import { E as EmailIcon } from "./Email-Bg0hrN3w.js";
import { V as ViewIcon } from "./Visibility-DhXG6qrB.js";
import { L as LockIcon } from "./Lock-Q15UZe7H.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { B as Button } from "./Button-xZvr9MJV.js";
import { D as Divider } from "./Divider-BPDNo2-X.js";
import "./useThemeProps-BlB5Q0sr.js";
import "./Menu-C8O2LlbM.js";
import "./useControlled-D8uc4CAn.js";
const FacebookIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"
}), "Facebook");
const GoogleIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
}), "Google");
const VALID_ROLES = ["student", "tutor", "admin"];
function normalizeRole(role) {
  return role && VALID_ROLES.includes(role) ? role : "student";
}
function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPwd, setShowPwd] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const userCred = await loginWithEmail(email, password);
      const profile = await getUserProfile(userCred.uid);
      if (profile) {
        dispatch(setUser({
          user: {
            uid: userCred.uid,
            email: profile.email,
            name: profile.name,
            avt: profile.avt,
            role: normalizeRole(profile.role),
            membership: profile.membership || "free",
            status: profile.status || "active"
          }
        }));
      }
      navigate((profile == null ? void 0 : profile.role) === "admin" ? "/admin" : (profile == null ? void 0 : profile.role) === "tutor" ? "/tutor" : "/dashboard");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const userCred = await loginWithGoogle();
      const profile = await getUserProfile(userCred.uid);
      if (profile) {
        dispatch(setUser({
          user: {
            uid: userCred.uid,
            email: profile.email,
            name: profile.name,
            avt: profile.avt,
            role: normalizeRole(profile.role),
            membership: profile.membership || "free",
            status: profile.status || "active"
          }
        }));
      }
      navigate((profile == null ? void 0 : profile.role) === "admin" ? "/admin" : (profile == null ? void 0 : profile.role) === "tutor" ? "/tutor" : "/dashboard");
    } catch (err) {
      setError(err.message || "Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleFacebook = async () => {
    setLoading(true);
    setError("");
    try {
      const userCred = await loginWithFacebook();
      const profile = await getUserProfile(userCred.uid);
      if (profile) {
        dispatch(setUser({
          user: {
            uid: userCred.uid,
            email: profile.email,
            name: profile.name,
            avt: profile.avt,
            role: normalizeRole(profile.role),
            membership: profile.membership || "free",
            status: profile.status || "active"
          }
        }));
      }
      navigate((profile == null ? void 0 : profile.role) === "admin" ? "/admin" : (profile == null ? void 0 : profile.role) === "tutor" ? "/tutor" : "/dashboard");
    } catch (err) {
      setError(err.message || "Đăng nhập Facebook thất bại");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthLayout, { title: "Đăng nhập", subtitle: "Chào mừng bạn đến với DynoLMS", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { component: "form", onSubmit: handleLogin, children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "error", sx: { mb: 2, borderRadius: 2 }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextField,
      {
        fullWidth: true,
        label: "Email",
        type: "email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        sx: { mb: 2 },
        InputProps: {
          startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(InputAdornment, { position: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmailIcon, { fontSize: "small", color: "action" }) })
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextField,
      {
        fullWidth: true,
        label: "Mật khẩu",
        type: showPwd ? "text" : "password",
        value: password,
        onChange: (e) => setPassword(e.target.value),
        sx: { mb: 1 },
        InputProps: {
          startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(InputAdornment, { position: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LockIcon, { fontSize: "small", color: "action" }) }),
          endAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(InputAdornment, { position: "end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconButton,
            {
              onClick: () => setShowPwd(!showPwd),
              edge: "end",
              size: "small",
              "aria-label": showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu",
              children: showPwd ? /* @__PURE__ */ jsxRuntimeExports.jsx(VisibilityOff, { fontSize: "small" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ViewIcon, { fontSize: "small" })
            }
          ) })
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { textAlign: "right", mb: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Typography,
      {
        component: Link,
        to: "/forgot-password",
        variant: "body2",
        color: "primary",
        sx: { fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } },
        children: "Quên mật khẩu?"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        fullWidth: true,
        variant: "contained",
        size: "large",
        disabled: loading,
        sx: { mb: 2, py: 1.3 },
        children: loading ? "Đang xử lý..." : "Đăng nhập"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { my: 2 }, children: "hoặc" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          fullWidth: true,
          variant: "outlined",
          onClick: handleGoogle,
          disabled: loading,
          startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, {}),
          sx: { py: 1.2 },
          children: "Google"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          fullWidth: true,
          variant: "outlined",
          onClick: handleFacebook,
          disabled: loading,
          startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FacebookIcon, {}),
          sx: { py: 1.2 },
          children: "Facebook"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "body2", align: "center", sx: { mt: 3 }, children: [
      "Chưa có tài khoản?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { component: Link, to: "/register", color: "primary", sx: { fontWeight: 700, textDecoration: "none" }, children: "Đăng ký" })
    ] })
  ] }) });
}
export {
  LoginPage as default
};
