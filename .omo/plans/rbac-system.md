# Hệ thống phân quyền Dynonary (RBAC)

> Tech: Firebase Auth + Firestore + FastAPI + React 18 + MUI v5
> Admin login riêng: `/admin/login`

---

## 1. Kiến trúc tổng quan

```
                    ┌───────────────────┐
                    │   Firebase Auth    │
                    │  (Client SDK)      │
                    └──────┬────────────┘
                           │ ID Token (Bearer)
                    ┌──────▼────────────┐
                    │  FastAPI Backend   │
                    │  + Firebase Admin  │
                    └──────┬────────────┘
                           │ Firestore R/W
                    ┌──────▼────────────┐
                    │    Firestore DB    │
                    └───────────────────┘
```

**Luồng admin:**
1. Admin vào `/admin/login` → login form riêng (email/password)
2. Firebase Auth trả về ID token
3. Backend verify token → check `role == "admin"` trong Firestore
4. Nếu không phải admin → reject 403
5. Frontend lưu role vào Redux, redirect tới `/admin/dashboard`

**Luồng learner:**
1. Learner đăng nhập ở `/login`
2. Sau login, backend trả về profile kèm `role: "learner"`, `level`, `membership`
3. Frontend điều hướng theo level (chưa xếp loại → placement test)
4. Truy cập tài liệu theo level, premium check

---

## 2. Database Schema (Firestore)

### 2.1 `users/{uid}` — Extended

```typescript
// Fields HIỆN TẠI (GIỮ NGUYÊN):
  email: string
  name: string
  username: string
  avt: string
  coin: number
  favoriteList: string[]
  createdDate: Timestamp
  provider: string

// Fields THÊM MỚI:
  role: "learner" | "admin"              // mặc định "learner"
  membership: "free" | "premium"         // mặc định "free"
  premiumExpiry: Timestamp | null
  status: "active" | "banned"            // mặc định "active"
  level: null | "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  levelAssignedAt: Timestamp | null
  xp: number                             // tích luỹ kinh nghiệm
  totalStudyDays: number
  lastActiveAt: Timestamp | null
```

### 2.2 `placement_tests/{testId}` — Bài kiểm tra đầu vào

```typescript
{
  title: string                     // "Cambridge Placement Test"
  description: string
  type: "initial" | "level_up"      // initial = đầu vào, level_up = lên cấp
  targetLevel: null | string        // null = mixed levels, "A2" = test lên B1
  timeLimit: number                 // phút
  passScore: number                 // % để đỗ (vd 70)
  questions: Question[]             // tối đa 50 câu
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string                 // admin uid
}

interface Question {
  id: string
  questionText: string
  options: string[]                 // 4 đáp án
  correctAnswer: number            // index (0-3)
  type: "grammar" | "vocabulary" | "reading" | "listening"
  level?: string                   // A1-C2 để phân bổ điểm
}
```

### 2.3 `user_placement_attempts/{attemptId}` — Lịch sử làm bài

```typescript
{
  userId: string
  testId: string
  type: "initial" | "level_up"
  score: number                    // %
  resultLevel: string              // A1-C2 (kết quả sau chấm)
  passed: boolean
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[]
  startedAt: Timestamp
  completedAt: Timestamp
  targetLevel?: string             // cho level_up
}
```

### 2.4 `learning_materials/{materialId}` — Tài liệu học tập

```typescript
{
  title: string
  description: string
  level: string                    // A1-C2
  type: "lesson" | "document" | "video" | "exercise" | "audio"
  content: string                  // nội dung đầy đủ (HTML/Markdown)
  previewContent: string           // nội dung xem trước (cho free user)
  isPremium: boolean               // true = chỉ premium mới xem được full
  tags: string[]
  order: number                    // thứ tự trong level
  estimatedMinutes: number
  createdBy: string                // admin uid
  createdAt: Timestamp
  updatedAt: Timestamp
  published: boolean
}
```

### 2.5 `tests/{testId}` — Bài kiểm tra (do admin tạo)

```typescript
{
  title: string
  description: string
  level: string
  type: "practice" | "assessment" | "level_up"
  timeLimit: number
  passScore: number
  questions: Question[]
  isPremium: boolean               // true = chỉ premium
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  published: boolean
}
```

### 2.6 `user_progress/{userId}/levels/{level}` — Tiến độ theo cấp

```typescript
{
  level: string
  status: "locked" | "in_progress" | "completed"
  startedAt: Timestamp | null
  completedAt: Timestamp | null
  materialsCompleted: string[]     // materialIds
  testsPassed: string[]            // testIds
  progress: number                 // 0-100%
  levelUpAttempts: number          // số lần thi lên cấp
  lastLevelUpAt: Timestamp | null
}
```

### 2.7 `user_activity/{userId}/logs/{logId}` — Log hoạt động

```typescript
{
  action: string                   // "login" | "view_material" | "take_test" | "level_up" | "premium_upgrade"
  details: any
  timestamp: Timestamp
  ip: string
}
```

### 2.8 `admin_logs/{logId}` — Log hành động admin

```typescript
{
  adminUid: string
  action: string                   // "ban_user" | "premium_grant" | "create_material" | "create_test" | ...
  targetId: string                 // uid hoặc materialId
  details: any                     // chi tiết thay đổi
  timestamp: Timestamp
}
```

---

## 3. Backend API (FastAPI)

### 3.1 Middleware mới

```python
# app/middleware/admin_auth.py
async def verify_admin(token: dict = Depends(verify_firebase_token)) -> dict:
    """Verify token + check role == 'admin'."""
    uid = token.get("uid")
    db = get_firestore_db()
    user_doc = db.collection("users").document(uid).get()
    if not user_doc.exists or user_doc.to_dict().get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Admin only")
    return token
```

### 3.2 Feature routers mới

| Router | Endpoints | Auth |
|--------|-----------|------|
| `/apis/admin/users` | `GET /list`, `GET /{uid}`, `PUT /{uid}`, `PUT /{uid}/ban`, `PUT /{uid}/premium` | Admin |
| `/apis/admin/materials` | `GET /list`, `POST /`, `PUT /{id}`, `DELETE /{id}` | Admin |
| `/apis/admin/tests` | `GET /list`, `POST /`, `PUT /{id}`, `DELETE /{id}` | Admin |
| `/apis/admin/activity` | `GET /logs`, `GET /users/{uid}/logs` | Admin |
| `/apis/admin/dashboard` | `GET /stats` (users, materials, tests counts) | Admin |
| `/apis/admin/placement` | `POST /tests`, `PUT /tests/{id}` (admin tạo placement test) | Admin |
| `/apis/learner/placement` | `GET /test`, `POST /submit` (làm placement test) | Learner |
| `/apis/learner/materials` | `GET /list?level=X` (filter theo level + premium check) | Learner |
| `/apis/learner/progress` | `GET /`, `POST /complete-material`, `POST /level-up` | Learner |
| `/apis/learner/tests` | `GET /list`, `GET /{id}`, `POST /{id}/submit` | Learner |

### 3.3 Admin router structure

```python
# app/features/admin/ — thư mục mới
admin/
├── __init__.py
├── router.py              # mount tất cả sub-routers
├── dependencies.py        # verify_admin chung
├── users/
│   ├── router.py
│   ├── service.py
│   └── schema.py
├── materials/
│   ├── router.py
│   ├── service.py
│   └── schema.py
├── tests/
│   ├── router.py
│   ├── service.py
│   └── schema.py
├── activity/
│   └── router.py
└── dashboard/
    └── router.py
```

### 3.4 Learner module structure

```python
# app/features/learner/ — thư mục mới
learner/
├── __init__.py
├── router.py              # learner prefix router
├── dependencies.py        # verify_learner (chặn admin)
├── placement/
│   ├── router.py
│   ├── service.py
│   └── schema.py
├── progress/
│   ├── router.py
│   ├── service.py
│   └── schema.py
└── materials/
    ├── router.py
    ├── service.py
    └── schema.py
```

---

## 4. Frontend Architecture

### 4.1 Routes mới

```typescript
// Thêm vào ROUTES constant
ROUTES_ADMIN = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  MATERIALS: '/admin/materials',
  TESTS: '/admin/tests',
  ACTIVITY: '/admin/activity',
}

ROUTES_LEARNER = {
  PLACEMENT_TEST: '/placement-test',
  MATERIALS: '/materials',
  MY_PROGRESS: '/my-progress',
  LEVEL_UP: '/level-up',
}
```

### 4.2 Redux mở rộng

```typescript
// Thêm vào userInfo.slice.ts
interface UserInfoState {
  // ... existing fields
  role: 'learner' | 'admin' | null;     // THÊM
  level: string | null;                  // THÊM
  membership: 'free' | 'premium';        // THÊM
  status: 'active' | 'banned';          // THÊM
}
```

### 4.3 Route guard mới

```typescript
// components/ProtectedRoute.tsx
// - `isProtect` → yêu cầu đăng nhập
// - `requiredRole: 'admin'` → yêu cầu admin
// - `requiredRole: 'learner'` → yêu cầu learner
// - `requireLevel: boolean` → yêu cầu đã xếp loại
```

### 4.4 Admin pages (lazy-loaded)

| Route | Page | Mô tả |
|-------|------|-------|
| `/admin/login` | AdminLoginPage | Form login riêng, CSS khác |
| `/admin/dashboard` | AdminDashboard | Thống kê tổng quan |
| `/admin/users` | AdminUsersPage | Quản lý người dùng (table) |
| `/admin/users/:uid` | AdminUserDetail | Chi tiết 1 user (edit, premium, ban) |
| `/admin/materials` | AdminMaterialsPage | CRUD tài liệu học tập |
| `/admin/materials/:id/edit` | AdminMaterialEdit | Soạn thảo tài liệu (rich text) |
| `/admin/tests` | AdminTestsPage | Quản lý bài kiểm tra |
| `/admin/tests/:id/edit` | AdminTestEdit | Tạo/sửa câu hỏi |
| `/admin/activity` | AdminActivityPage | Xem log hoạt động |

### 4.5 Learner pages mới

| Route | Page | Mô tả |
|-------|------|-------|
| `/placement-test` | PlacementTestPage | Thi đầu vào Cambridge |
| `/materials` | MaterialsPage | Danh sách tài liệu theo level |
| `/materials/:id` | MaterialDetailPage | Xem tài liệu (premium check) |
| `/my-progress` | ProgressPage | Tiến độ học tập |
| `/level-up` | LevelUpTestPage | Thi lên cấp |

---

## 5. Placement Test Logic

**Cambridge standard placement:**

1. User chưa có level → redirect tới `/placement-test`
2. Test gồm 40-50 câu (grammar + vocabulary + reading)
3. Mỗi câu ứng với 1 level (A1=1-10, A2=11-20, B1=21-30, B2=31-40, C1=41-45, C2=46-50)
4. Chấm điểm theo thang: số câu đúng ở mỗi mức → xác định level
   - Ví dụ: đúng 7/10 A1, 8/10 A2, 5/10 B1 → xếp B1 (vượt A2, đang học B1)
5. Kết quả lưu vào `users/{uid}.level` và `user_placement_attempts/`

**Level-up test:**
1. User học xong level hiện tại → có thể đăng ký thi lên cấp
2. Hoặc sau 1 tuần kể từ khi bắt đầu level → được thi sớm
3. Test gồm câu hỏi ở level hiện tại (cần đỗ 70%+ để lên cấp)
4. Nếu đỗ → cập nhật level lên bậc tiếp theo
5. Nếu trượt → học lại, chờ 3 ngày mới thi lại

---

## 6. Premium Logic

```typescript
// Kiểm tra quyền truy cập nội dung
function canAccessMaterial(user: UserInfoState, material: Material): boolean {
  if (!material.isPremium) return true;        // free content → ai cũng xem
  if (user.membership === 'premium') {
    if (user.premiumExpiry) {
      return new Date(user.premiumExpiry) > new Date(); // chưa hết hạn
    }
    return true;  // premium vĩnh viễn
  }
  return false; // free user, content premium → chỉ xem preview
}
```

**Premium user:** xem toàn bộ content
**Free user:** chỉ xem `previewContent` (3 đoạn đầu / 20% nội dung)

---

## 7. Roadmap theo Phase

### Phase 1: Foundation 🏗️ (3-4 ngày)

**Backend:**
- [ ] Thêm `role`, `membership`, `status`, `level`, `xp` vào user schema
- [ ] `app/middleware/admin_auth.py` — middleware `verify_admin`
- [ ] `app/features/admin/` — base structure (dependencies, router)
- [ ] `app/features/learner/` — base structure
- [ ] API `/apis/account/user-info` trả về thêm role, level, membership
- [ ] Mount admin + learner routers trong `main.py`

**Frontend:**
- [ ] Mở rộng Redux `userInfo.slice` (thêm role, level, membership, status)
- [ ] Thêm ROUTES admin + learner mới vào `constant/index.js`
- [ ] `components/ProtectedRoute.tsx` — role-based route guard
- [ ] Admin login page (`/admin/login`) — form riêng
- [ ] Admin layout + sidebar (Material UI Drawer)
- [ ] `App.tsx` — thêm admin + learner routes

### Phase 2: Admin Dashboard (4-5 ngày)

- [ ] API users list + search + filter
- [ ] API user detail + edit (ban, premium, role)
- [ ] Admin Users page (table with MUI DataGrid)
- [ ] Admin User Detail page
- [ ] Premium granting UI
- [ ] Activity log API + page
- [ ] Dashboard stats API + page
- [ ] Admin logs API

### Phase 3: Content Management (4-5 ngày)

- [ ] API CRUD learning materials
- [ ] API CRUD tests
- [ ] Admin Materials page (list + create/edit form)
- [ ] Rich text editor cho nội dung bài học
- [ ] Admin Tests page (list + create/edit với question builder)
- [ ] API upload media (hình ảnh, audio cho tài liệu)

### Phase 4: Placement & Level System (3-4 ngày)

- [ ] API lấy placement test + submit + chấm điểm
- [ ] API level-up test + chấm điểm
- [ ] API tracking progress (complete material, accumulate XP)
- [ ] Placement Test page (UI làm bài với timer)
- [ ] Materials page (list + filter theo level)
- [ ] Material Detail page (premium check)
- [ ] My Progress page
- [ ] Level-up test page

### Phase 5: Premium Paywall (2-3 ngày)

- [ ] Premium check middleware ở backend
- [ ] Preview content mechanism (backend trả về preview nếu free)
- [ ] Premium badge/UI trong frontend
- [ ] Lock/unlock content dựa trên membership
- [ ] (Tích hợp payment gateway nếu cần — tách phase riêng)

---

## 8. Risks & Lưu ý

1. **Firestore Security Rules** — Cần cập nhật rules để không cho client tự sửa role
2. **Admin seeding** — Cần script tạo admin đầu tiên (hoặc seed thủ công qua Firebase console)
3. **Placement test fairness** — Cần calibrate điểm chuẩn Cambridge hợp lý
4. **Premium không có payment** — Tạm thời admin grant thủ công, chưa tích hợp cổng thanh toán
5. **NoSQL limitations** — Firestore không support aggregation queries mạnh, dashboard stats phải đếm thủ công hoặc dùng Firebase Count documents
