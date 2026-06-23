import React, { useState } from 'react';
import useStyle from './style';

interface SkillNode {
  id: string;
  title: string;
  description: string;
  position: { row: number; col: number };
  dependencies: string[];
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
  totalLessons: number;
  lessonsCompleted: number;
}

interface SkillTreeProps {
  nodes: SkillNode[];
  onNodeClick: (nodeId: string) => void;
}

/* ── Position map: convert row/col to CSS grid coordinates ── */
const ROW_GAPS = [0, 1, 0, 1, 0];  // zig-zag offset for each row

function SkillTree({ nodes, onNodeClick }: SkillTreeProps) {
  const classes = useStyle();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  /* Find max row/col for grid sizing */
  const maxRow = Math.max(...nodes.map((n) => n.position.row), 0);

  return (
    <div className={classes.root}>
      {/* Connecting lines (drawn behind nodes) */}
      <svg className={classes.linesSvg} viewBox={`0 0 100 ${(maxRow + 1) * 25}`}>
        {nodes.map((node) =>
          node.dependencies.map((depId) => {
            const dep = nodes.find((n) => n.id === depId);
            const from = dep?.position;
            const to = node.position;
            if (!from) return null;
            return (
              <line
                key={`${depId}-${node.id}`}
                x1={`${from.col * 33 + 16}`}
                y1={`${from.row * 25 + 12}`}
                x2={`${to.col * 33 + 16}`}
                y2={`${to.row * 25 + 8}`}
                className={`${classes.line} ${
                  dep?.status === 'completed' || node.status !== 'locked' ? classes.lineActive : ''
                }`}
              />
            );
          })
        )}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const isLocked = node.status === 'locked';
        const isAvailable = node.status === 'available';
        const isInProgress = node.status === 'in_progress';
        const isCompleted = node.status === 'completed';
        const progress = node.totalLessons > 0
          ? Math.round((node.lessonsCompleted / node.totalLessons) * 100)
          : 0;

        return (
          <div
            key={node.id}
            className={`${classes.node} ${
              isLocked ? classes.nodeLocked : ''
            } ${isAvailable ? classes.nodeAvailable : ''} ${
              isInProgress ? classes.nodeInProgress : ''
            } ${isCompleted ? classes.nodeCompleted : ''}`}
            style={{
              left: `${node.position.col * 33 + 1}%`,
              top: `${node.position.row * 25 + 2}rem`,
            }}
            onClick={() => !isLocked && onNodeClick(node.id)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Status icon */}
            <div className={classes.nodeIcon}>
              {isCompleted ? (
                <span className={classes.checkMark}>✓</span>
              ) : isLocked ? (
                <span className={classes.lockIcon}>🔒</span>
              ) : (
                <span className={classes.lessonIcon}>
                  {node.title.charAt(0)}
                </span>
              )}
            </div>

            {/* Title */}
            <div className={classes.nodeTitle}>{node.title}</div>

            {/* Progress ring for in_progress */}
            {isInProgress && (
              <div className={classes.progressRing}>
                <div
                  className={classes.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Hover tooltip */}
            {hoveredNode === node.id && (
              <div className={classes.tooltip}>
                <div className={classes.tooltipTitle}>{node.title}</div>
                <div className={classes.tooltipDesc}>{node.description}</div>
                {isInProgress && (
                  <div className={classes.tooltipProgress}>
                    {node.lessonsCompleted} / {node.totalLessons} lessons
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SkillTree;
