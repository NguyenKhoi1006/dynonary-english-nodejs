"""
Seed demo data: placement test, learning materials, and level tests.
Inserts directly into Firestore collections.

Usage: python seed_demo_data.py
"""
import uuid
from datetime import datetime, timezone
import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings

cred = credentials.Certificate(settings.firebase_credentials_path)
firebase_admin.initialize_app(cred)
db = firestore.client(database_id="dynodata")

# ─── HELPERS ──────────────────────────────────────────────────────────

def q_id():
    return uuid.uuid4().hex[:8]

def ts():
    return firestore.SERVER_TIMESTAMP

# ─── PLACEMENT TEST DATA ─────────────────────────────────────────────

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
    {"id": q_id(), "questionText": "Read: 'Despite the heavy rain, the match continued. The referee decided the field was still playable.' What does 'despite' mean?", "options": ["because of", "in spite of", "due to", "as a result of"], "correctAnswer": 1, "type": "reading", "level": "B1"},
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
    {"id": q_id(), "questionText": "Read: 'The government's policy, while well-intentioned, failed to address the root causes of income inequality. Economists argue that structural reforms are needed rather than temporary relief measures.' What is the writer's main criticism?", "options": ["The policy was too expensive", "The policy didn't fix fundamental problems", "The policy was poorly designed", "The policy was unfair"], "correctAnswer": 1, "type": "reading", "level": "B2"},
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
    {"id": q_id(), "questionText": "Read: 'The study challenges the prevailing paradigm by suggesting that cognitive development is not strictly linear but rather occurs in iterative cycles, each building upon and redefining previous stages.' What does the study suggest about cognitive development?", "options": ["It is a simple linear process", "It happens in repeating cycles that reshape earlier stages", "It only happens in childhood", "It cannot be measured"], "correctAnswer": 1, "type": "reading", "level": "C1"},
    {"id": q_id(), "questionText": "The board unanimously agreed that the proposal was _____ of serious consideration.", "options": ["worthwhile", "worthy", "worth", "deserving"], "correctAnswer": 1, "type": "vocabulary", "level": "C1"},

    # ── C2 (10 questions) ──
    {"id": q_id(), "questionText": "What does 'pragmatic' mean?", "options": ["idealistic", "practical", "theoretical", "emotional"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "The author's _____ tone suggests a deep disillusionment with modern society.", "options": ["sanguine", "sardonic", "serene", "sentimental"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "Not until the final paragraph does the writer _____ to her true purpose.", "options": ["allude", "elude", "refer", "infer"], "correctAnswer": 0, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "The government's approach to reform has been _____, addressing issues piecemeal rather than systematically.", "options": ["comprehensive", "fragmented", "meticulous", "exhaustive"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "Had the committee _____ the implications more carefully, they would have rejected the proposal.", "options": ["considered", "been considering", "have considered", "to consider"], "correctAnswer": 0, "type": "grammar", "level": "C2"},
    {"id": q_id(), "questionText": "The report was so _____ that even experts struggled to understand it.", "options": ["simplistic", "abstruse", "superficial", "lucid"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "What is the difference between 'continual' and 'continuous'?", "options": ["They are synonyms with no difference", "Continual means recurring; continuous means without interruption", "Continuous means recurring; continual means without interruption", "Continual is British; continuous is American"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "Read: 'The film's narrative structure is deliberately non-linear, juxtaposing disparate temporal planes to underscore the protagonist's fractured psyche. This technique, while disorienting, ultimately serves to immerse the viewer in the subjective experience of memory loss.' The phrase 'non-linear narrative structure' suggests that:", "options": ["The story is told in chronological order", "The story jumps between different time periods", "The film has no plot", "The story is told from multiple perspectives simultaneously"], "correctAnswer": 1, "type": "reading", "level": "C2"},
    {"id": q_id(), "questionText": "Choose the correct word: The negotiations reached a _____ when neither side would compromise.", "options": ["deadlock", "breakthrough", "consensus", "settlement"], "correctAnswer": 0, "type": "vocabulary", "level": "C2"},
    {"id": q_id(), "questionText": "Such _____ as the director showed in handling the crisis earned him widespread respect.", "options": ["equanimity", "indifference", "apathy", "agitation"], "correctAnswer": 0, "type": "vocabulary", "level": "C2"},
]

# ─── LEARNING MATERIALS DATA ─────────────────────────────────────────

MATERIALS = [
    # ═══ A1 (4 lessons) ═══
    {
        "title": "Hello! Greetings and Introductions",
        "description": "Learn how to say hello, introduce yourself, and greet others in English.",
        "level": "A1", "type": "lesson", "order": 1, "estimatedMinutes": 15, "published": True, "isPremium": False,
        "tags": ["greetings", "introductions", "basic"],
        "previewContent": "Master everyday greetings and introductions in English. Learn to say 'Hello', 'Goodbye', 'My name is...', and 'Nice to meet you'.",
        "content": """# Hello! Greetings and Introductions

## Common Greetings
- **Hello** / Hi
- **Good morning** (until 12 PM)
- **Good afternoon** (12 PM - 6 PM)
- **Good evening** (after 6 PM)

## Introductions
- My name is [name].
- I am from [country/city].
- Nice to meet you.

## Example Dialog
**Anna:** Hello! My name is Anna. What's your name?
**Tom:** Hi Anna! I'm Tom. Nice to meet you.
**Anna:** Nice to meet you too, Tom.

## Practice
Complete the sentences:
1. "Good _____!" (say this in the morning)
2. "My _____ is John."
3. "Nice to _____ you."

## Key Vocabulary
| Word | Meaning |
|------|---------|
| Hello | Xin chào |
| Goodbye | Tạm biệt |
| Name | Tên |
| Friend | Bạn bè |
"""
    },
    {
        "title": "Numbers, Colours, and Everyday Objects",
        "description": "Learn numbers 1-100, basic colours, and common objects around you.",
        "level": "A1", "type": "lesson", "order": 2, "estimatedMinutes": 20, "published": True, "isPremium": False,
        "tags": ["numbers", "colours", "vocabulary"],
        "previewContent": "Build your core vocabulary with numbers, colours, and everyday objects you see around you.",
        "content": """# Numbers, Colours, and Everyday Objects

## Numbers 1-20
1 one · 2 two · 3 three · 4 four · 5 five
6 six · 7 seven · 8 eight · 9 nine · 10 ten
11 eleven · 12 twelve · 13 thirteen · 14 fourteen · 15 fifteen
16 sixteen · 17 seventeen · 18 eighteen · 19 nineteen · 20 twenty

## Colours
Red · Blue · Green · Yellow · Black · White · Orange · Purple · Pink · Brown

## Everyday Objects
- **book** - a thing you read
- **table** - furniture with a flat top
- **chair** - something to sit on
- **phone** - you call people with it
- **bag** - you carry things in it

## Practice
1. What colour is the sky? → Blue
2. How many chairs are in your room?
3. I have a red _____ (book/bag).

## Key Vocabulary
| Word | Meaning |
|------|---------|
| Number | Số |
| Colour | Màu sắc |
| Big | To, lớn |
| Small | Nhỏ |
"""
    },
    {
        "title": "My Family and Describing People",
        "description": "Learn family vocabulary and how to describe people's appearance and character.",
        "level": "A1", "type": "lesson", "order": 3, "estimatedMinutes": 20, "published": True, "isPremium": False,
        "tags": ["family", "descriptions", "people"],
        "previewContent": "Talk about your family and describe what people look like using simple adjectives.",
        "content": """# My Family and Describing People

## Family Members
- Mother / Mum · Father / Dad
- Sister · Brother · Baby
- Grandmother · Grandfather
- Aunt · Uncle · Cousin

## Describing Appearance
- **Tall** / Short
- **Young** / Old
- **Long hair** / Short hair
- **Blue eyes** / Brown eyes

## Describing Character
- **Kind** · **Funny** · **Quiet** · **Friendly**

## Example
My mother is tall. She has long brown hair and blue eyes. She is kind.

## Practice
Describe a member of your family:
- My _____ is _____.
- He/She has _____ hair.
- He/She is _____ (kind/funny/quiet).
"""
    },
    {
        "title": "Daily Routine: Time and Daily Activities",
        "description": "Talk about your daily routine using simple present tense and time expressions.",
        "level": "A1", "type": "lesson", "order": 4, "estimatedMinutes": 20, "published": True, "isPremium": False,
        "tags": ["daily routine", "time", "present simple"],
        "previewContent": "Learn to tell the time and describe your daily activities from morning to night.",
        "content": """# Daily Routine: Time and Daily Activities

## Telling the Time
- 7:00 → seven o'clock
- 7:15 → quarter past seven
- 7:30 → half past seven
- 7:45 → quarter to eight

## Daily Activities
- **Wake up** · **Get up** · **Have breakfast**
- **Go to school/work** · **Have lunch**
- **Come home** · **Do homework**
- **Have dinner** · **Watch TV** · **Go to bed**

## Example
I wake up at 6 o'clock. I have breakfast at 7 o'clock. I go to school at 8 o'clock. I come home at 4 o'clock. I go to bed at 10 o'clock.

## Practice
Write your daily routine:
1. I wake up at _____.
2. I _____ at 7 o'clock.
3. I go to _____ at 8 o'clock.
4. I _____ at 10 o'clock.
"""
    },

    # ═══ A2 (4 lessons) ═══
    {
        "title": "Past Events: Talking About Yesterday",
        "description": "Learn to talk about past events using the simple past tense.",
        "level": "A2", "type": "lesson", "order": 5, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["past tense", "regular verbs", "irregular verbs"],
        "previewContent": "Master the simple past tense to talk about what happened yesterday, last week, or last year.",
        "content": """# Past Events: Talking About Yesterday

## Regular Verbs (add -ed)
- walk → walked · talk → talked
- play → played · watch → watched
- study → studied · stop → stopped

## Common Irregular Verbs
- go → went · eat → ate · have → had
- see → saw · buy → bought · do → did
- get → got · make → made · say → said

## Time Expressions
- **yesterday** · **last night** · **last week**
- **two days ago** · **in 2020** · **when I was young**

## Example
Yesterday I went to the park. I played football with my friends. We had lunch together. Then I went home and watched TV.

## Practice
Change to past tense:
1. I go to school. → I _____ to school.
2. She eats an apple. → She _____ an apple.
3. They watch a movie. → They _____ a movie.
"""
    },
    {
        "title": "Food, Restaurants, and Ordering",
        "description": "Learn food vocabulary and how to order meals at restaurants.",
        "level": "A2", "type": "lesson", "order": 6, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["food", "restaurant", "ordering"],
        "previewContent": "Build vocabulary for food and drinks, and practice ordering at a restaurant with confidence.",
        "content": """# Food, Restaurants, and Ordering

## Food Categories
- **Fruit**: apple, banana, orange, grapes
- **Vegetables**: carrot, tomato, potato, onion
- **Meat**: chicken, beef, pork, fish
- **Drinks**: water, juice, coffee, tea, milk

## Restaurant Phrases
- "I'd like to order, please."
- "What would you recommend?"
- "Could I have the menu, please?"
- "Can I have the bill, please?"

## Example Dialog
**Waiter:** Are you ready to order?
**You:** Yes, I'd like the chicken salad, please.
**Waiter:** Anything to drink?
**You:** A glass of orange juice, please.
**Waiter:** Certainly. I'll bring it right away.

## Practice
Write a dialogue ordering food at a restaurant. Include:
- Greeting the waiter
- Ordering a main dish
- Ordering a drink
- Asking for the bill
"""
    },
    {
        "title": "Travel and Directions",
        "description": "Learn how to talk about travel, ask for directions, and describe places.",
        "level": "A2", "type": "lesson", "order": 7, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["travel", "directions", "places"],
        "previewContent": "Navigate confidently in English: ask for and give directions, talk about travel experiences.",
        "content": """# Travel and Directions

## Asking for Directions
- "Excuse me, where is the station?"
- "How do I get to the museum?"
- "Is it far from here?"
- "Which bus goes to the airport?"

## Giving Directions
- Turn left / right
- Go straight ahead
- It's on the corner / next to the bank
- Take the first / second street

## Places in Town
- Supermarket · Bank · Hospital · Museum
- Train station · Bus stop · Airport · Hotel
- Park · Library · Pharmacy · Restaurant

## Travel Vocabulary
- **Ticket** · **Passport** · **Luggage**
- **Departure** · **Arrival** · **Platform**

## Practice
Write directions from your house to the nearest supermarket:
1. Go _____.
2. Turn _____ at the traffic lights.
3. It's _____ the bank.
"""
    },
    {
        "title": "Comparisons and Superlatives",
        "description": "Learn to compare things using comparative and superlative adjectives.",
        "level": "A2", "type": "lesson", "order": 8, "estimatedMinutes": 20, "published": True, "isPremium": False,
        "tags": ["comparatives", "superlatives", "grammar"],
        "previewContent": "Compare people, places, and things using comparative and superlative forms.",
        "content": """# Comparisons and Superlatives

## Comparative Adjectives (comparing two things)
- **Short adjectives**: adjective + -er → taller, faster, bigger
- **Long adjectives**: more + adjective → more expensive, more beautiful
- **Irregular**: good → better, bad → worse, far → further

## Superlative Adjectives (one thing in a group)
- **Short**: the + adjective + -est → the tallest, the fastest
- **Long**: the most + adjective → the most expensive
- **Irregular**: good → the best, bad → the worst

## Examples
- My house is **bigger than** yours.
- She is **the tallest** girl in the class.
- This phone is **more expensive than** that one.
- It's **the best** restaurant in the city.

## Practice
1. A car is _____ (fast) than a bicycle.
2. This is _____ (good) book I've ever read.
3. My sister is _____ (young) than me.
"""
    },

    # ═══ B1 (4 lessons) ═══
    {
        "title": "Present Perfect: Life Experiences",
        "description": "Master the present perfect tense to talk about experiences and achievements.",
        "level": "B1", "type": "lesson", "order": 9, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["present perfect", "experiences", "grammar"],
        "previewContent": "Use the present perfect tense to discuss life experiences, achievements, and past events with present relevance.",
        "content": """# Present Perfect: Life Experiences

## Form
**Subject + have/has + past participle**

- I **have visited** London.
- She **has studied** English for 5 years.
- They **have never been** to Japan.

## Uses
1. **Life experiences**: "I have travelled to 10 countries."
2. **Changes over time**: "Your English has improved."
3. **Achievements**: "She has won three awards."
4. **Unfinished actions**: "I have lived here since 2020."

## Ever / Never / Just / Already / Yet
- **Ever**: Have you ever seen a ghost?
- **Never**: I have never tried sushi.
- **Just**: He has just arrived.
- **Already**: She has already finished.
- **Yet**: Have you done your homework yet?

## Practice
Answer these questions using present perfect:
1. Have you ever been to another country?
2. What is the best film you have ever seen?
3. How long have you studied English?
"""
    },
    {
        "title": "Conditionals: If Sentences",
        "description": "Learn zero, first, and second conditional sentences for real and hypothetical situations.",
        "level": "B1", "type": "lesson", "order": 10, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["conditionals", "if sentences", "grammar"],
        "previewContent": "Express conditions and results using zero, first, and second conditional structures.",
        "content": """# Conditionals: If Sentences

## Zero Conditional (General truths)
**If + present simple, present simple**
- If you **heat** water to 100°C, it **boils**.
- If I **don't sleep** enough, I **feel** tired.

## First Conditional (Real future possibility)
**If + present simple, will + verb**
- If it **rains** tomorrow, I **will stay** home.
- If you **study** hard, you **will pass** the exam.

## Second Conditional (Unreal present / hypothetical)
**If + past simple, would + verb**
- If I **had** a million dollars, I **would travel** the world.
- If she **were** taller, she **would play** basketball.

## Practice
Complete the sentences:
1. If you _____ (heat) ice, it _____ (melt).
2. If I _____ (have) time, I _____ (help) you.
3. If I _____ (be) you, I _____ (accept) the job.
"""
    },
    {
        "title": "Giving Opinions and Debating",
        "description": "Learn to express opinions, agree, disagree, and participate in discussions.",
        "level": "B1", "type": "lesson", "order": 11, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["opinions", "discussion", "speaking"],
        "previewContent": "Express and defend your opinions in English. Learn polite ways to agree and disagree.",
        "content": """# Giving Opinions and Debating

## Expressing Opinions
- "In my opinion, ..."
- "I believe that ..."
- "As far as I'm concerned, ..."
- "It seems to me that ..."

## Agreeing
- "I agree with you."
- "That's a good point."
- "Absolutely / Exactly / Definitely"

## Disagreeing Politely
- "I see your point, but ..."
- "I'm not sure I agree with that."
- "That's one way to look at it, but ..."
- "I see things differently."

## Asking for Opinions
- "What do you think about ...?"
- "How do you feel about ...?"
- "What's your view on ...?"

## Practice Topic
Should students be required to wear school uniforms?
- State your opinion using one of the phrases above.
- Give at least two reasons.
- Respond to a possible counter-argument.
"""
    },
    {
        "title": "Narrative Tenses: Telling Stories",
        "description": "Combine past tenses to tell engaging stories and anecdotes.",
        "level": "B1", "type": "lesson", "order": 12, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["narrative", "past tenses", "storytelling"],
        "previewContent": "Tell compelling stories using past simple, past continuous, and past perfect together.",
        "content": """# Narrative Tenses: Telling Stories

## Past Simple (completed actions)
- "I **woke up**, **had** breakfast, and **left**."

## Past Continuous (background / interrupted actions)
- "I **was walking** home when I saw an accident."
- "While she **was studying**, her friend arrived."

## Past Perfect (actions before another past action)
- "When I arrived, the movie **had already started**."
- "She **had never flown** before last year."

## Story Structure
1. **Setting**: "It was a dark and stormy night..."
2. **Background**: "We were driving to the coast..."
3. **Main event**: "Suddenly, the engine stopped..."
4. **Resolution**: "In the end, we called for help..."

## Example Story
"Last summer, I was travelling in Vietnam. I had never been there before. While I was exploring a market, I met an old friend. We hadn't seen each other for 10 years!"
"""
    },

    # ═══ B2 (4 lessons) ═══
    {
        "title": "Passive Voice in Academic Writing",
        "description": "Master the passive voice for formal and academic English.",
        "level": "B2", "type": "lesson", "order": 13, "estimatedMinutes": 35, "published": True, "isPremium": False,
        "tags": ["passive voice", "academic", "writing"],
        "previewContent": "Use the passive voice effectively in formal writing, reports, and academic contexts.",
        "content": """# Passive Voice in Academic Writing

## Formation
**Subject + be (conjugated) + past participle (+ by agent)**

## Tenses
| Tense | Active | Passive |
|-------|--------|---------|
| Present Simple | The company produces cars | Cars **are produced** |
| Past Simple | The team wrote the report | The report **was written** |
| Present Perfect | Scientists have discovered... | ...**has been discovered** |
| Modal | We must complete the project | The project **must be completed** |

## When to Use Passive
1. **Agent is unknown**: "The window was broken."
2. **Agent is obvious**: "He was arrested." (by police)
3. **Focus on result, not doer**: "The bridge was built in 1990."
4. **Formal/Academic writing**: "It can be concluded that..."

## Common Academic Phrases
- "It is believed that..."
- "The data were collected..."
- "Participants were asked to..."
- "The results are summarized in Table 1."

## Practice
Rewrite in passive voice:
1. The government implemented new policies.
2. Researchers have discovered a new species.
3. The committee will announce the decision tomorrow.
"""
    },
    {
        "title": "Modal Verbs: Expressing Certainty and Possibility",
        "description": "Use modal verbs to express degrees of certainty, possibility, and obligation.",
        "level": "B2", "type": "lesson", "order": 14, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["modal verbs", "certainty", "obligation"],
        "previewContent": "Express varying degrees of certainty, possibility, necessity, and obligation using modal verbs.",
        "content": """# Modal Verbs: Expressing Certainty and Possibility

## Degrees of Certainty (Present)
| Modal | Meaning | Example |
|-------|---------|---------|
| **Must** | Very certain | "He must be at work." |
| **Should** | Probably | "She should be home by now." |
| **May / Might / Could** | Possible | "It might rain later." |
| **Can't** | Very certain (not) | "That can't be true." |

## Degrees of Certainty (Past)
- **Must have + PP**: "He must have forgotten."
- **Might/May have + PP**: "She might have missed the bus."
- **Can't have + PP**: "They can't have left already."

## Obligation and Necessity
- **Must / Have to**: strong obligation
- **Should / Ought to**: advice / recommendation
- **Don't have to**: not necessary
- **Mustn't**: prohibited

## Practice
Choose the correct modal:
1. You look tired. You _____ (should/must) get some rest.
2. I'm not sure. It _____ (must/might) rain later.
3. She _____ (can't/must not) be 30. She looks much younger.
"""
    },
    {
        "title": "Linking Words: Cohesion and Coherence",
        "description": "Master connecting words and phrases for fluent, well-structured writing.",
        "level": "B2", "type": "lesson", "order": 15, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["linking words", "cohesion", "writing"],
        "previewContent": "Connect your ideas smoothly using discourse markers, transition words, and linking phrases.",
        "content": """# Linking Words: Cohesion and Coherence

## Adding Information
- **Furthermore** · **Moreover** · **In addition**
- **Not only... but also**

## Contrast
- **However** · **Nevertheless** · **On the other hand**
- **Although / Even though** · **Despite / In spite of**

## Cause and Effect
- **Therefore** · **Consequently** · **As a result**
- **Because of** · **Due to** · **Thus**

## Sequencing
- **First / Firstly** · **Second / Secondly**
- **Next** · **Then** · **Finally / Lastly**

## Giving Examples
- **For example** · **For instance** · **Such as**

## Practice
Complete with appropriate linking word:
1. She studied hard. _____, she passed the exam. (result)
2. He is rich. _____, he is not happy. (contrast)
3. _____, we need to consider the costs. _____, we must evaluate the benefits. (sequencing)
"""
    },
    {
        "title": "Phrasal Verbs for Everyday Communication",
        "description": "Learn essential phrasal verbs used in everyday English conversation.",
        "level": "B2", "type": "lesson", "order": 16, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["phrasal verbs", "vocabulary", "communication"],
        "previewContent": "Master the most common phrasal verbs for natural, fluent English communication.",
        "content": """# Phrasal Verbs for Everyday Communication

## Common Phrasal Verbs

### Relationships
- **get along with** = have a good relationship
- **fall out with** = stop being friends
- **look up to** = admire
- **put up with** = tolerate

### Work & Study
- **carry out** = perform/complete
- **look into** = investigate
- **come up with** = think of an idea
- **keep up with** = maintain pace

### Daily Life
- **run out of** = use all of something
- **pick up** = collect / learn informally
- **turn down** = refuse an offer
- **put off** = postpone

## Examples
- "I really **look up to** my grandmother."
- "We need to **look into** this problem."
- "She **turned down** the job offer."
- "Don't **put off** your homework until tomorrow."

## Practice
Replace the formal word with a phrasal verb:
1. I need to investigate this issue. → I need to _____ this issue.
2. He refused the invitation. → He _____ the invitation.
3. We postponed the meeting. → We _____ the meeting.
"""
    },

    # ═══ C1 (4 lessons) ═══
    {
        "title": "Inversion and Emphasis",
        "description": "Use inversion for emphasis and formal rhetorical effect.",
        "level": "C1", "type": "lesson", "order": 17, "estimatedMinutes": 35, "published": True, "isPremium": False,
        "tags": ["inversion", "emphasis", "advanced grammar"],
        "previewContent": "Master inverted structures for emphasis in formal writing and sophisticated speech.",
        "content": """# Inversion and Emphasis

## Negative/ restrictive adverbials
**Never / Rarely / Seldom / Little / Not only / No sooner**

- **Never have I seen** such a beautiful sunset.
- **Not only did she finish**, but she also won.
- **No sooner had we arrived** than it started raining.

## 'Only' expressions
**Only then / Only when / Only after / Only if**

- **Only after the war ended** did they return home.
- **Only if you study** will you pass.

## So / Such for emphasis
- **So important is this issue** that we must act now.
- **Such was her dedication** that she worked all night.

## Key Rules
1. Inversion **only** occurs with adverbials at the **beginning** of the sentence.
2. The auxiliary verb comes before the subject.
3. In present simple → use do/does; past simple → use did.

## Practice
Rewrite with inversion:
1. I have never met such a kind person.
2. The economy not only improved, but it boomed.
3. We only realized the truth after reading the report.
"""
    },
    {
        "title": "Cohesion: Reference and Substitution",
        "description": "Advanced techniques for creating cohesive, professional text.",
        "level": "C1", "type": "lesson", "order": 18, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["cohesion", "reference", "advanced writing"],
        "previewContent": "Create sophisticated, flowing text using reference chains, substitution, and ellipsis.",
        "content": """# Cohesion: Reference and Substitution

## Reference Chains
Using pronouns and determiners to avoid repetition:
- "Smith (2020) conducted a study. **The research** examined... **Its findings** showed... **This** suggests that..."

## Substitution
Using words to replace previously mentioned phrases:
- **One / ones**: "I need a pen. Do you have **one**?"
- **So / not**: "Do you think it will work? I hope **so**." / "I hope **not**."
- **Do so**: "They promised to help, but failed to **do so**."

## Ellipsis
Omitting words that are understood from context:
- "She speaks French better than I [speak French]."
- "A: Who's coming? B: John [is coming]."

## Practice
Improve these sentences using cohesion devices:
1. "The experiment was successful. The experiment confirmed our hypothesis. The experiment's results were published."
2. "A: Will you attend the conference? B: Yes, I will attend the conference."
"""
    },
    {
        "title": "Hedging Language in Academic Discourse",
        "description": "Use hedging to express claims with appropriate caution and precision.",
        "level": "C1", "type": "lesson", "order": 19, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["hedging", "academic", "writing"],
        "previewContent": "Express academic claims with appropriate caution using hedging language and devices.",
        "content": """# Hedging Language in Academic Discourse

## Why Hedge?
- **Politeness**: avoid being too direct
- **Precision**: acknowledge uncertainty
- **Protection**: avoid overstatement

## Hedging Verbs
- **It seems that** / **It appears that**
- **Tends to** / **Suggests that** / **Indicates**
- **May** / **Might** / **Could** / **Would**

## Hedging Adverbs
- **Possibly** / **Perhaps** / **Roughly**
- **Generally** / **Usually** / **Typically**
- **Somewhat** / **Relatively** / **Moderately**

## Hedging with Qualifiers
- **To some extent** / **In some cases**
- **A certain degree of** / **Under these conditions**

## Examples
- **Strong**: "This proves that..."
- **Hedged**: "This **suggests** that..."
- **Strong**: "Smoking causes cancer."
- **Hedged**: "Smoking **appears to be strongly linked** to cancer."

## Practice
Rewrite more scientifically using hedging:
1. "Global warming will destroy coastal cities."
2. "This drug cures the disease."
3. "Social media makes people depressed."
"""
    },
    {
        "title": "Collocations and Idiomatic Language",
        "description": "Master natural-sounding collocations and idioms for fluent English.",
        "level": "C1", "type": "lesson", "order": 20, "estimatedMinutes": 25, "published": True, "isPremium": False,
        "tags": ["collocations", "idioms", "vocabulary"],
        "previewContent": "Speak and write naturally with advanced collocations and idiomatic expressions.",
        "content": """# Collocations and Idiomatic Language

## Common Collocations

### Adjective + Noun
- **Heavy rain** (not "strong rain")
- **Strong coffee** (not "powerful coffee")
- **Bitter cold** · **Deeply committed**

### Verb + Noun
- **Make a decision** · **Take a break**
- **Do business** · **Have an impact**
- **Pay attention** · **Draw a conclusion**

### Adverb + Adjective
- **Highly unlikely** · **Bitterly disappointed**
- **Widely regarded** · **Closely related**

## Useful Idioms
- **Hit the nail on the head** = describe exactly
- **Once in a blue moon** = very rarely
- **Break the ice** = start a conversation
- **The ball is in your court** = it's your decision
- **Cut corners** = do something poorly to save time

## Practice
Choose the correct collocation:
1. We need to _____ (make/do) a decision soon.
2. Please _____ (pay/give) attention to the instructions.
3. It's _____ (highly/very) unlikely that she'll agree.
"""
    },

    # ═══ C2 (4 lessons) ═══
    {
        "title": "Advanced Argumentation: Rhetorical Devices",
        "description": "Master rhetorical strategies for persuasive writing and speaking at C2 level.",
        "level": "C2", "type": "lesson", "order": 21, "estimatedMinutes": 40, "published": True, "isPremium": False,
        "tags": ["rhetoric", "argumentation", "advanced"],
        "previewContent": "Deploy sophisticated rhetorical devices used by master writers and orators.",
        "content": """# Advanced Argumentation: Rhetorical Devices

## Logos (Logic)
- Use **evidence**, **data**, and **logical reasoning**
- Acknowledge **counter-arguments** and refute them
- Practice: "While X argues ___, the evidence suggests ___"

## Pathos (Emotion)
- **Anecdotes** and personal stories
- **Vivid language** and sensory details
- **Rhetorical questions**: "Can we afford to wait?"

## Ethos (Credibility)
- Demonstrate **expertise** and **authority**
- Show **fairness** to opposing views
- Use measured, confident language

## Rhetorical Figures
- **Anaphora**: repetition at the start ("I have a dream...")
- **Antithesis**: contrasting ideas in parallel ("We need to learn, not to teach")
- **Triad**: three parallel elements ("of the people, by the people, for the people")
- **Chiasmus**: reversal of structure ("Ask not what your country can do for you...")

## Practice
Write a short persuasive paragraph on a topic of your choice, using:
- At least one rhetorical question
- One example of antithesis
- A triad for emphasis
"""
    },
    {
        "title": "Nuanced Argumentation: Concession and Refutation",
        "description": "Master concession and refutation techniques for sophisticated arguments.",
        "level": "C2", "type": "lesson", "order": 22, "estimatedMinutes": 35, "published": True, "isPremium": False,
        "tags": ["argumentation", "refutation", "academic"],
        "previewContent": "Structure compelling arguments using concession and refutation strategies at an advanced level.",
        "content": """# Nuanced Argumentation: Concession and Refutation

## Concession (Acknowledging opposing views)
- **"While it is true that..."**
- **"Admittedly, ..."**
- **"Critics may argue that..."**
- **"There is some merit to the claim that..."**

## Refutation (Providing counter-evidence)
- **"However, this view overlooks..."**
- **"Nevertheless, such arguments fail to consider..."**
- **"On closer examination, this position proves untenable because..."**

## Full Concession-Refutation Structure
"Admittedly, [opposing argument]. However, this perspective fails to account for [your evidence]. Moreover, [further reasoning]. Therefore, despite initial appearances, [your conclusion] remains the more compelling position."

## Example
"Critics may argue that renewable energy is too expensive to implement on a large scale. While it is true that initial costs are substantial, this view overlooks the long-term savings and the escalating costs of climate change. Furthermore, technological advancements have dramatically reduced prices in the past decade."

## Practice
Write a concession-refutation paragraph on:
"Social media does more harm than good."
"""
    },
    {
        "title": "Style and Register: Formal vs. Informal",
        "description": "Master appropriate register and style across contexts from casual to academic.",
        "level": "C2", "type": "lesson", "order": 23, "estimatedMinutes": 30, "published": True, "isPremium": False,
        "tags": ["register", "style", "advanced"],
        "previewContent": "Control register and style effortlessly, moving between formal academic and casual conversational English.",
        "content": """# Style and Register: Formal vs. Informal

## Register Spectrum
**Intimate ↔ Casual ↔ Consultative ↔ Formal ↔ Frozen**

## Features of Formal vs. Informal

| Feature | Informal | Formal |
|---------|----------|--------|
| Contractions | can't, won't | cannot, will not |
| Phrasal verbs | put off | postpone |
| Pronouns | you | one / we |
| Vocabulary | get | obtain / receive |
| Syntax | simple | complex, subordination |

## Formal Alternatives
- **So** → **Therefore / Consequently / Thus**
- **But** → **However / Nevertheless**
- **Also** → **Furthermore / Moreover / In addition**
- **Lots of** → **A substantial number of / A considerable amount of**

## Matching Register to Context
- **Academic paper**: Formal, impersonal, technical
- **Business email**: Neutral-formal, polite, clear
- **Blog post**: Semi-formal, engaging, accessible
- **Text to friend**: Casual, contractions, slang

## Practice
Rewrite this informal message in formal register:
"Hey, we can't make it to the meeting tomorrow. Something came up. Let's reschedule for next week, OK?"
"""
    },
    {
        "title": "Mastering Nuance: Connotation and Subtext",
        "description": "Understand and use connotation, subtext, and implied meaning at C2 level.",
        "level": "C2", "type": "lesson", "order": 24, "estimatedMinutes": 35, "published": True, "isPremium": False,
        "tags": ["nuance", "connotation", "advanced"],
        "previewContent": "Read between the lines and express yourself with precision, detecting and using connotation and subtext.",
        "content": """# Mastering Nuance: Connotation and Subtext

## Denotation vs. Connotation
- **Denotation**: dictionary meaning
- **Connotation**: emotional/cultural association

| Word | Denotation | Connotation |
|------|------------|-------------|
| Thin | low body fat | neutral/positive |
| Slim | low body fat | positive |
| Skinny | low body fat | negative |
| Slender | low body fat | elegant |

## Choosing Words for Effect
- **Thrifty** vs. **Stingy** (positive vs. negative)
- **Confident** vs. **Arrogant** (positive vs. negative)
- **Curious** vs. **Nosy** (positive vs. negative)

## Detecting Subtext
Look for:
- **Understatement**: "It's not ideal" (when it's a disaster)
- **Euphemism**: "Let go" (fired)
- **Sarcasm**: "Great idea" (terrible idea)
- **Litotes**: "Not bad" (very good)

## Practice
Identify the subtext in these statements:
1. "I'm sure you did your best." (after a failure)
2. "That's certainly one way to look at it." 
3. "We need to have a conversation about your performance."
"""
    },

    # ═══ BONUS: A1-A2 Exercises ═══
    {
        "title": "Basic Vocabulary: Animals and Nature",
        "description": "Learn basic animal names and nature vocabulary.",
        "level": "A1", "type": "exercise", "order": 25, "estimatedMinutes": 15, "published": True, "isPremium": False,
        "tags": ["vocabulary", "animals", "nature", "exercise"],
        "previewContent": "A fun exercise to learn animals and nature vocabulary with pictures and matching activities.",
        "content": """# Animals and Nature - Exercise

## Animals
Dog · Cat · Bird · Fish · Horse · Cow · Pig · Elephant · Lion · Monkey

## Nature
Tree · Flower · River · Mountain · Sea · Sky · Sun · Moon · Star · Rain

## Matching Exercise
Match the animal to its sound:
1. Dog → _____ (woof / meow / moo)
2. Cat → _____ (moo / meow / baa)
3. Cow → _____ (baa / moo / woof)

## Fill in the blanks
1. The _____ is in the sky. (sun / river)
2. A _____ lives in water. (bird / fish)
3. The _____ is very tall. (mountain / flower)
"""
    },
    {
        "title": "Everyday Conversations: Shopping",
        "description": "Practice real-life shopping conversations.",
        "level": "A2", "type": "exercise", "order": 26, "estimatedMinutes": 20, "published": True, "isPremium": False,
        "tags": ["shopping", "conversation", "exercise"],
        "previewContent": "Practice buying things in shops: asking prices, choosing items, and paying.",
        "content": """# Shopping - Exercise

## Useful Phrases
- "How much is this?"
- "Can I try this on?"
- "Do you have this in a smaller size?"
- "I'll take it."
- "Do you accept credit cards?"

## Dialog Practice
**Customer:** Excuse me, how much is this T-shirt?
**Shop assistant:** It's $25.
**Customer:** Do you have it in blue?
**Shop assistant:** Yes, here you are.
**Customer:** Great, I'll take it.

## Activity
Write a shopping dialog using the phrases above. Include:
1. Greeting the shop assistant
2. Asking about a product
3. Asking about price
4. Buying the item
"""
    },
    {
        "title": "B1-B2 Grammar: Mixed Conditionals",
        "description": "Advanced mixed conditional patterns for complex hypothetical situations.",
        "level": "B2", "type": "lesson", "order": 27, "estimatedMinutes": 30, "published": True, "isPremium": True,
        "tags": ["conditionals", "mixed conditionals", "advanced grammar"],
        "previewContent": "Master mixed conditionals to express complex time relationships in hypothetical situations. Premium lesson.",
        "content": """# Mixed Conditionals

## Type 1: Past condition → Present result
**If + past perfect, would + base verb**
- "If I **had studied** medicine, I **would be** a doctor now."
  (I didn't study medicine in the past → I'm not a doctor now)

## Type 2: Present condition → Past result
**If + past simple, would have + past participle**
- "If I **were** more careful, I **wouldn't have made** that mistake."
  (I'm not a careful person → I made the mistake)

## Comparison with Standard Conditionals
| If clause | Main clause | Time |
|-----------|-------------|------|
| Past perfect | would + base verb | Past → Present |
| Past simple | would have + PP | Present → Past |
| Past perfect | would have + PP | Past → Past (3rd) |
| Present simple | will + base verb | Present → Future (1st) |

## Practice
Complete the mixed conditional:
1. If she _____ (take) that job, she _____ (be) rich now.
2. If I _____ (know) how to swim, I _____ (joined) the trip yesterday.
3. He _____ (not/be) in trouble now if he _____ (listen) to my advice.
"""
    },
]

# ─── LEVEL TESTS DATA ────────────────────────────────────────────────

def make_level_test(title: str, level: str, test_type: str, time_limit: int, pass_score: int, questions: list, published: bool = True):
    return {
        "title": title,
        "description": f"A {level} level {test_type} test to assess your progress.",
        "level": level,
        "type": test_type,
        "timeLimit": time_limit,
        "passScore": pass_score,
        "questions": questions,
        "isPremium": False,
        "published": published,
    }

LEVEL_TESTS = [
    make_level_test("A1 Beginner Assessment", "A1", "assessment", 10, 70, [
        {"id": q_id(), "questionText": "I _____ a student.", "options": ["am", "is", "are", "be"], "correctAnswer": 0, "type": "grammar", "level": "A1"},
        {"id": q_id(), "questionText": "What is the opposite of 'big'?", "options": ["tall", "small", "long", "wide"], "correctAnswer": 1, "type": "vocabulary", "level": "A1"},
        {"id": q_id(), "questionText": "She _____ from Vietnam.", "options": ["am", "is", "are", "be"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
        {"id": q_id(), "questionText": "Choose the correct word: a red _____", "options": ["apple", "run", "beautiful", "quickly"], "correctAnswer": 0, "type": "vocabulary", "level": "A1"},
        {"id": q_id(), "questionText": "They _____ to school every day.", "options": ["go", "goes", "going", "went"], "correctAnswer": 0, "type": "grammar", "level": "A1"},
        {"id": q_id(), "questionText": "Read: 'Tom is 8 years old. His sister is 10.' Who is older?", "options": ["Tom", "His sister", "They are same age", "His mother"], "correctAnswer": 1, "type": "reading", "level": "A1"},
        {"id": q_id(), "questionText": "I have _____ orange.", "options": ["a", "an", "the", "–"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
        {"id": q_id(), "questionText": "Good _____! (say this in the evening)", "options": ["morning", "afternoon", "evening", "night"], "correctAnswer": 2, "type": "vocabulary", "level": "A1"},
        {"id": q_id(), "questionText": "This _____ my book.", "options": ["am", "is", "are", "be"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
        {"id": q_id(), "questionText": "The opposite of 'happy' is _____", "options": ["sad", "tall", "fast", "old"], "correctAnswer": 0, "type": "vocabulary", "level": "A1"},
    ]),
    make_level_test("A2 Elementary Assessment", "A2", "assessment", 12, 70, [
        {"id": q_id(), "questionText": "She _____ to the park yesterday.", "options": ["go", "goes", "went", "going"], "correctAnswer": 2, "type": "grammar", "level": "A2"},
        {"id": q_id(), "questionText": "I have _____ been to Japan.", "options": ["ever", "never", "yet", "already"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
        {"id": q_id(), "questionText": "My house is _____ than yours.", "options": ["big", "bigger", "biggest", "more big"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
        {"id": q_id(), "questionText": "What does 'delicious' mean?", "options": ["very good to eat", "very fast", "very old", "very expensive"], "correctAnswer": 0, "type": "vocabulary", "level": "A2"},
        {"id": q_id(), "questionText": "I like _____ TV in the evening.", "options": ["watch", "watching", "watches", "to watching"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
        {"id": q_id(), "questionText": "Read: 'The shop opens at 9 AM and closes at 6 PM.' How many hours is it open?", "options": ["8", "9", "10", "11"], "correctAnswer": 1, "type": "reading", "level": "A2"},
        {"id": q_id(), "questionText": "_____ you like some coffee?", "options": ["Do", "Would", "Can", "Will"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
        {"id": q_id(), "questionText": "Choose the correct word: a _____ of water.", "options": ["piece", "glass", "loaf", "bar"], "correctAnswer": 1, "type": "vocabulary", "level": "A2"},
        {"id": q_id(), "questionText": "She is the _____ girl in the class.", "options": ["tall", "taller", "tallest", "most tall"], "correctAnswer": 2, "type": "grammar", "level": "A2"},
        {"id": q_id(), "questionText": "What time do you _____ up in the morning?", "options": ["stand", "wake", "get", "go"], "correctAnswer": 1, "type": "vocabulary", "level": "A2"},
    ]),
    make_level_test("B1 Intermediate Assessment", "B1", "assessment", 15, 70, [
        {"id": q_id(), "questionText": "If it rains, I _____ stay home.", "options": ["would", "will", "am", "going"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
        {"id": q_id(), "questionText": "She has been working here _____ 2019.", "options": ["since", "for", "from", "during"], "correctAnswer": 0, "type": "grammar", "level": "B1"},
        {"id": q_id(), "questionText": "The book _____ by a famous author.", "options": ["wrote", "was written", "is writing", "has written"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
        {"id": q_id(), "questionText": "What does 'generous' mean?", "options": ["happy to give", "very angry", "extremely fast", "very quiet"], "correctAnswer": 0, "type": "vocabulary", "level": "B1"},
        {"id": q_id(), "questionText": "I'm looking forward _____ you next week.", "options": ["to see", "to seeing", "see", "seeing"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
        {"id": q_id(), "questionText": "Read: 'Although it was raining, they decided to go for a walk.' What does 'although' mean?", "options": ["because", "despite the fact that", "as a result", "in addition"], "correctAnswer": 1, "type": "reading", "level": "B1"},
        {"id": q_id(), "questionText": "The opposite of 'permanent' is _____", "options": ["temporary", "continuous", "constant", "durable"], "correctAnswer": 0, "type": "vocabulary", "level": "B1"},
        {"id": q_id(), "questionText": "They _____ each other for years before they got married.", "options": ["knew", "had known", "have known", "were knowing"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
        {"id": q_id(), "questionText": "You _____ see a doctor if you feel sick.", "options": ["must", "should", "would", "could"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
        {"id": q_id(), "questionText": "Choose the correct phrase: _____ my opinion, this is the best option.", "options": ["In", "On", "At", "By"], "correctAnswer": 0, "type": "vocabulary", "level": "B1"},
    ]),
    make_level_test("B2 Upper Intermediate Assessment", "B2", "assessment", 20, 70, [
        {"id": q_id(), "questionText": "The report must _____ by Friday.", "options": ["submit", "be submitted", "have submitted", "submitting"], "correctAnswer": 1, "type": "grammar", "level": "B2"},
        {"id": q_id(), "questionText": "Not only _____ the exam, but she got the highest score.", "options": ["she passed", "did she pass", "she did pass", "passed she"], "correctAnswer": 1, "type": "grammar", "level": "B2"},
        {"id": q_id(), "questionText": "What does 'ambiguous' mean?", "options": ["clear and obvious", "open to interpretation", "extremely angry", "very ambitious"], "correctAnswer": 1, "type": "vocabulary", "level": "B2"},
        {"id": q_id(), "questionText": "The company _____ profits for five years.", "options": ["has increased", "has been increasing", "increased", "had increased"], "correctAnswer": 1, "type": "grammar", "level": "B2"},
        {"id": q_id(), "questionText": "Choose the correct collocation: _____ a complaint.", "options": ["do", "make", "take", "give"], "correctAnswer": 1, "type": "vocabulary", "level": "B2"},
        {"id": q_id(), "questionText": "Read: 'The policy, while well-intentioned, failed to address the root causes.' What is the criticism?", "options": ["It was too expensive", "It didn't fix fundamental problems", "It was poorly designed", "It was unfair"], "correctAnswer": 1, "type": "reading", "level": "B2"},
        {"id": q_id(), "questionText": "I'd rather you _____ me earlier.", "options": ["tell", "told", "had told", "have told"], "correctAnswer": 2, "type": "grammar", "level": "B2"},
        {"id": q_id(), "questionText": "The word 'nevertheless' is used to _____", "options": ["add information", "contrast", "show cause", "give examples"], "correctAnswer": 1, "type": "vocabulary", "level": "B2"},
        {"id": q_id(), "questionText": "_____ he was tired, he continued working.", "options": ["Despite", "Although", "Because", "Therefore"], "correctAnswer": 1, "type": "grammar", "level": "B2"},
        {"id": q_id(), "questionText": "The data _____ from 200 participants.", "options": ["was collected", "were collected", "collected", "collecting"], "correctAnswer": 0, "type": "grammar", "level": "B2"},
    ]),
    make_level_test("C1 Advanced Assessment", "C1", "assessment", 25, 75, [
        {"id": q_id(), "questionText": "_____ his help, the project would have failed.", "options": ["But for", "In spite of", "Because of", "Apart from"], "correctAnswer": 0, "type": "grammar", "level": "C1"},
        {"id": q_id(), "questionText": "Little _____ that the situation would escalate.", "options": ["we knew", "did we know", "we did know", "knew we"], "correctAnswer": 1, "type": "grammar", "level": "C1"},
        {"id": q_id(), "questionText": "What does 'ubiquitous' mean?", "options": ["rare", "everywhere", "dangerous", "unknown"], "correctAnswer": 1, "type": "vocabulary", "level": "C1"},
        {"id": q_id(), "questionText": "It is imperative that every citizen _____ the law.", "options": ["obeys", "obey", "obeying", "obeyed"], "correctAnswer": 1, "type": "grammar", "level": "C1"},
        {"id": q_id(), "questionText": "The authorities are _____ the causes of the accident.", "options": ["looking into", "looking up", "looking after", "looking over"], "correctAnswer": 0, "type": "vocabulary", "level": "C1"},
        {"id": q_id(), "questionText": "Read: 'The study challenges the prevailing paradigm by suggesting that cognitive development occurs in iterative cycles.' What is being challenged?", "options": ["The research method", "The current dominant view", "The study's conclusions", "The data collection process"], "correctAnswer": 1, "type": "reading", "level": "C1"},
        {"id": q_id(), "questionText": "Never have I _____ such a moving performance.", "options": ["see", "seen", "saw", "seeing"], "correctAnswer": 1, "type": "grammar", "level": "C1"},
        {"id": q_id(), "questionText": "The proposal was _____ of serious consideration.", "options": ["worthwhile", "worthy", "worth", "deserving"], "correctAnswer": 1, "type": "vocabulary", "level": "C1"},
        {"id": q_id(), "questionText": "_____ is often the case, the results contradicted our expectations.", "options": ["Which", "As", "That", "What"], "correctAnswer": 1, "type": "grammar", "level": "C1"},
        {"id": q_id(), "questionText": "Choose the most formal equivalent: 'The company got rid of many workers.'", "options": ["The company fired many workers", "The company laid off numerous employees", "The company sacked many people", "The company let workers go"], "correctAnswer": 1, "type": "vocabulary", "level": "C1"},
    ]),
    make_level_test("C2 Proficiency Assessment", "C2", "assessment", 30, 80, [
        {"id": q_id(), "questionText": "What does 'pragmatic' mean?", "options": ["idealistic", "practical", "theoretical", "emotional"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
        {"id": q_id(), "questionText": "The author's _____ tone suggests deep disillusionment.", "options": ["sanguine", "sardonic", "serene", "sentimental"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
        {"id": q_id(), "questionText": "Not until the final paragraph does the writer _____ to her true purpose.", "options": ["allude", "elude", "refer", "infer"], "correctAnswer": 0, "type": "vocabulary", "level": "C2"},
        {"id": q_id(), "questionText": "Such _____ as the director showed earned him widespread respect.", "options": ["equanimity", "indifference", "apathy", "agitation"], "correctAnswer": 0, "type": "vocabulary", "level": "C2"},
        {"id": q_id(), "questionText": "Had the committee _____ the implications, they would have rejected it.", "options": ["considered", "been considering", "have considered", "to consider"], "correctAnswer": 0, "type": "grammar", "level": "C2"},
        {"id": q_id(), "questionText": "Read: 'The film's narrative structure is deliberately non-linear, juxtaposing disparate temporal planes to underscore the protagonist's fractured psyche.' The narrative structure is:", "options": ["Chronological", "Non-chronological", "Linear", "Simple"], "correctAnswer": 1, "type": "reading", "level": "C2"},
        {"id": q_id(), "questionText": "What is the difference between 'continual' and 'continuous'?", "options": ["No difference", "Continual = recurring; Continuous = uninterrupted", "Continuous = recurring; Continual = uninterrupted", "Regional difference"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
        {"id": q_id(), "questionText": "The report was so _____ that even experts struggled.", "options": ["simplistic", "abstruse", "superficial", "lucid"], "correctAnswer": 1, "type": "vocabulary", "level": "C2"},
        {"id": q_id(), "questionText": "Were it not for her dedication, the project _____ failed.", "options": ["will have", "would have", "would be", "had"], "correctAnswer": 1, "type": "grammar", "level": "C2"},
        {"id": q_id(), "questionText": "The negotiations reached a _____ when neither side would compromise.", "options": ["deadlock", "breakthrough", "consensus", "settlement"], "correctAnswer": 0, "type": "vocabulary", "level": "C2"},
    ]),
]

# ─── LEVEL-UP TESTS ─────────────────────────────────────────────────
LEVEL_UP_TESTS = [
    make_level_test("Level Up: A1 → A2", "A1", "level_up", 15, 80, [
        {"id": q_id(), "questionText": "I _____ breakfast at 7 AM yesterday.", "options": ["have", "had", "has", "having"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
        {"id": q_id(), "questionText": "She is _____ than her brother.", "options": ["tall", "taller", "tallest", "more tall"], "correctAnswer": 1, "type": "grammar", "level": "A1"},
        {"id": q_id(), "questionText": "Can you _____ me the salt, please?", "options": ["pass", "passes", "passing", "passed"], "correctAnswer": 0, "type": "grammar", "level": "A1"},
        {"id": q_id(), "questionText": "What does 'hungry' mean?", "options": ["want to drink", "want to eat", "want to sleep", "want to play"], "correctAnswer": 1, "type": "vocabulary", "level": "A1"},
        {"id": q_id(), "questionText": "Read: 'The train leaves at 8:30 AM. We need to arrive at the station 30 minutes early.' When should we arrive?", "options": ["7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM"], "correctAnswer": 1, "type": "reading", "level": "A1"},
    ]),
    make_level_test("Level Up: A2 → B1", "A2", "level_up", 15, 80, [
        {"id": q_id(), "questionText": "Have you _____ been to a concert?", "options": ["ever", "never", "yet", "just"], "correctAnswer": 0, "type": "grammar", "level": "A2"},
        {"id": q_id(), "questionText": "She _____ her homework when I called.", "options": ["did", "was doing", "has done", "does"], "correctAnswer": 1, "type": "grammar", "level": "A2"},
        {"id": q_id(), "questionText": "The opposite of 'cheap' is _____", "options": ["expensive", "bargain", "economical", "reasonable"], "correctAnswer": 0, "type": "vocabulary", "level": "A2"},
        {"id": q_id(), "questionText": "Read: 'First, turn left at the traffic lights. Then go straight for 200 meters. The bank is on your right.' What is the second step?", "options": ["Turn left", "Go straight", "Turn right", "Stop at the bank"], "correctAnswer": 1, "type": "reading", "level": "A2"},
        {"id": q_id(), "questionText": "I'm not very good _____ playing tennis.", "options": ["at", "in", "on", "for"], "correctAnswer": 0, "type": "grammar", "level": "A2"},
    ]),
    make_level_test("Level Up: B1 → B2", "B1", "level_up", 20, 80, [
        {"id": q_id(), "questionText": "If I _____ rich, I would travel the world.", "options": ["am", "was", "were", "will be"], "correctAnswer": 2, "type": "grammar", "level": "B1"},
        {"id": q_id(), "questionText": "She has been studying English _____ three years.", "options": ["since", "for", "during", "from"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
        {"id": q_id(), "questionText": "What does 'essential' mean?", "options": ["optional", "necessary", "difficult", "expensive"], "correctAnswer": 1, "type": "vocabulary", "level": "B1"},
        {"id": q_id(), "questionText": "Read: 'Despite the heavy rain, the match continued.' The match:", "options": ["was cancelled", "went on", "was delayed", "was shortened"], "correctAnswer": 1, "type": "reading", "level": "B1"},
        {"id": q_id(), "questionText": "She said she _____ come to the party.", "options": ["will", "would", "is", "can"], "correctAnswer": 1, "type": "grammar", "level": "B1"},
    ]),
    make_level_test("Level Up: B2 → C1", "B2", "level_up", 25, 80, [
        {"id": q_id(), "questionText": "Had I known, I _____ differently.", "options": ["will act", "would act", "would have acted", "acted"], "correctAnswer": 2, "type": "grammar", "level": "B2"},
        {"id": q_id(), "questionText": "Not only _____ the exam, but she also got the highest score.", "options": ["she passed", "did she pass", "she did pass", "passed she"], "correctAnswer": 1, "type": "grammar", "level": "B2"},
        {"id": q_id(), "questionText": "Choose the correct collocation: _____ a breakthrough.", "options": ["do", "make", "take", "give"], "correctAnswer": 1, "type": "vocabulary", "level": "B2"},
        {"id": q_id(), "questionText": "Read: 'The government's policy failed to address the root causes.' The policy:", "options": ["solved the problem", "didn't fix underlying issues", "was successful", "was popular"], "correctAnswer": 1, "type": "reading", "level": "B2"},
        {"id": q_id(), "questionText": "The data _____ analyzed using statistical methods.", "options": ["was", "were", "has been", "have been"], "correctAnswer": 0, "type": "grammar", "level": "B2"},
    ]),
    make_level_test("Level Up: C1 → C2", "C1", "level_up", 30, 85, [
        {"id": q_id(), "questionText": "_____ his intervention, the situation would have deteriorated.", "options": ["But for", "In spite of", "Because of", "Apart from"], "correctAnswer": 0, "type": "grammar", "level": "C1"},
        {"id": q_id(), "questionText": "Little _____ that the outcome would be so disastrous.", "options": ["we anticipated", "did we anticipate", "we did anticipate", "anticipated we"], "correctAnswer": 1, "type": "grammar", "level": "C1"},
        {"id": q_id(), "questionText": "The word 'ubiquitous' means:", "options": ["rare", "found everywhere", "dangerous", "unknown"], "correctAnswer": 1, "type": "vocabulary", "level": "C1"},
        {"id": q_id(), "questionText": "Read: 'The study challenges the prevailing paradigm.' This means the study:", "options": ["supports current beliefs", "questions current beliefs", "confirms existing theory", "ignores current research"], "correctAnswer": 1, "type": "reading", "level": "C1"},
        {"id": q_id(), "questionText": "It is imperative that the committee _____ immediately.", "options": ["acts", "act", "acting", "acted"], "correctAnswer": 1, "type": "grammar", "level": "C1"},
    ]),
]

# ─── INSERT ALL DATA ─────────────────────────────────────────────────

def seed_collection(col_name: str, items: list, label: str):
    """Insert all items into a Firestore collection."""
    print(f"  Seeding {col_name} ({len(items)} items)…")
    batch = db.batch()
    count = 0
    for item in items:
        doc = db.collection(col_name).document()
        data = {**item, "createdAt": ts(), "updatedAt": ts()}
        batch.set(doc, data)
        count += 1
        # Firestore batch limit is 500
        if count % 400 == 0:
            batch.commit()
            batch = db.batch()
    batch.commit()
    print(f"  OK {label}: {count} documents created")


def main():
    print("=" * 60)
    print("  DYNONARY - Seeding Demo Data")
    print("  Cambridge CEFR Curriculum")
    print("=" * 60)
    print()

    # 1. Placement test
    print("1. Placement test")
    placement_doc = {
        "title": "Cambridge Placement Test",
        "description": "Comprehensive placement test to determine your Cambridge CEFR level (A1-C2). Contains 60 questions covering grammar, vocabulary, reading, and listening skills.",
        "type": "initial",
        "timeLimit": 45,
        "passScore": 70,
        "questions": PLACEMENT_QUESTIONS,
    }
    doc_ref = db.collection("placement_tests").document()
    doc_ref.set({**placement_doc, "createdAt": ts(), "updatedAt": ts()})
    print(f"  OK Placement test created: {doc_ref.id}")
    print()

    # 2. Learning materials
    print("2. Learning materials (28 lessons)")
    seed_collection("learning_materials", MATERIALS, "Materials")
    print()

    # 3. Level tests
    print("3. Level assessment tests (6 levels)")
    seed_collection("tests", LEVEL_TESTS, "Tests")
    print()

    # 4. Level-up tests
    print("4. Level-up tests (5 transitions)")
    seed_collection("tests", LEVEL_UP_TESTS, "Level-up tests")
    print()

    print("=" * 60)
    print("  OK Demo data seeding complete!")
    print(f"  Placement test: 1 test ({len(PLACEMENT_QUESTIONS)} questions)")
    print(f"  Learning materials: {len(MATERIALS)} lessons")
    print(f"  Level assessments: {len(LEVEL_TESTS)} tests")
    print(f"  Level-up tests: {len(LEVEL_UP_TESTS)} tests")
    print("=" * 60)


if __name__ == "__main__":
    main()
