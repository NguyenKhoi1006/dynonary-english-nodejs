import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Box, A as Alert, I as IconButton, L as Link, e as registerWithEmail } from "./index-C9E49YYM.js";
import { A as AuthLayout, V as VisibilityOff } from "./AuthLayout-qKOt5nOV.js";
import { T as TextField } from "./TextField-7kYAUi4b.js";
import { I as InputAdornment } from "./InputAdornment-CzrE54Zk.js";
import { P as PersonIcon } from "./Person-BnomLngj.js";
import { E as EmailIcon } from "./Email-Bg0hrN3w.js";
import { V as ViewIcon } from "./Visibility-DhXG6qrB.js";
import { L as LockIcon } from "./Lock-Q15UZe7H.js";
import { B as Button } from "./Button-xZvr9MJV.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import "./useThemeProps-BlB5Q0sr.js";
import "./Menu-C8O2LlbM.js";
import "./useControlled-D8uc4CAn.js";
function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPwd, setConfirmPwd] = reactExports.useState("");
  const [showPwd, setShowPwd] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPwd) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
      navigate("/login");
    } catch (err) {
      const msg = err.message || "Đăng ký thất bại";
      if (msg.includes("email-already-in-use")) setError("Email đã được sử dụng");
      else if (msg.includes("weak-password")) setError("Mật khẩu quá yếu");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthLayout, { title: "Đăng ký", subtitle: "Tạo tài khoản DynoLMS", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { component: "form", onSubmit: handleRegister, children: [
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "error", sx: { mb: 2, borderRadius: 2 }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextField,
      {
        fullWidth: true,
        label: "Họ tên",
        value: name,
        onChange: (e) => setName(e.target.value),
        sx: { mb: 2 },
        InputProps: {
          startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(InputAdornment, { position: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PersonIcon, { fontSize: "small", color: "action" }) })
        }
      }
    ),
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
        sx: { mb: 2 },
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TextField,
      {
        fullWidth: true,
        label: "Xác nhận mật khẩu",
        type: "password",
        value: confirmPwd,
        onChange: (e) => setConfirmPwd(e.target.value),
        sx: { mb: 3 },
        InputProps: {
          startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(InputAdornment, { position: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LockIcon, { fontSize: "small", color: "action" }) })
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", fullWidth: true, variant: "contained", size: "large", disabled: loading, sx: { py: 1.3 }, children: loading ? "Đang xử lý..." : "Đăng ký" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "body2", align: "center", sx: { mt: 3 }, children: [
      "Đã có tài khoản?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { component: Link, to: "/login", color: "primary", sx: { fontWeight: 700, textDecoration: "none" }, children: "Đăng nhập" })
    ] })
  ] }) });
}
export {
  RegisterPage as default
};
