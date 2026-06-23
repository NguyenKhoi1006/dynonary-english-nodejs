"""
Shared constants for gamification features.
All XP values, time windows, and limits live here.
"""

# ─── XP rewards ───
XP_PER_LESSON_COMPLETE = 10
XP_PER_STREAK_BONUS = 5        # bonus per streak day cached
XP_PER_QUIZ_CORRECT = 15
XP_PER_DAILY_QUEST = 30
XP_PER_ACHIEVEMENT = 100
XP_PER_LEVEL_UP_BASE = 200

# ─── Streak ───
STREAK_FREEZE_HOURS = 24       # grace period before streak resets
STREAK_MILESTONES = [7, 30, 100, 365]  # streak achievement thresholds

# ─── Hearts / Lives ───
MAX_HEARTS = 5
HEART_RECHARGE_MINUTES = 30    # minutes per heart recharge
HEART_COST_WRONG_ANSWER = 1

# ─── Achievements ───
ACHIEVEMENT_DEFINITIONS = {
    "first_lesson": {
        "title": "First Steps",
        "description": "Complete your first lesson",
        "icon": "school",
        "xp_reward": 50,
    },
    "streak_7": {
        "title": "Week Warrior",
        "description": "7-day streak",
        "icon": "local_fire_department",
        "xp_reward": 100,
    },
    "streak_30": {
        "title": "Monthly Master",
        "description": "30-day streak",
        "icon": "local_fire_department",
        "xp_reward": 500,
    },
    "streak_100": {
        "title": "Century Flame",
        "description": "100-day streak",
        "icon": "whatshot",
        "xp_reward": 2000,
    },
    "lessons_10": {
        "title": "Dedicated Learner",
        "description": "Complete 10 lessons",
        "icon": "menu_book",
        "xp_reward": 100,
    },
    "lessons_50": {
        "title": "Knowledge Seeker",
        "description": "Complete 50 lessons",
        "icon": "menu_book",
        "xp_reward": 500,
    },
    "lessons_100": {
        "title": "Scholar",
        "description": "Complete 100 lessons",
        "icon": "auto_stories",
        "xp_reward": 1500,
    },
    "perfect_lesson": {
        "title": "Flawless",
        "description": "Complete a lesson with no mistakes",
        "icon": "stars",
        "xp_reward": 100,
    },
    "vocab_master": {
        "title": "Vocab Master",
        "description": "Learn 500 unique words",
        "icon": "translate",
        "xp_reward": 1000,
    },
    "level_5": {
        "title": "Rising Star",
        "description": "Reach level 5",
        "icon": "star",
        "xp_reward": 300,
    },
    "level_10": {
        "title": "Double Digits",
        "description": "Reach level 10",
        "icon": "star",
        "xp_reward": 800,
    },
    "level_25": {
        "title": "Legend",
        "description": "Reach level 25",
        "icon": "emoji_events",
        "xp_reward": 3000,
    },
}

# ─── Daily Quests ───
DAILY_QUEST_POOL = [
    {
        "id": "complete_3_lessons",
        "title": "Triple Threat",
        "description": "Complete 3 lessons",
        "target": 3,
        "type": "lessons_completed",
        "xp_reward": 30,
    },
    {
        "id": "earn_50_xp",
        "title": "XP Hunter",
        "description": "Earn 50 XP",
        "target": 50,
        "type": "xp_earned",
        "xp_reward": 30,
    },
    {
        "id": "perfect_lesson",
        "title": "Perfect Round",
        "description": "Complete a lesson without mistakes",
        "target": 1,
        "type": "perfect_lessons",
        "xp_reward": 40,
    },
    {
        "id": "learn_10_words",
        "title": "Word Collector",
        "description": "Learn 10 new words",
        "target": 10,
        "type": "words_learned",
        "xp_reward": 30,
    },
    {
        "id": "streak_maintain",
        "title": "Keep It Going",
        "description": "Maintain your streak today",
        "target": 1,
        "type": "streak_days",
        "xp_reward": 20,
    },
    {
        "id": "score_80_percent",
        "title": "Top Scorer",
        "description": "Score 80%+ on any quiz",
        "target": 1,
        "type": "high_scores",
        "xp_reward": 35,
    },
]

# ─── Skill Tree ───
SKILL_TREE_VERSION = 1

SKILL_UNITS = [
    {
        "id": "basics_1",
        "title": "Basics 1",
        "description": "Greetings and introductions",
        "position": {"row": 0, "col": 1},
    },
    {
        "id": "basics_2",
        "title": "Basics 2",
        "description": "Common phrases",
        "position": {"row": 1, "col": 0},
        "dependencies": ["basics_1"],
    },
    {
        "id": "food",
        "title": "Food & Drink",
        "description": "Ordering food and drinks",
        "position": {"row": 1, "col": 2},
        "dependencies": ["basics_1"],
    },
    {
        "id": "family",
        "title": "Family",
        "description": "Family members and relationships",
        "position": {"row": 2, "col": 0},
        "dependencies": ["basics_2"],
    },
    {
        "id": "numbers",
        "title": "Numbers",
        "description": "Counting and prices",
        "position": {"row": 2, "col": 1},
        "dependencies": ["basics_2", "food"],
    },
    {
        "id": "travel",
        "title": "Travel",
        "description": "Directions and transportation",
        "position": {"row": 2, "col": 2},
        "dependencies": ["food"],
    },
    {
        "id": "colors",
        "title": "Colors & Shapes",
        "description": "Describing things",
        "position": {"row": 3, "col": 0},
        "dependencies": ["family"],
    },
    {
        "id": "weather",
        "title": "Weather",
        "description": "Talking about the weather",
        "position": {"row": 3, "col": 1},
        "dependencies": ["numbers"],
    },
    {
        "id": "shopping",
        "title": "Shopping",
        "description": "Buying things",
        "position": {"row": 3, "col": 2},
        "dependencies": ["travel", "numbers"],
    },
    {
        "id": "time",
        "title": "Time & Dates",
        "description": "Telling time and making plans",
        "position": {"row": 4, "col": 1},
        "dependencies": ["colors", "weather", "shopping"],
    },
]
