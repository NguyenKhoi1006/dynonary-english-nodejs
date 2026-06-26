import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab,
} from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';
import Breadcrumbs from '../../components/Breadcrumbs';

const AdminWordsTab = React.lazy(() => import('./tabs/AdminWordsTab'));
const AdminSentencesTab = React.lazy(() => import('./tabs/AdminSentencesTab'));
const AdminTopicsTab = React.lazy(() => import('./tabs/AdminTopicsTab'));
const AdminIrregularVerbsTab = React.lazy(() => import('./tabs/AdminIrregularVerbsTab'));
const AdminBlogTab = React.lazy(() => import('./tabs/AdminBlogTab'));

const TABS = [
  { label: 'Từ vựng', component: AdminWordsTab },
  { label: 'Câu mẫu', component: AdminSentencesTab },
  { label: 'Chủ đề', component: AdminTopicsTab },
  { label: 'Động từ bất quy tắc', component: AdminIrregularVerbsTab },
  { label: 'Blog', component: AdminBlogTab },
];

export default function AdminContentPage() {
  const [tab, setTab] = useState(0);
  const ActiveComponent = TABS[tab].component;

  return (
    <DashboardLayout role="admin">
      <Box>
        <Breadcrumbs items={[{ label: 'Quản trị', path: '/admin' }, { label: 'Nội dung' }]} />
        <Typography variant="h4" sx={{ mb: 2 }}>Quản lý nội dung</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          {TABS.map((t, i) => <Tab key={i} label={t.label} />)}
        </Tabs>
        <React.Suspense fallback={<Typography>Đang tải...</Typography>}>
          <ActiveComponent />
        </React.Suspense>
      </Box>
    </DashboardLayout>
  );
}
