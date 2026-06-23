# Dynonary → Duolingo-style Gamification Plan

## Current State Assessment

### Already Built
- **CEFR Level system** (A1→C2) with placement test → auto level assignment
- **28 learning materials** with content (Markdown)
- **Placement test** (60 questions, Cambridge-aligned scoring)
- **Level tests** (6 assessment + 6 level-up)
- **Basic LMS dashboard**: hero, XP display, CEFR roadmap, continue learning, supplement tools
- **Redux**: `xp`, `level`, `coin` tracked per user
- **Backend**: `/progress` endpoint (get progress, complete material, level-up)
- **Leaderboard page** (basic)
- **UserAccount**: level/progress/XP display
- **Admin**: full CRUD for materials, tests, placement tests

### Gaps vs Duolingo
1. ❌ **No gamified learning path** — current path is a static vertical list, not a Duolingo-style skill tree
2. ❌ **No streak tracking** — no daily login/lesson streak
3. ❌ **No hearts/lives system** — no game-over / recharge mechanic
4. ❌ **No achievements/badges** — no milestone rewards
5. ❌ **No daily quests** — no "complete 3 lessons" missions
6. ❌ **No interactive lesson UI** — lessons are rendered Markdown, not interactive exercises
7. ❌ **No XP animations/rewards** — no satisfying popups, level-up celebrations
8. ❌ **No immersive UX** — needs Duolingo's playful, addictive feel (colors, illustrations, transitions)
9. ❌ **No crown mastery per lesson** — no per-skill mastery levels
10. ❌ **No mobile-responsive gamified navigation** — nav is standard, not bottom-tab style
11. ❌ **No sound effects** — no audio feedback for actions

---

## Implementation Phases

### Phase 1: Gamification Backend (2-3 days)
*Build all data models + APIs for game mechanics*

**1a. User Schema Expansion** → `backend-python/app/features/account/`
- Add fields: `streak`, `lastActiveDate`, `hearts`, `maxHearts`, `heartRechargeAt`, `totalXp`, `dailyXp`, `achievements[]`, `dailyQuests[]`
- Create migration script for existing users

**1b. Streak Service** → `backend-python/app/features/gamification/streak/`
- `POST /check-in` — daily login, increment streak, reset if missed
- `GET /streak` — current streak, longest streak, freeze count
- Streak freeze items (costs gems)

**1c. Hearts/Lives Service** → `backend-python/app/features/gamification/hearts/`
- 5 hearts default, 1 heart lost per mistake in lesson/test
- Recharge 1 heart every 30 minutes (Duolingo style)
- `GET /hearts` — current hearts, recharge timer
- `POST /hearts/refill` — refill with gems (or wait)

**1d. XP & Level Service** → `backend-python/app/features/gamification/xp/`
- XP rewards table:
  | Action | XP |
  |--------|-----|
  | Complete a lesson | 50 XP |
  | Perfect lesson (no mistakes) | 100 XP |
  | Pass a test | 100 XP |
  | Daily check-in | 10 XP (× streak multiplier) |
  | Complete daily quest | 200 XP |
  | Level up (CEFR) | 500 XP |
- `POST /xp/grant` — grant XP, check for level-up
- `GET /xp/history` — XP breakdown

**1e. Achievements Service** → `backend-python/app/features/gamification/achievements/`
Achievements list:
| Achievement | Condition | Reward |
|------------|-----------|--------|
| First Steps | Complete 1 lesson | 50 XP |
| Getting Started | Complete 10 lessons | 200 XP |
| Dedicated Learner | 7-day streak | 500 XP |
| Streak Master | 30-day streak | 2000 XP |
| Level Up A2 | Reach A2 | 300 XP |
| Level Up C1 | Reach C1 | 1000 XP |
| Perfect Score | 10 perfect lessons | 500 XP |
| Explorer | Complete all A1 materials | 300 XP |
| Polyglot | Complete all levels | 5000 XP |
| Quiz Champion | Pass 10 tests | 1000 XP |
- `GET /achievements` — list with progress per achievement
- `POST /achievements/check` — check & award

**1f. Daily Quests Service** → `backend-python/app/features/gamification/quests/`
Daily quest types (3 random per day):
- "Complete 3 lessons" → 200 XP
- "Earn 150 XP" → 200 XP
- "Study for 15 minutes" → 200 XP
- "Complete 1 perfect lesson" → 300 XP
- "Review 5 vocabulary items" → 200 XP
- Automated reset at midnight UTC

**1g. Leaderboard Enhancements** → `backend-python/app/features/gamification/leaderboard/`
- Weekly leagues (Bronze/Silver/Gold/Sapphire/Ruby/Emerald/Diamond)
- Top 10 promotion, bottom 5 relegation
- XP earned this week only (resets weekly)
- `GET /leaderboard` — weekly rankings, user's rank

### Phase 2: Learning Path Overhaul (3-4 days)
*Replace static level list with Duolingo-style skill tree*

**2a. Skill Tree Data Model** → `backend-python/app/features/learner/path/`
- Each CEFR level = 1 Unit (6 units total: A1→C2)
- Each unit has 4-5 lessons (nodes) connected in sequence
- Each lesson node can be: locked → available → completed → mastered
- Node types: Lesson, Story, Test, Level-Up Challenge
- `GET /path` — returns full tree with user progress per node
- Admin API to configure the tree

**2b. Skill Tree UI** → `frontend/src/features/path/SkillTree.tsx`
- Horizontal scrolling path with nodes connected by lines
- Each node = circular icon with lesson type icon inside
- Completed nodes: green checkmark
- Current node: pulsing/glowing
- Locked nodes: gray with lock icon
- Scrollable, responsive (mobile-friendly)
- Animated transitions between nodes

**2c. Path Page** → `frontend/src/features/path/PathPage.tsx`
- Replace `MaterialsPage` with gamified path view
- Top: user avatar, XP, streak, hearts (compact header bar)
- Middle: skill tree visualization
- Bottom: quest progress, achievement notifications

### Phase 3: Immersive Lesson Experience (3-4 days)
*Transform Markdown lessons into interactive Duolingo-style exercises*

**3a. Exercise Types** → `frontend/src/features/lesson/exercises/`
| Type | UI | Backend |
|------|-----|---------|
| Multiple Choice | 4 options, tap to select | question with 4 options |
| Tap to Translate | Vietnamese phrase → tap correct English words | phrase pairs |
| Word Bank | Fill-in-blank with word tiles | sentence with blank + word bank |
| Listening | Play audio → choose correct answer | audio URL + options |
| Pair Matching | Match English ↔ Vietnamese | list of pairs |
| Speak (optional) | Record → compare pronunciation | speech recognition |

**3b. Lesson Player** → `frontend/src/features/lesson/LessonPlayer.tsx`
- Full-screen lesson player (no nav, immersive)
- Shows one question at a time
- Instant feedback: green for correct, red for wrong + shake animation
- Progress bar at top (question 3/10)
- Hearts display (lose 1 per mistake)
- XP counter that animates up
- Sound effects: correct (ding), wrong (buzz), complete (fanfare)
- End-of-lesson summary: XP earned, accuracy, time

**3c. Lesson Content Reform**
- Convert existing Markdown lessons to structured JSON exercise data
- For each lesson, create 5-10 interactive questions
- Fallback: render Markdown as reading passage then quiz
- Admin UI for creating interactive exercises

### Phase 4: UX & Visual Overhaul (2-3 days)
*Make everything look and feel like Duolingo*

**4a. Design System** → `frontend/src/theme/duolingo-theme.ts`
- Duolingo-inspired color palette:
  - Primary: Green (#58cc02) — like Duolingo
  - Secondary: Blue (#1cb0f6)
  - Accent: Orange (#ff9600) 
  - Error: Red (#ff4b4b)
  - Success: Green (#58a700)
- Font: Nunito (Duolingo's font) — import via Google Fonts
- Rounded corners everywhere (border-radius: 12-16px)
- Playful shadows and hover effects
- Consistent spacing system

**4b. Navigation Overhaul** → `frontend/src/components/Navigation/`
- Mobile-first bottom navigation bar (Duolingo style):
  - 🏠 Home | 📚 Path | 🏆 Leaderboard | 👤 Profile
- Each icon has active state with green indicator
- Compact header showing XP + streak

**4c. Animations & Micro-interactions**
- XP earned: number floats up and fades out (+50 XP)
- Level up: confetti + modal with celebration
- Streak fire icon: animated flame
- Complete lesson: checkmark animation
- Wrong answer: shake animation + red flash
- Page transitions: smooth slides

**4d. Result Screens**
- Lesson complete screen: XP earned, accuracy %, time spent, continue button
- Level up screen: new badge, confetti, "You've reached {level}!"
- Achievement unlock: modal with badge + description

### Phase 5: Polish & Engagement (2-3 days)
*Notifications, social features, retention mechanics*

**5a. Push Notifications** → via Firebase Cloud Messaging
- Daily reminder: "Time for your daily lesson!"
- Streak at risk: "Your streak is about to expire!"
- New content available
- Achievement unlocked

**5b. Social Features**
- Friend comparisons on leaderboard
- Share achievements
- Friend streak competitions

**5c. Store / Shop**
- Gems currency (earned from achievements/quests)
- Streak freeze (cost: 200 gems)
- Heart refill (cost: 350 gems)
- Timer boost (cost: 100 gems)
- XP boost (cost: 500 gems)

---

## Estimated Total Effort
- **Phase 1** (Backend gamification): 2-3 days
- **Phase 2** (Skill tree path): 3-4 days
- **Phase 3** (Interactive lessons): 3-4 days
- **Phase 4** (Visual overhaul): 2-3 days
- **Phase 5** (Polish & engagement): 2-3 days

**Total: ~12-17 days (parallelizable)**

## Dependencies
- Phase 1 is prerequisite for Phase 3 (XP, hearts needed in lessons)
- Phase 2 is independent of Phase 1 (can parallelize)
- Phase 4 can partially overlap with Phase 2+3
- Phase 5 depends on Phase 1

## Recommended Order
```
Week 1: Phase 1 (backend gamification) + Phase 2 (skill tree path) in parallel
Week 2: Phase 3 (interactive lessons) + Phase 4 (visual overhaul) in parallel
Week 3: Phase 5 (polish) + integration testing
```
