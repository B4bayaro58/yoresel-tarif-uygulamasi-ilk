# Apple App Review — Guideline 2.1 Information Needed (reply)

Paste the text below into the Resolution Center reply AND into
App Review Information → Notes. Attach the screen recording (.mp4/.mov).
Fill in the [brackets] before sending.

---

Hello,

Thank you for reviewing Yöresel Tarif. Please find the requested information below. A screen recording captured on a physical iPhone running iOS [26.x] is attached.

1. SCREEN RECORDING
The recording starts with launching the app and shows: onboarding, account registration (email), login (email, Sign in with Apple), browsing and opening a recipe, the cooking-steps view, favorites and the shopping list, posting a review, reporting a review and blocking a user, the Premium subscription screen (title, duration and price of each plan, plus Terms of Use and Privacy Policy links), a sandbox purchase, and account deletion (Profile → Delete Account).

2. PURPOSE AND TARGET AUDIENCE
Yöresel Tarif is a recipe app focused on regional Turkish cuisine (organized by city) and world cuisines (organized by continent and country), with more than 1,000 recipes. It is for home cooks, mainly Turkish-speaking users, who want reliable traditional recipes. The app solves a common problem: authentic regional recipes are scattered and often unreliable online. We provide structured recipes (ingredients, step-by-step instructions, cooking times, background on each dish), together with practical tools: favorites, a shopping list built from recipe ingredients, a step-by-step cooking mode with timers, and a food blog.

3. SETUP AND ACCESS INSTRUCTIONS
No special setup is required. Users can browse as a guest or create an account.
Demo account (Premium already active, so all premium features can be reviewed):
  Email: inceleme.yoreseltarif@gmail.com
  Password: [PASSWORD]
To test the purchase flow, sign in with a new account or a sandbox Apple ID instead, because the demo account already has Premium.

User-generated content: users can post reviews on recipes and suggest recipes. Suggested recipes are approved by a moderator before they are published. On any review written by another user, tap the flag icon to choose:
- "Şikayet Et" (Report): sends the review to our moderation queue.
- "Kullanıcıyı Engelle" (Block User): hides all of that user's reviews from the blocking user right away, and also reports the review.
Moderators review reported content in the in-app admin panel. They can delete it and block the author from posting.
Account deletion: Profile → "Hesabı Sil" (Delete Account).

4. EXTERNAL SERVICES
- Firebase (Google): Authentication, Cloud Firestore (recipes, reviews, user data), Cloud Storage (recipe photos)
- Sign in with Apple and Google Sign-In: optional login methods
- RevenueCat: subscription management on top of Apple In-App Purchase (all purchases go through StoreKit)
- Google AdMob: banner, interstitial and rewarded ads for non-Premium users (with the App Tracking Transparency prompt)
- Sentry: crash reporting
- Unsplash: some recipe photos, used under the Unsplash License
No AI services are used.

5. REGIONAL DIFFERENCES
The app works the same way in all regions where it is available. The content is in Turkish.

6. REGULATED INDUSTRY / THIRD-PARTY MATERIAL
The app does not operate in a regulated industry. The recipe content was written for the app. Third-party photos come from Unsplash under its license, which permits this use.

7. IN-APP PURCHASES
One auto-renewable subscription group, "Premium Erişim", with two plans:
- Premium Aylık (1 month) – [PRICE]
- Premium Yıllık (1 year) – [PRICE]
Premium removes all ads and unlocks: shopping-list categories and recipe tags, portion scaling, the personal "Menü" (meal planner) tab, and ingredient alternatives ("Yoksa?").
How to reach the purchase screen:
- Profile tab → "Premium", or
- tap any locked premium feature (for example, the portion +/- buttons on a recipe page, or the Menü tab).
The subscription screen shows each plan's title, duration and price, the auto-renewal terms, a "Restore Purchases" button, and links to the Terms of Use (https://yoreseltarif.com/kullanim-kosullari) and the Privacy Policy (https://yoreseltarif.com/gizlilik-politikasi).

Thank you,
[Name]
