import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ROUTES } from 'constant';

// Lazy-loaded page components
const HomePage = React.lazy(() => import('features/home/HomePage'));
const LoginPage = React.lazy(() => import('features/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('features/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('features/auth/ForgotPasswordPage'));
const Logout = React.lazy(() => import('features/auth/Logout'));
const IPAPage = React.lazy(() => import('features/ipa/IPAPage'));
const ContributionPage = React.lazy(() => import('features/contribution/ContributionPage'));
const DynoDictionaryPage = React.lazy(() => import('features/dictionary/DynoDictionaryPage'));
const FavoriteDictionaryPage = React.lazy(() => import('features/dictionary/FavoriteDictionaryPage'));
const CommunicationPhrasePage = React.lazy(() => import('features/communication/CommunicationPhrasePage'));
const GrammarPage = React.lazy(() => import('features/grammar/GrammarPage'));
const FlashcardPage = React.lazy(() => import('features/vocabulary/FlashcardPage'));
const IrregularVerbPage = React.lazy(() => import('features/vocabulary/IrregularVerbPage'));
const PlayGamesPage = React.lazy(() => import('features/games/PlayGamesPage'));
const CorrectWordGamePage = React.lazy(() => import('features/games/CorrectWordGamePage'));
const WordMatchGamePage = React.lazy(() => import('features/games/WordMatchGamePage'));
const FastGamePage = React.lazy(() => import('features/games/FastGamePage'));
const UserAccountPage = React.lazy(() => import('features/user/UserAccountPage'));
const LeaderBoardPage = React.lazy(() => import('features/leaderboard/LeaderBoardPage'));
const NotFoundPage = React.lazy(() => import('features/home/NotFoundPage'));

// Admin pages
const AdminLoginPage = React.lazy(() => import('pages/Admin/AdminLoginPage'));
const AdminDashboardPage = React.lazy(() => import('pages/Admin/AdminDashboardPage'));
const AdminUsersPage = React.lazy(() => import('pages/Admin/AdminUsersPage'));
const AdminMaterialsPage = React.lazy(() => import('pages/Admin/AdminMaterialsPage'));
const AdminTestsPage = React.lazy(() => import('pages/Admin/AdminTestsPage'));
const AdminActivityPage = React.lazy(() => import('pages/Admin/AdminActivityPage'));
const AdminWordsPage = React.lazy(() => import('pages/Admin/AdminWordsPage'));
const AdminSentencesPage = React.lazy(() => import('pages/Admin/AdminSentencesPage'));
const AdminTopicsPage = React.lazy(() => import('pages/Admin/AdminTopicsPage'));
const AdminIrregularVerbsPage = React.lazy(() => import('pages/Admin/AdminIrregularVerbsPage'));
const AdminBlogPage = React.lazy(() => import('pages/Admin/AdminBlogPage'));
const AdminPlacementTestsPage = React.lazy(() => import('pages/Admin/AdminPlacementTestsPage'));

// Learner pages
const PlacementTestPage = React.lazy(() => import('pages/Learner/PlacementTestPage'));
const MaterialsPage = React.lazy(() => import('pages/Learner/MaterialsPage'));
const MaterialDetailPage = React.lazy(() => import('pages/Learner/MaterialDetailPage'));
const ProgressPage = React.lazy(() => import('pages/Learner/ProgressPage'));
const LevelUpPage = React.lazy(() => import('pages/Learner/LevelUpPage'));
const PathPage = React.lazy(() => import('pages/Learner/PathPage'));

type AppRoute = RouteObject & {
  isProtect?: boolean;
  requiredRole?: 'admin' | 'learner';
  placementRequired?: boolean;
};

export const routes: AppRoute[] = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
    isProtect: false,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
    isProtect: false,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
    isProtect: false,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
    isProtect: false,
  },
  {
    path: ROUTES.LOGOUT,
    element: <Logout />,
    isProtect: false,
  },
  {
    path: ROUTES.IPA,
    element: <IPAPage />,
    isProtect: false,
  },
  {
    path: ROUTES.CONTRIBUTION,
    element: <ContributionPage />,
    isProtect: false,
  },
  {
    path: ROUTES.DYNO_DICTIONARY,
    element: <DynoDictionaryPage isTOEIC={false} />,
    isProtect: false,
  },
  {
    path: ROUTES.TOEIC_DICTIONARY,
    element: <DynoDictionaryPage isTOEIC={true} />,
    isProtect: false,
  },
  {
    path: ROUTES.FAVORITE,
    element: <FavoriteDictionaryPage />,
    isProtect: true,
  },
  {
    path: ROUTES.COMMUNICATION_PHRASE,
    element: <CommunicationPhrasePage />,
    isProtect: false,
  },
  {
    path: ROUTES.GRAMMAR,
    element: <GrammarPage />,
    isProtect: false,
  },
  {
    path: ROUTES.FLASHCARD,
    element: <FlashcardPage />,
    isProtect: false,
  },
  {
    path: ROUTES.IRREGULAR,
    element: <IrregularVerbPage />,
    isProtect: false,
  },
  {
    path: ROUTES.GAMES.HOME,
    element: <PlayGamesPage />,
    isProtect: false,
  },
  {
    path: ROUTES.GAMES.CORRECT_WORD,
    element: <CorrectWordGamePage />,
    isProtect: false,
  },
  {
    path: ROUTES.GAMES.WORD_MATCHING,
    element: <WordMatchGamePage />,
    isProtect: false,
  },
  {
    path: ROUTES.GAMES.FAST_GAME,
    element: <FastGamePage />,
    isProtect: false,
  },
  {
    path: ROUTES.USER_ACCOUNT,
    element: <UserAccountPage />,
    isProtect: true,
  },
  {
    path: ROUTES.LEADERBOARD,
    element: <LeaderBoardPage />,
    isProtect: true,
  },
  {
    path: '*',
    element: <NotFoundPage />,
    isProtect: false,
  },

  // ─── Learner routes ───
  {
    path: ROUTES.LEARNER.PLACEMENT,
    element: <PlacementTestPage />,
    isProtect: true,
  },
  {
    path: ROUTES.LEARNER.MATERIALS,
    element: <MaterialsPage />,
    isProtect: true,
    placementRequired: true,
  },
  {
    path: ROUTES.LEARNER.MATERIAL_DETAIL,
    element: <MaterialDetailPage />,
    isProtect: true,
    placementRequired: true,
  },
  {
    path: ROUTES.LEARNER.PROGRESS,
    element: <ProgressPage />,
    isProtect: true,
    placementRequired: true,
  },
  {
    path: ROUTES.LEARNER.LEVEL_UP,
    element: <LevelUpPage />,
    isProtect: true,
    placementRequired: true,
  },
  {
    path: ROUTES.LEARNER.PATH,
    element: <PathPage />,
    isProtect: true,
    placementRequired: true,
  },

  // ─── Admin routes ───
  {
    path: ROUTES.ADMIN.LOGIN,
    element: <AdminLoginPage />,
    isProtect: false,
  },
  {
    path: ROUTES.ADMIN.DASHBOARD,
    element: <AdminDashboardPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.USERS,
    element: <AdminUsersPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.MATERIALS,
    element: <AdminMaterialsPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.TESTS,
    element: <AdminTestsPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.PLACEMENT_TESTS,
    element: <AdminPlacementTestsPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.WORDS,
    element: <AdminWordsPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.SENTENCES,
    element: <AdminSentencesPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.TOPICS,
    element: <AdminTopicsPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.IRREGULAR_VERBS,
    element: <AdminIrregularVerbsPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.BLOG,
    element: <AdminBlogPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
  {
    path: ROUTES.ADMIN.ACTIVITY,
    element: <AdminActivityPage />,
    isProtect: true,
    requiredRole: 'admin',
  },
];

export const protectedRoutes = routes.filter((r) => r.isProtect);
export const publicRoutes = routes.filter((r) => !r.isProtect);
