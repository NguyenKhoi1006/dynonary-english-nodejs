# User constants
MAX_USER_COIN = 100000
MAX_FAVORITES_LEN = 100
MAX_USERNAME_LEN = 50
MAX_NAME_LEN = 50
VERIFY_CODE_LEN = 6

# Word constants
NUM_OF_SPECIALTY = 7
NUM_OF_TOPICS = 17

WORD_TYPES = ["", "n", "adj", "adv", "v", "con", "pre", "pro", "det"]
WORD_LEVELS = ["0", "A1", "A2", "B1", "B2", "C1", "C2"]

# Game types
GAME_TYPES = ["correct-word", "fast-game", "word-match"]
LEADERBOARD_TYPES = ["top_coin", "correct_game_right", "correct_game_right_consecutive", "fast_game"]

# Pagination
DEFAULT_PER_PAGE = 20
MAX_PER_PAGE = 100

# Cloudinary folders
CLOUDINARY_FOLDER = "dynonary"
AVATAR_FOLDER = f"{CLOUDINARY_FOLDER}/user-avt"
