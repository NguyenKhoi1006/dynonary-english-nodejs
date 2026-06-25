import { c as createSvgIcon, j as jsxRuntimeExports, a8 as api, B as Box } from "./index-C9E49YYM.js";
import { T as Typography } from "./Typography-CK0KD3-l.js";
import { B as Button } from "./Button-xZvr9MJV.js";
const ErrorIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8"
}), "ErrorOutline");
const tutorApi = {
  list: (params) => api.get("/apis/tutors/list", { params }).then((r) => r.data),
  getById: (uid) => api.get(`/apis/tutors/${uid}`).then((r) => r.data),
  getMyProfile: () => api.get("/apis/tutors/my-profile").then((r) => r.data),
  apply: (data) => api.post("/apis/tutors/apply", data).then((r) => r.data),
  updateProfile: (data) => api.put("/apis/tutors/my-profile", data).then((r) => r.data)
};
const courseApi = {
  list: (params) => api.get("/apis/courses/list", { params }).then((r) => r.data),
  getById: (courseId) => api.get(`/apis/courses/${courseId}`).then((r) => r.data),
  getMyCourses: (params) => api.get("/apis/courses/my-courses", { params }).then((r) => r.data),
  create: (data) => api.post("/apis/courses/create", data).then((r) => r.data),
  update: (courseId, data) => api.put(`/apis/courses/${courseId}`, data).then((r) => r.data),
  delete: (courseId) => api.delete(`/apis/courses/${courseId}`).then((r) => r.data),
  getLessons: (courseId) => api.get(`/apis/courses/${courseId}/lessons`).then((r) => r.data),
  addLesson: (courseId, data) => api.post(`/apis/courses/${courseId}/lessons`, data).then((r) => r.data),
  updateLesson: (courseId, lessonId, data) => api.put(`/apis/courses/${courseId}/lessons/${lessonId}`, data).then((r) => r.data),
  deleteLesson: (courseId, lessonId) => api.delete(`/apis/courses/${courseId}/lessons/${lessonId}`).then((r) => r.data)
};
const schedulingApi = {
  setAvailability: (slots) => api.post("/apis/scheduling/availability", { slots }).then((r) => r.data),
  getAvailability: (tutorId) => api.get(`/apis/scheduling/availability/${tutorId}`).then((r) => r.data),
  createBooking: (data) => api.post("/apis/scheduling/book", data).then((r) => r.data),
  getMyBookings: () => api.get("/apis/scheduling/my-bookings").then((r) => r.data),
  getTutorBookings: () => api.get("/apis/scheduling/tutor-bookings").then((r) => r.data),
  confirmBooking: (bookingId) => api.put(`/apis/scheduling/bookings/${bookingId}/confirm`).then((r) => r.data),
  cancelBooking: (bookingId) => api.put(`/apis/scheduling/bookings/${bookingId}/cancel`).then((r) => r.data),
  getMySessions: (role) => api.get("/apis/scheduling/my-sessions", { params: { role } }).then((r) => r.data),
  getSession: (sessionId) => api.get(`/apis/scheduling/sessions/${sessionId}`).then((r) => r.data),
  completeSession: (sessionId, note) => api.put(`/apis/scheduling/sessions/${sessionId}/complete`, { note: note || "" }).then((r) => r.data)
};
const reviewApi = {
  create: (data) => api.post("/apis/reviews/create", data).then((r) => r.data),
  getTutorReviews: (tutorId) => api.get(`/apis/reviews/tutor/${tutorId}`).then((r) => r.data)
};
const messagingApi = {
  send: (data) => api.post("/apis/messaging/send", data).then((r) => r.data),
  getConversations: () => api.get("/apis/messaging/conversations").then((r) => r.data),
  getMessages: (otherId) => api.get(`/apis/messaging/messages/${otherId}`).then((r) => r.data),
  markAsRead: (otherId) => api.put(`/apis/messaging/read/${otherId}`).then((r) => r.data)
};
function ErrorState({
  title = "Có lỗi xảy ra",
  message = "Không thể tải dữ liệu. Vui lòng thử lại sau.",
  onRetry
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { mb: 2, color: "error.main", opacity: 0.7 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorIcon, { sx: { fontSize: 64 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 700, mb: 0.5 }, children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3, maxWidth: 360, mx: "auto" }, children: message }),
        onRetry && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outlined", color: "primary", onClick: onRetry, children: "Thử lại" })
      ]
    }
  );
}
export {
  ErrorState as E,
  courseApi as c,
  messagingApi as m,
  reviewApi as r,
  schedulingApi as s,
  tutorApi as t
};
