import React from 'react';
import { Typography, Breadcrumbs as MuiBreadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NavigateNext as ChevronIcon } from '@mui/icons-material';

interface Crumb {
  label: string;
  path?: string;
}

interface Props {
  items: Crumb[];
}

export default function Breadcrumbs({ items }: Props) {
  const navigate = useNavigate();

  return (
    <MuiBreadcrumbs
      separator={<ChevronIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
      sx={{ mb: 2 }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return item.path && !isLast ? (
          <Link
            key={i}
            underline="hover"
            sx={{ cursor: 'pointer', fontSize: '0.8rem', color: 'text.secondary' }}
            onClick={() => navigate(item.path!)}
          >
            {item.label}
          </Link>
        ) : (
          <Typography
            key={i}
            variant="caption"
            sx={{ fontWeight: isLast ? 500 : 400, color: isLast ? 'text.primary' : 'text.secondary' }}
          >
            {item.label}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
}
