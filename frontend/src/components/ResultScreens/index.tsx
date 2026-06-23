import React from 'react';
import useStyle from './style';

/* ── Types of result screens ── */
export type ResultType = 'lesson_complete' | 'level_up' | 'achievement';

interface AchievementData {
  title: string;
  description: string;
  icon: string;
  xpReward?: number;
}

interface ResultScreensProps {
  type: ResultType;
  /* lesson_complete */
  score?: number;
  total?: number;
  xpEarned?: number;
  perfect?: boolean;
  /* level_up */
  newLevel?: number;
  /* achievement */
  achievement?: AchievementData;
  /* callbacks */
  onContinue?: () => void;
  onRetry?: () => void;
  onClose?: () => void;
}

/**
 * Reusable result screen that adapts to lesson complete, level-up,
 * and achievement unlocked flows.
 */
function ResultScreens({
  type,
  score,
  total,
  xpEarned,
  perfect,
  newLevel,
  achievement,
  onContinue,
  onRetry,
  onClose,
}: ResultScreensProps) {
  const classes = useStyle();

  /* ── Lesson Complete ── */
  if (type === 'lesson_complete') {
    const pct = total && total > 0 ? Math.round(((score ?? 0) / total) * 100) : 0;
    const isPerfect = perfect || pct >= 100;
    const passed = pct >= 60;

    return (
      <div className={classes.overlay}>
        <div className={classes.card}>
          <div className={classes.emoji}>{isPerfect ? '★' : passed ? '◆' : '▲'}</div>
          <div className={classes.title}>
            {isPerfect ? 'Hoàn hảo!' : passed ? 'Xuất sắc!' : 'Cố gắng thêm!'}
          </div>
          <div className={classes.subtitle}>
            {isPerfect
              ? 'Bạn trả lời đúng tất cả câu hỏi!'
              : passed
              ? `Bạn đạt ${pct}% — rất tốt!`
              : `Bạn đạt ${pct}% — hãy thử lại để cải thiện.`}
          </div>

          <div className={classes.scoreRing}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e5e5" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={passed ? 'var(--primary-color)' : 'var(--xp-color)'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${pct * 2.64} 264`}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
              <text x="50" y="52" textAnchor="middle" dominantBaseline="middle"
                fontSize="22" fontWeight="800" fill="var(--text-color)">
                {score}/{total}
              </text>
            </svg>
          </div>

          {xpEarned != null && (
            <div className={classes.xpRow}>
              <span className={classes.xpBadge}>+{xpEarned} XP</span>
            </div>
          )}

          <div className={classes.actions}>
            {passed ? (
              <button className={classes.btnPrimary} onClick={onContinue}>
                Tiếp tục
              </button>
            ) : (
              <>
                <button className={classes.btnPrimary} onClick={onRetry}>
                  Thử lại
                </button>
                <button className={classes.btnOutline} onClick={onContinue}>
                  Bỏ qua
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Level Up ── */
  if (type === 'level_up') {
    return (
      <div className={classes.overlay}>
        <div className={`${classes.card} ${classes.levelUpCard}`}>
          <div className={classes.levelUpSparkles}>✦ LEVEL UP ✦</div>
          <div className={classes.title}>Level Up!</div>
          <div className={classes.levelNumber}>{newLevel}</div>
          <div className={classes.subtitle}>Chúc mừng bạn đã lên cấp độ mới!</div>

          {xpEarned != null && (
            <div className={classes.xpRow}>
              <span className={classes.xpBadge}>+{xpEarned} XP</span>
            </div>
          )}

          <div className={classes.actions}>
            <button className={classes.btnPrimary} onClick={onClose}>
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Achievement Unlocked ── */
  if (type === 'achievement' && achievement) {
    return (
      <div className={classes.overlay}>
        <div className={classes.card}>
          <div className={classes.achievementIcon}>{achievement.icon}</div>
          <div className={classes.achievementLabel}>Thành tựu mới!</div>
          <div className={classes.title}>{achievement.title}</div>
          <div className={classes.subtitle}>{achievement.description}</div>

          {achievement.xpReward && (
            <div className={classes.xpRow}>
              <span className={classes.xpBadge}>+{achievement.xpReward} XP</span>
            </div>
          )}

          <div className={classes.actions}>
            <button className={classes.btnPrimary} onClick={onClose}>
              Tuyệt!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default ResultScreens;
