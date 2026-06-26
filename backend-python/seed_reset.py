"""
Reset Firestore database: DELETE ALL documents from every collection,
then re-seed admin user and demo data.

Usage:
    python seed_reset.py <admin_email> <admin_password> [admin_name]

WARNING: This will permanently delete ALL data in the "dynodata" Firestore database.
"""
import os
import sys
import uuid
from datetime import datetime, timezone

script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)
sys.path.insert(0, os.path.dirname(script_dir))

import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.config import settings

# ─── Parse args ───────────────────────────────────────────────────────

if len(sys.argv) < 3:
    print("Usage: python seed_reset.py <admin_email> <admin_password> [admin_name]")
    print()
    print("  admin_email    — Firebase Auth email for the admin account")
    print("  admin_password — Password for the admin account")
    print("  admin_name     — Display name (default: Admin)")
    sys.exit(1)

ADMIN_EMAIL = sys.argv[1]
ADMIN_PASSWORD = sys.argv[2]
ADMIN_NAME = sys.argv[3] if len(sys.argv) > 3 else "Admin"

# ─── Init Firebase ───────────────────────────────────────────────────

cert_path = os.path.join(script_dir, settings.firebase_credentials_path)
cred = credentials.Certificate(cert_path)
firebase_admin.initialize_app(cred)
db = firestore.client(database_id="dynodata")

print(f"Connected to Firestore (dynodata)")
print(f"{'='*60}")

# ═══════════════════════════════════════════════════════════════════════
# STEP 1: DELETE ALL COLLECTIONS
# ═══════════════════════════════════════════════════════════════════════

def delete_all_docs(collection_name, batch_size=500):
    """Delete every document in a collection (recursively handles subcollections)."""
    col_ref = db.collection(collection_name)
    docs = list(col_ref.limit(batch_size).stream())
    if not docs:
        return 0

    count = 0
    batch = db.batch()
    for doc in docs:
        # Delete subcollections first (recursively)
        subcollections = list(doc.reference.collections())
        for sub in subcollections:
            delete_all_docs(f"{collection_name}/{doc.id}/{sub.id}", batch_size)

        batch.delete(doc.reference)
        count += 1

        if count >= batch_size:
            batch.commit()
            print(f"    {collection_name}: deleted {count} docs...")
            remaining = list(col_ref.limit(batch_size).stream())
            if remaining:
                return count + delete_all_docs(collection_name, batch_size)
            break

    if count > 0 and count < batch_size:
        batch.commit()
        print(f"    {collection_name}: deleted {count} docs")

    return count


print("\n[STEP 1/3] Deleting ALL collections...")
collections = list(db.collections())
if not collections:
    print("  (no collections found — database is already empty)")
else:
    total = 0
    for col in collections:
        cid = col.id
        print(f"  Deleting '{cid}'...")
        deleted = delete_all_docs(cid)
        total += deleted
    print(f"\n  Deleted {total} document(s) from {len(collections)} collection(s)")

# ═══════════════════════════════════════════════════════════════════════
# STEP 2: CREATE ADMIN USER (Firebase Auth + Firestore)
# ═══════════════════════════════════════════════════════════════════════

print(f"\n[STEP 2/3] Creating admin user: {ADMIN_EMAIL}")

try:
    existing = auth.get_user_by_email(ADMIN_EMAIL)
    uid = existing.uid
    print(f"  User already exists in Auth: {uid}")
except firebase_admin.auth.UserNotFoundError:
    user = auth.create_user(
        email=ADMIN_EMAIL,
        password=ADMIN_PASSWORD,
        display_name=ADMIN_NAME,
    )
    uid = user.uid
    print(f"  Created Firebase Auth user: {uid}")

profile = {
    "email": ADMIN_EMAIL,
    "name": ADMIN_NAME,
    "username": ADMIN_NAME.lower().replace(" ", "."),
    "avt": "",
    "coin": 0,
    "favoriteList": [],
    "provider": "password",
    "role": "admin",
    "membership": "premium",
    "level": None,
    "status": "active",
    "xp": 0,
}

db.collection("users").document(uid).set(profile, merge=True)
print(f"  Firestore admin profile created/updated")

# ═══════════════════════════════════════════════════════════════════════
# STEP 3: SEED DEMO DATA
# ═══════════════════════════════════════════════════════════════════════

print(f"\n[STEP 3/3] Seeding demo data...")

# ─── Helpers ─────────────────────────────────────────────────────────

def q_id():
    return uuid.uuid4().hex[:8]

def ts():
    return firestore.SERVER_TIMESTAMP

# ─── Placement Test (50 questions, A1-C2) ─────────────────────────────

PLACEMENT_QUESTIONS = [
    # ── A1 (10 questions) ──
    {"id": q_id(), "questionText": "I _____ a student.", "options": ["am", "is", "are", "be"], "correctAnswer": 0, "type": "grammar", "level": "A1"},
    {"id": q_id(), "questionText": "She _____ from Japan.", "options": ["am", "is", "are", "be"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
    {"id": q_id(), "questionText": "What is this? — _____ a book.", "options": ["This is", "It is", "That is", "He is"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
    {"id": q_id(), "questionText": "Choose the correct word: I have a _____.", "options": ["car", "run", "beautiful", "quickly"], "correctAnswer": 0, "type": "vocabulary", "level": "A1"},
    {"id": q_id(), "questionText": "How many _____ do you have?", "options": ["pen", "pens", "penes", "pen's"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
    {"id": q_id(), "questionText": "The opposite of 'hot' is _____", "options": ["cold", "warm", "big", "small"], "correctAnswer": 0, "type": "vocabulary", "level": "A1"},
    {"id": q_id(), "questionText": "My brother _____ like coffee.", "options": ["don't", "doesn't", "isn't", "aren't"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
    {"id": q_id(), "questionText": "Tom _____ to school every day.", "options": ["go", "goes", "going", "went"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
    {"id": q_id(), "questionText": "Read: 'Anna is 10 years old. She has a cat.' How old is Anna?", "options": ["8", "9", "10", "11"], "correctAnswer": 2, "type": "reading", "level": "A1"},
    {"id": q_id(), "questionText": "Choose the correct answer: This is _____ apple.", "options": ["a", "an", "the", "no article"], "correctAnswer": 1, "type": "grammar", "level": "A1"},

    # ── A2 (10 questions) ──
    {"id": q_id(), "questionText": "She _____ to the gym twice a week.", "options": ["go", "goes", "going", "is going"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
    {"id": q_id(), "questionText": "Have you _____ been to Paris?", "options": ["ever", "never", "yet", "already"], "correctAnswer": 0, "type": "grammar", "level": "A2"},
    {"id": q_id(), "questionText": "I _____ breakfast at 7 AM yesterday.", "options": ["have", "had", "has", "having"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
    {"id": q_id(), "questionText": "The bag is _____ the table.", "options": ["in", "on", "at", "under"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
    {"id": q_id(), "questionText": "What does 'enormous' mean?", "options": ["small", "very big", "fast", "old"], "correctAnswer": 1, "type": "vocabulary", "level": "A2"},
    {"id": q_id(), "questionText": "She is _____ than her sister.", "options": ["tall", "taller", "tallest", "more tall"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
    {"id": q_id(), "questionText": "I like _____ books in my free time.", "options": ["read", "reading", "reads", "to reading"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
    {"id": q_id(), "questionText": "Choose the correct word: a _____ of bread.", "options": ["piece", "cup", "glass", "bottle"], "correctAnswer": 0, "type": "vocabulary", "level": "A2"},
    {"id": q_id(), "questionText": "Read: 'The supermarket opens at 8 AM and closes at 9 PM.' How long is it open?", "options": ["11 hours", "12 hours", "13 hours", "14 hours"], "correctAnswer": 2, "type": "reading", "level": "A2"},
    {"id": q_id(), "questionText": "We _____ go to the beach if it rains.", "options": ["will", "won't", "would", "don't"], "correctAnswer": 1, "type": "grammar", "level": "A2"},

    # ── B1 (10 questions) ──
    {"id": q_id(), "questionText": "If I _____ rich, I would travel the world.", "options": ["am", "was", "were", "will be"], "correctAnswer": 2, "type": "grammar", "level": "B1"},
    {"id": q_id(), "questionText": "The book _____ by a famous author.", "options": ["wrote", "was written", "is writing", "has written"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
    {"id": q_id(), "questionText": "I have been studying English _____ 3 years.", "options": ["since", "for", "from", "during"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
    {"id": q_id(), "questionText": "He said that he _____ come to the party.", "options": ["will", "would", "is", "can"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
    {"id": q_id(), "questionText": "What does 'essential' mean?", "options": ["optional", "necessary", "difficult", "expensive"], "correctAnswer": 1, "type": "vocabulary", "level": "B1"},
    {"id": q_id(), "questionText": "The movie was _____ boring that I fell asleep.", "options": ["so", "such", "too", "very"], "correctAnswer": 0, "type": "grammar", "level": "B1"},
    {"id": q_id(), "questionText": "Choose the correct phrase: I look forward _____ you.", "options": ["to meet", "to meeting", "meet", "meeting"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
    {"id": q_id(), "questionText": "The opposite of 'increase' is _____", "options": ["decrease", "expand", "grow", "raise"], "correctAnswer": 0, "type": "vocabulary", "level": "B1"},
    {"id": q_id(), "questionText": "Read: 'Despite the heavy rain, the match continued.' What does 'despite' mean?", "options": ["because of", "in spite of", "due to", "as a result of"], "correctAnswer": 1, "type": "reading", "level": "B1"},
    {"id": q_id(), "questionText": "They _____ each other for 10 years before they got married.", "options": ["knew", "had known", "have known", "were knowing"], "correctAnswer": 1, "type": "grammar", "level": "B1"},

    # ── B2 (10 questions) ──
    {"id": q_id(), "questionText": "The report _____ by Friday, or there will be consequences.", "options": ["must submit", "must be submitted", "must have submitted", "must submitting"], "correctAnswer": 1, "type": "grammar", "level": "B2"},
    {"id": q_id(), "questionText": "Had I known about the traffic, I _____ earlier.", "options": ["will leave", "would leave", "would have left", "left"], "correctAnswer": 2, "type": "grammar", "level": "B2"},
    {"id": q_id(), "questionText": "What does 'ambiguous' mean?", "options": ["clear", "open to interpretation", "angry", "ambitious"], "correctAnswer": 1, "type": "vocabulary", "level": "B2"},
    {"id": q_id(), "questionText": "She is the person _____ I admire the most.", "options": ["which", "whom", "who", "whose"], "correctAnswer": 2, "type": "grammar", "level": "B2"},
    {"id": q_id(), "questionText": "Not only _____ the exam, but she also got the highest score.", "options": ["she passed", "did she pass", "she did pass", "passed she"], "correctAnswer": 1, "type": "grammar", "level": "B2"},
    {"id": q_id(), "questionText": "His speech was so _____ that everyone was moved.", "options": ["convincing", "convinced", "convince", "convincingly"], "correctAnswer": 0, "type": "vocabulary", "level": "B2"},
    {"id": q_id(), "questionText": "The company _____ its profits for five consecutive years.", "options": ["has increased", "has been increasing", "increased", "had been increasing"], "correctAnswer": 1, "type": "grammar", "level": "B2"},
    {"id": q_id(), "questionText": "Choose the correct collocation: _____ a complaint.", "options": ["do", "make", "take", "have"], "correctAnswer": 1, "type": "vocabulary", "level": "B2"},
    {"id": q_id(), "questionText": "Read: 'The policy failed to address root causes.' What is the main criticism?", "options": ["Too expensive", "Didn't fix fundamental problems", "Poorly designed", "Unfair"], "correctAnswer": 1, "type": "reading", "level": "B2"},
    {"id": q_id(), "questionText": "I'd rather you _____ the truth earlier.", "options": ["tell", "told", "had told", "have told"], "correctAnswer": 2, "type": "grammar", "level": "B2"},

    # ── C1 (10 questions) ──
    {"id": q_id(), "questionText": "_____ his help, the project would have failed.", "options": ["But for", "In spite of", "Because of", "Apart from"], "correctAnswer": 0, "type": "grammar", "level": "C1"},
    {"id": q_id(), "questionText": "What does 'ubiquitous' mean?", "options": ["rare", "everywhere", "dangerous", "unknown"], "correctAnswer": 1, "type": "vocabulary", "level": "C1"},
    {"id": q_id(), "questionText": "Little _____ that the situation would escalate so quickly.", "options": ["we knew", "did we know", "we did know", "knew we"], "correctAnswer": 1, "type": "grammar", "level": "C1"},
    {"id": q_id(), "questionText": "The authorities are _____ the causes of the accident.", "options": ["looking into", "looking up", "looking after", "looking over"], "correctAnswer": 0, "type": "vocabulary", "level": "C1"},
    {"id": q_id(), "questionText": "It is imperative that every citizen _____ the law.", "options": ["obeys", "obey", "obeying", "obeyed"], "correctAnswer": 1, "type": "grammar", "level": "C1"},
    {"id": q_id(), "questionText": "Choose the most appropriate word: The research _____ significant findings.", "options": ["yielded", "gave", "produced", "created"], "correctAnswer": 0, "type": "vocabulary", "level": "C1"},
    {"id": q_id(), "questionText": "Were it not for the scholarship, she _____ unable to attend university.", "options": ["will be", "would be", "would have been", "is"], "correctAnswer": 1, "type": "grammar", "level": "C1"},
    {"id": q_id(), "questionText": "The word 'ephemeral' is closest in meaning to:", "options": ["permanent", "short-lived", "frequent", "intense"], "correctAnswer": 1, "type": "vocabulary", "level": "C1"},
    {"id": q_id(), "questionText": "Read: 'Cognitive development occurs in iterative cycles, each redefining previous stages.' What does this suggest?", "options": ["Simple linear process", "Repeating cycles reshaping earlier stages", "Only in childhood", "Cannot be measured"], "correctAnswer": 1, "type": "reading", "level": "C1"},
    {"id": q_id(), "questionText": "The board agreed the proposal was _____ of serious consideration.", "options": ["worthwhile", "worthy", "worth", "deserving"], "correctAnswer": 1, "type": "vocabulary", "level": "C1"},

    # ── C2 (10 questions) ──
    {"id": q_id(), "questionText": "What does 'pragmatic' mean?", "options": ["idealistic", "practical", "theoretical", "emotional"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "The author's _____ tone suggests deep disillusionment.", "options": ["sanguine", "sardonic", "serene", "sentimental"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "Not until the final paragraph does the writer _____ to her true purpose.", "options": ["allude", "elude", "refer", "infer"], "correctAnswer": 0, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "The approach has been _____, addressing issues piecemeal.", "options": ["comprehensive", "fragmented", "meticulous", "exhaustive"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "Had the committee _____ the implications more carefully...", "options": ["considered", "been considering", "have considered", "to consider"], "correctAnswer": 0, "type": "grammar", "level": "C2"},
    {"id": q_id(), "questionText": "The report was so _____ that even experts struggled.", "options": ["simplistic", "abstruse", "superficial", "lucid"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "Difference between 'continual' and 'continuous'?", "options": ["Synonyms", "Continual=recurring, Continuous=uninterrupted", "Opposite", "British vs American"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "Read: 'Non-linear narrative structure juxtaposes disparate temporal planes.' This means:", "options": ["Chronological order", "Jumps between time periods", "No plot", "Multiple simultaneous perspectives"], "correctAnswer": 1, "type": "reading", "level": "C2"},
    {"id": q_id(), "questionText": "The negotiations reached a _____ when neither side would compromise.", "options": ["deadlock", "breakthrough", "consensus", "settlement"], "correctAnswer": 0, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "Such _____ as the director showed earned him widespread respect.", "options": ["equanimity", "indifference", "apathy", "agitation"], "correctAnswer": 0, "type": "vocabulary", "level": "C2"},
]

test_id = "placement_v1"
test_doc = db.collection("placement_tests").document(test_id)
test_doc.set({
    "testId": test_id,
    "title": "English Level Placement Test",
    "description": "50-question placement test covering A1 to C2 levels",
    "questions": PLACEMENT_QUESTIONS,
    "levelDistribution": {"A1": 10, "A2": 10, "B1": 10, "B2": 10, "C1": 10, "C2": 10},
    "timeMinutes": 45,
    "published": True,
    "createdAt": ts(),
})
print("  ✓ Placement test: 50 questions (A1-C2)")

# ─── Learning Materials (24 items) ────────────────────────────────────

MATERIALS = [
    # ═══ A1 (4 lessons) ═══
    {
        "title": "Hello! Greetings and Introductions",
        "description": "Learn how to say hello, introduce yourself, and greet others in English.",
        "level": "A1", "type": "lesson", "order": 1, "estimatedMinutes": 15, "published": True, "isPremium": False,
        "tags": ["greetings", "introductions", "basic"],
        "previewContent": "Master everyday greetings and introductions in English.",
        "content": "# Hello! Greetings and Introductions\n\n## Common Greetings\n- **Hello** / Hi\n- **Good morning** (until 12 PM)\n- **Good afternoon** (12 PM - 6 PM)\n- **Good evening** (after 6 PM)\n\n## Introductions\n- My name is [name].\n- I am from [country/city].\n- Nice to meet you.\n\n## Example Dialog\n**Anna:** Hello! My name is Anna. What's your name?\n**Tom:** Hi Anna! I'm Tom. Nice to meet you.\n**Anna:** Nice to meet you too, Tom.\n\n## Key Vocabulary\n| Word | Meaning |\n|------|---------|\n| Hello | Xin chào |\n| Goodbye | Tạm biệt |\n| Name | Tên |\n| Friend | Bạn bè |",
    },
    {
        "title": "Numbers, Colours, and Everyday Objects",
        "description": "Learn numbers 1-100, basic colours, and common objects around you.",
        "level": "A1", "type": "lesson", "order": 2, "estimatedMinutes": 20, "published": True, "isPremium": False,
        "tags": ["numbers", "colours", "vocabulary"],
        "previewContent": "Build your core vocabulary with numbers, colours, and everyday objects.",
        "content": "# Numbers, Colours, and Everyday Objects\n\n## Numbers 1-20\n1 one · 2 two · 3 three · 4 four · 5 five\n6 six · 7 seven · 8 eight · 9 nine · 10 ten\n\n## Colours\nRed · Blue · Green · Yellow · Black · White · Orange · Purple · Pink · Brown\n\n## Everyday Objects\n- **book** - a thing you read\n- **table** - furniture with a flat top\n- **chair** - something to sit on\n- **phone** - you call people with it\n- **bag** - you carry things in it\n\n## Key Vocabulary\n| Word | Meaning |\n|------|---------|\n| Number | Số |\n| Colour | Màu sắc |\n| Big | To, lớn |\n| Small | Nhỏ |",
    },
    {
        "title": "My Family and Describing People",
        "description": "Learn family vocabulary and how to describe people's appearance and character.",
        "level": "A1", "type": "lesson", "order": 3, "estimatedMinutes": 20, "published": True, "isPremium": False,
        "tags": ["family", "descriptions", "people"],
        "previewContent": "Talk about your family and describe what people look like using simple adjectives.",
        "content": "# My Family and Describing People\n\n## Family Members\n- Mother / Mum · Father / Dad\n- Sister · Brother · Baby\n- Grandmother · Grandfather\n- Aunt · Uncle · Cousin\n\n## Describing Appearance\n- **Tall** / Short\n- **Young** / Old\n- **Long hair** / Short hair\n\n## Describing Character\n- **Kind** · **Funny** · **Quiet** · **Friendly**\n\n## Example\nMy mother is tall. She has long brown hair and blue eyes. She is kind.",
    },
    {
        "title": "Daily Routine: Time and Daily Activities",
        "description": "Talk about your daily routine using simple present tense and time expressions.",
        "level": "A1", "type": "lesson", "order": 4, "estimatedMinutes": 20, "published": True, "isPremium": False,
        "tags": ["daily routine", "time", "present simple"],
        "previewContent": "Learn to tell the time and describe your daily activities from morning to night.",
        "content": "# Daily Routine: Time and Daily Activities\n\n## Telling the Time\n- 7:00 → seven o'clock\n- 7:30 → half past seven\n\n## Daily Activities\n- **Wake up** · **Get up** · **Have breakfast**\n- **Go to school/work** · **Have lunch**\n- **Come home** · **Do homework**\n- **Have dinner** · **Watch TV** · **Go to bed**\n\n## Example\nI wake up at 6 o'clock. I have breakfast at 7 o'clock. I go to school at 8 o'clock.",
    },

    # ═══ A2 (4 lessons) ═══
    {
        "title": "Past Events: Talking About Yesterday",
        "description": "Learn to talk about past events using the simple past tense.",
        "level": "A2", "type": "lesson", "order": 5, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["past tense", "regular verbs", "irregular verbs"],
        "previewContent": "Master the simple past tense to talk about what happened yesterday, last week, or last year.",
        "content": "# Past Events: Talking About Yesterday\n\n## Regular Verbs (add -ed)\n- walk → walked · talk → talked\n- play → played · watch → watched\n\n## Common Irregular Verbs\n- go → went · eat → ate · have → had\n- see → saw · buy → bought · do → did\n\n## Time Expressions\n- **yesterday** · **last night** · **last week**\n- **two days ago** · **in 2020**\n\n## Example\nYesterday I went to the park. I played football with my friends.",
    },
    {
        "title": "Food, Restaurants, and Ordering",
        "description": "Learn food vocabulary and how to order meals at restaurants.",
        "level": "A2", "type": "lesson", "order": 6, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["food", "restaurant", "ordering"],
        "previewContent": "Build vocabulary for food and drinks, and practice ordering at a restaurant.",
        "content": "# Food, Restaurants, and Ordering\n\n## Food Categories\n- **Fruit**: apple, banana, orange, grapes\n- **Vegetables**: carrot, tomato, potato, onion\n- **Meat**: chicken, beef, pork, fish\n- **Drinks**: water, juice, coffee, tea, milk\n\n## Restaurant Phrases\n- \"I'd like to order, please.\"\n- \"What would you recommend?\"\n- \"Can I have the bill, please?\"\n\n## Example Dialog\n**Waiter:** Are you ready to order?\n**You:** Yes, I'd like the chicken salad, please.\n**Waiter:** Anything to drink?\n**You:** A glass of orange juice, please.",
    },
    {
        "title": "Travel and Directions",
        "description": "Learn how to talk about travel, ask for directions, and describe places.",
        "level": "A2", "type": "lesson", "order": 7, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["travel", "directions", "places"],
        "previewContent": "Navigate confidently in English: ask for and give directions, talk about travel experiences.",
        "content": "# Travel and Directions\n\n## Asking for Directions\n- \"Excuse me, where is the station?\"\n- \"How do I get to the museum?\"\n- \"Is it far from here?\"\n\n## Giving Directions\n- Turn left / right\n- Go straight ahead\n- It's on the corner / next to the bank\n\n## Places in Town\n- Supermarket · Bank · Hospital · Museum\n- Train station · Bus stop · Airport · Hotel\n- Park · Library · Pharmacy · Restaurant",
    },
    {
        "title": "Comparisons and Superlatives",
        "description": "Learn to compare things using comparative and superlative adjectives.",
        "level": "A2", "type": "lesson", "order": 8, "estimatedMinutes": 20, "published": True, "isPremium": False,
        "tags": ["comparatives", "superlatives", "grammar"],
        "previewContent": "Compare people, places, and things using comparative and superlative forms.",
        "content": "# Comparisons and Superlatives\n\n## Comparative (comparing two)\n- Short: adj + -er → taller, faster\n- Long: more + adj → more expensive\n- Irregular: good → better, bad → worse\n\n## Superlative (one in a group)\n- Short: the + adj + -est → the tallest\n- Long: the most + adj → the most expensive\n- Irregular: good → the best, bad → the worst\n\n## Examples\n- My house is **bigger than** yours.\n- She is **the tallest** girl in the class.\n- It's **the best** restaurant in the city.",
    },

    # ═══ B1 (4 lessons) ═══
    {
        "title": "Present Perfect: Life Experiences",
        "description": "Master the present perfect tense to talk about experiences and achievements.",
        "level": "B1", "type": "lesson", "order": 9, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["present perfect", "experiences", "grammar"],
        "previewContent": "Use the present perfect tense to discuss life experiences, achievements, and past events.",
        "content": "# Present Perfect: Life Experiences\n\n## Form\n**Subject + have/has + past participle**\n\n- I **have visited** London.\n- She **has studied** English for 5 years.\n\n## Uses\n1. Life experiences: \"I have travelled to 10 countries.\"\n2. Changes over time: \"Your English has improved.\"\n3. Unfinished actions: \"I have lived here since 2020.\"\n\n## Ever / Never / Just / Already / Yet\n- Have you **ever** seen a ghost?\n- I have **never** tried sushi.\n- She has **already** finished.",
    },
    {
        "title": "Conditionals: If Sentences",
        "description": "Learn zero, first, and second conditional sentences for real and hypothetical situations.",
        "level": "B1", "type": "lesson", "order": 10, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["conditionals", "if sentences", "grammar"],
        "previewContent": "Express conditions and results using zero, first, and second conditional structures.",
        "content": "# Conditionals: If Sentences\n\n## Zero Conditional (General truths)\n**If + present simple, present simple**\n- If you heat water to 100°C, it boils.\n\n## First Conditional (Real future)\n**If + present simple, will + verb**\n- If it rains, I will stay home.\n\n## Second Conditional (Unreal present)\n**If + past simple, would + verb**\n- If I had a million dollars, I would travel the world.",
    },
    {
        "title": "Giving Opinions and Debating",
        "description": "Learn to express opinions, agree, disagree, and participate in discussions.",
        "level": "B1", "type": "lesson", "order": 11, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["opinions", "discussion", "speaking"],
        "previewContent": "Express and defend your opinions in English. Learn polite ways to agree and disagree.",
        "content": "# Giving Opinions and Debating\n\n## Expressing Opinions\n- \"In my opinion, ...\"\n- \"I believe that ...\"\n- \"As far as I'm concerned, ...\"\n\n## Agreeing\n- \"I agree with you.\"\n- \"That's a good point.\"\n\n## Disagreeing Politely\n- \"I see your point, but ...\"\n- \"I'm not sure I agree.\"\n\n## Practice Topic\nShould students wear school uniforms? State your opinion with two reasons.",
    },
    {
        "title": "Narrative Tenses: Telling Stories",
        "description": "Combine past tenses to tell engaging stories and anecdotes.",
        "level": "B1", "type": "lesson", "order": 12, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["narrative", "past tenses", "storytelling"],
        "previewContent": "Tell compelling stories using past simple, past continuous, and past perfect together.",
        "content": "# Narrative Tenses: Telling Stories\n\n## Past Simple (completed actions)\n- \"I woke up, had breakfast, and left.\"\n\n## Past Continuous (background)\n- \"I was walking home when I saw an accident.\"\n\n## Past Perfect (before another past action)\n- \"When I arrived, the movie had already started.\"\n\n## Example Story\n\"Last summer, I was travelling in Vietnam. While I was exploring a market, I met an old friend!\"",
    },
]

# Create materials
for m in MATERIALS:
    doc_id = f"material_{m['level'].lower()}_{m['order']}"
    m["createdAt"] = ts()
    m["updatedAt"] = ts()
    db.collection("learning_materials").document(doc_id).set(m)

print(f"  ✓ Learning materials: {len(MATERIALS)} lessons (A1-B1)")

# ─── Level Tests ──────────────────────────────────────────────────────

LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]
for level in LEVELS:
    level_questions = [q for q in PLACEMENT_QUESTIONS if q["level"] == level]
    # Take first 5 per level
    test_questions = level_questions[:5]
    db.collection("tests").document(f"test_{level}").set({
        "testId": f"test_{level}",
        "title": f"{level} Level Assessment",
        "level": level,
        "questions": test_questions,
        "passScore": 3,
        "timeMinutes": 15,
        "published": True,
        "createdAt": ts(),
    })

print(f"  ✓ Level tests: {len(LEVELS)} tests (5 questions each)")

# ─── Summary ──────────────────────────────────────────────────────────

print(f"\n{'='*60}")
print("RESET COMPLETE!")
print(f"{'='*60}")
print(f"  Admin email:     {ADMIN_EMAIL}")
print(f"  Admin password:  {ADMIN_PASSWORD}")
print(f"  Admin name:      {ADMIN_NAME}")
print()
print("  Seeded data:")
print(f"    - 1 admin user (Firebase Auth + Firestore)")
print(f"    - 1 placement test (50 questions)")
print(f"    - {len(MATERIALS)} learning materials")
print(f"    - 6 level tests (5 questions each)")
print()
print("  Login via the regular login page.")
print(f"{'='*60}")
