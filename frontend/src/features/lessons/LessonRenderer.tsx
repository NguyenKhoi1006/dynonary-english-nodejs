import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

import LightbulbIcon from '@mui/icons-material/Lightbulb';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

// ─── Helpers ───

/** Render inline text: support **bold** segments */
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Box
            component="span"
            key={i}
            sx={{
              fontWeight: 700,
              color: '#2F3437',
              backgroundColor: '#F0EFEB',
              px: 0.6,
              py: 0.15,
              borderRadius: '4px',
              fontSize: 'inherit',
            }}
          >
            {part.slice(2, -2)}
          </Box>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Parse a line into segments with inline formatting */
function parseInline(line: string) {
  return <InlineText text={line} />;
}

// ─── Section types ───

type SectionType = 'form' | 'uses' | 'adverbs' | 'practice' | 'notes' | 'default';

function detectSectionType(heading: string): SectionType {
  const h = heading.toLowerCase();
  if (h.includes('form')) return 'form';
  if (h.includes('use') || h.includes('cách dùng')) return 'uses';
  if (h.includes('ever') || h.includes('never') || h.includes('just') || h.includes('already') || h.includes('yet')) return 'adverbs';
  if (h.includes('practice') || h.includes('thực hành') || h.includes('exercise')) return 'practice';
  if (h.includes('note') || h.includes('lưu ý')) return 'notes';
  return 'default';
}

interface Section {
  heading: string;
  type: SectionType;
  lines: string[];
}

function parseSections(content: string): Section[] {
  const lines = content.split('\n');
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      const heading = line.replace('## ', '').trim();
      current = { heading, type: detectSectionType(heading), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

/** Extract example sentences (lines starting with "- " or containing quotes) */
function extractExamples(lines: string[]): string[] {
  return lines
    .filter((l) => l.startsWith('- ') || l.startsWith('"') || l.startsWith('"'))
    .map((l) => l.replace(/^[-–—]\s*/, '').replace(/^[""]|[""]$/g, ''));
}

/** Extract practice questions */
function extractQuestions(lines: string[]): string[] {
  return lines
    .filter((l) => /^\d+[.．、]/.test(l))
    .map((l) => l.replace(/^\d+[.．、]\s*/, ''));
}

// ─── Sub-components ───

function FormSection({ lines }: { lines: string[] }) {
  const formula = lines.find((l) => l.includes('**')) || '';
  const examples = lines.filter((l) => l.startsWith('- '));

  return (
    <Box sx={{ mb: 2 }}>
      {/* Formula highlight */}
      <Box
        sx={{
          backgroundColor: '#F0EFEB',
          borderRadius: '8px',
          p: 2.5,
          mb: 2,
          textAlign: 'center',
          border: '1px solid #EAEAEA',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.6rem',
            color: '#2F3437',
            fontWeight: 600,
          }}
        >
          {parseInline(formula)}
        </Typography>
      </Box>

      {/* Examples */}
      <Stack spacing={1.5}>
        {examples.map((ex, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              p: 1.5,
              borderRadius: '6px',
              backgroundColor: '#FAFAF9',
              border: '1px solid #EAEAEA',
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#2F3437',
                mt: 0.6,
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" sx={{ color: '#2F3437', fontSize: '1.1rem', lineHeight: 1.7 }}>
              {parseInline(ex.replace(/^- /, ''))}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function UsesSection({ lines }: { lines: string[] }) {
  // Parse "1. **Title**: explanation" pattern
  const items: { title: string; desc: string }[] = [];
  let current: { title: string; desc: string } | null = null;

  for (const line of lines) {
    const match = line.match(/^\d+[.．、]\s*\*\*([^*]+)\*\*[：:](.*)/);
    if (match) {
      if (current) items.push(current);
      current = { title: match[1].trim(), desc: match[2].trim() };
    } else if (current && line.startsWith('- ')) {
      current.desc += '\n' + line;
    } else if (current && line.trim()) {
      current.desc += ' ' + line;
    }
  }
  if (current) items.push(current);

  if (items.length === 0) {
    // Fallback: just show lines with bold as items
    return <DefaultSection lines={lines} />;
  }

  return (
    <Stack spacing={1.5}>
      {items.map((item, i) => (
        <Card
          key={i}
          sx={{
            borderRadius: '8px',
            border: '1px solid #EAEAEA',
            boxShadow: 'none',
            backgroundColor: '#FFFFFF',
            '&:hover': { borderColor: '#DDDDDD' },
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Chip
                label={i + 1}
                size="small"
                sx={{
                  fontWeight: 700,
                  backgroundColor: '#2F3437',
                  color: '#FFFFFF',
                  minWidth: 26,
                  height: 26,
                  fontSize: '0.85rem',
                  mt: 0.1,
                }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2F3437', mb: 0.5, fontSize: '1.15rem' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#787774', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {item.desc.split('\n').map((d, j) => (
                    <React.Fragment key={j}>
                      {j > 0 && <br />}
                      {parseInline(d)}
                    </React.Fragment>
                  ))}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function AdverbsSection({ lines }: { lines: string[] }) {
  const adverbs: { word: string; example: string }[] = [];
  for (const line of lines) {
    const match = line.match(/^[-–]\s*\*\*(Ever|Never|Just|Already|Yet)\*\*(.+)/);
    if (match) {
      adverbs.push({ word: match[1], example: match[2].trim() });
    }
  }

  if (adverbs.length === 0) return <DefaultSection lines={lines} />;

  return (
    <Stack spacing={1.5}>
      {adverbs.map((adv) => (
        <Card
          key={adv.word}
          sx={{
            borderRadius: '8px',
            border: '1px solid #EAEAEA',
            boxShadow: 'none',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.15s',
            '&:hover': { borderColor: '#2F3437', backgroundColor: '#FAFAF9' },
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={adv.word}
                size="small"
                sx={{
                  fontWeight: 700,
                  backgroundColor: '#2F3437',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  minWidth: 64,
                }}
              />
              <Typography variant="body2" sx={{ color: '#787774', fontSize: '1.05rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                {adv.example}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function PracticeSection({ lines }: { lines: string[] }) {
  const questions = extractQuestions(lines);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  if (questions.length === 0) return <DefaultSection lines={lines} />;

  return (
    <Stack spacing={2}>
      {questions.map((q, idx) => (
        <Card
          key={idx}
          sx={{
            borderRadius: '8px',
            border: '1px solid #EAEAEA',
            boxShadow: 'none',
            backgroundColor: '#FFFFFF',
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
              <QuestionAnswerIcon sx={{ fontSize: 24, color: '#2F3437', mt: 0.2 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2F3437', fontSize: '1.1rem', lineHeight: 1.7 }}>
                {q}
              </Typography>
            </Stack>

            <TextField
              fullWidth
              size="small"
              placeholder="Viết câu trả lời của bạn..."
              value={answers[idx] || ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [idx]: e.target.value }))}
              sx={{
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  backgroundColor: '#FAFAF9',
                },
              }}
            />

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setRevealed((r) => ({ ...r, [idx]: !r[idx] }))}
                sx={{
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  borderColor: '#DDDDDD',
                  color: '#787774',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#2F3437', color: '#2F3437' },
                }}
              >
                {revealed[idx] ? 'Ẩn gợi ý' : 'Xem gợi ý'}
              </Button>
              {answers[idx]?.trim() && (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                  label="Đã trả lời"
                  size="small"
                  sx={{ backgroundColor: '#EDF3EC', color: '#346538', fontWeight: 600, fontSize: '0.85rem' }}
                />
              )}
            </Stack>

            <Collapse in={revealed[idx]}>
              <Box
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  backgroundColor: '#FBF3DB',
                  borderRadius: '6px',
                  border: '1px solid #F0E8C5',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <TipsAndUpdatesIcon sx={{ fontSize: 18, color: '#956400', mt: 0.1 }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#956400', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Gợi ý
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5E4A00', fontSize: '0.95rem', mt: 0.3, lineHeight: 1.6 }}>
                      Sử dụng cấu trúc: <strong>have/has + past participle</strong>. Ví dụ: "I have been to Japan." / "She has studied English for 2 years."
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function NotesSection({ lines }: { lines: string[] }) {
  const items = lines.filter((l) => l.trim());
  return (
    <Box sx={{ p: 2, backgroundColor: '#FBF3DB', borderRadius: '8px', border: '1px solid #F0E8C5' }}>
      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
        <TipsAndUpdatesIcon sx={{ fontSize: 24, color: '#956400' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#5E4A00', fontSize: '1.05rem' }}>
          Lưu ý
        </Typography>
      </Stack>
      <Stack spacing={1}>
        {items.map((line, i) => (
          <Typography key={i} variant="body2" sx={{ color: '#5E4A00', fontSize: '1rem', lineHeight: 1.7 }}>
            {parseInline(line)}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

function DefaultSection({ lines }: { lines: string[] }) {
  const items = lines.filter((l) => l.trim());
  if (items.length === 0) return null;

  return (
    <Stack spacing={1}>
      {items.map((line, i) => {
        if (line.startsWith('- ')) {
          return (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#BBBBBB', mt: 0.6, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#2F3437', fontSize: '1.05rem', lineHeight: 1.7 }}>
                {parseInline(line.replace(/^- /, ''))}
              </Typography>
            </Box>
          );
        }
        if (line.startsWith('*') && line.endsWith('*')) {
          return (
            <Typography key={i} variant="body2" sx={{ color: '#787774', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.7 }}>
              {parseInline(line.slice(1, -1))}
            </Typography>
          );
        }
        return (
          <Typography key={i} variant="body2" sx={{ color: '#2F3437', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {parseInline(line)}
          </Typography>
        );
      })}
    </Stack>
  );
}

// ─── Section icons ───

const SECTION_ICONS: Record<SectionType, React.ReactNode> = {
  form: <EditNoteIcon sx={{ fontSize: 28 }} />,
  uses: <ListAltIcon sx={{ fontSize: 28 }} />,
  adverbs: <LightbulbIcon sx={{ fontSize: 28 }} />,
  practice: <QuestionAnswerIcon sx={{ fontSize: 28 }} />,
  notes: <TipsAndUpdatesIcon sx={{ fontSize: 28 }} />,
  default: <MenuBookIcon sx={{ fontSize: 28 }} />,
};

const SECTION_TITLES: Record<SectionType, string> = {
  form: 'Công thức',
  uses: 'Cách dùng',
  adverbs: 'Trạng từ',
  practice: 'Thực hành',
  notes: 'Lưu ý',
  default: 'Nội dung',
};

// ─── Main component ───

interface LessonRendererProps {
  content: string;
}

export default function LessonRenderer({ content }: LessonRendererProps) {
  const sections = parseSections(content);

  if (sections.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: '#787774' }}>
        {content}
      </Typography>
    );
  }

  // Section ordering: form → uses → adverbs → notes → practice → default
  const typeOrder: SectionType[] = ['form', 'uses', 'adverbs', 'notes', 'practice', 'default'];
  const sorted = [...sections].sort(
    (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type),
  );

  return (
    <Stack spacing={2.5}>
      {sorted.map((section, si) => {
        const icon = SECTION_ICONS[section.type];
        const title = section.heading || SECTION_TITLES[section.type];

        return (
          <Card
            key={si}
            sx={{
              borderRadius: '8px',
              border: '1px solid #EAEAEA',
              boxShadow: 'none',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
            }}
          >
            {/* Section header */}
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: '1px solid #F0F0F0',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box sx={{ color: '#2F3437', display: 'flex' }}>{icon}</Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: '1.35rem',
                  color: '#2F3437',
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </Typography>
            </Box>

            {/* Section body */}
            <Box sx={{ p: 3 }}>
              {section.type === 'form' && <FormSection lines={section.lines} />}
              {section.type === 'uses' && <UsesSection lines={section.lines} />}
              {section.type === 'adverbs' && <AdverbsSection lines={section.lines} />}
              {section.type === 'practice' && <PracticeSection lines={section.lines} />}
              {section.type === 'notes' && <NotesSection lines={section.lines} />}
              {section.type === 'default' && <DefaultSection lines={section.lines} />}
            </Box>
          </Card>
        );
      })}
    </Stack>
  );
}
