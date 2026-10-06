# Language fellows

Back to the [README](../README.md).

Ferfelo Academy turns empty desks into seats for **language fellows**: cultural-context companions that help a newbie live scenes in a target language.

## Hire

1. Walk to an empty desk and press **E**.
2. Pick **native** and **learning** languages from the list (Persian, Central Kurdish (Sorani), English, German, French, and more — either side), plus level (**Newbie** / **Growing** / **Immersed**). Kept in this browser.
3. Pick a fellow and optionally rewrite the scene note.
4. Invite — fellows default to **Cursor** (✏️ Edit to pick another provider).

The fellow sits down under their catalog name (Lena, Marco, …) with a brief that sets role, language mix, scene, and soft tool hints. Chat opens automatically.

## Chat

**E** at a fellow opens a chat window (not the CLI). Type as usual; replies stream from the agent session. Closing the chat keeps the thread for that fellow until they leave the desk (same browser tab). **🖥️ Terminal** (or **O** at the desk) opens the raw terminal when you need it.

## Seed catalog

| Fellow | Role | Default scene |
| --- | --- | --- |
| Lena | Oktoberfest / Hamburg celebration | Celebrate Oktoberfest-style in Hamburg with locals |
| Marco | Home cooking coach | Cook a simple dinner for your girlfriend |
| Sofia | Talk partner (not clinical therapy) | Gentle check-in about how moving feels |
| Joost | Rainy-day Amsterdam guide | Plan a rainy afternoon in Amsterdam |
| Dr. Park | Science explainer | Understand what Cola Zero does in the body |
| Alex | US news hangout | Skim cool US news together |
| Maya | YouTube shadowing coach | Shadow a short clip on the screen |

## Scaffolding

- **Newbie** — mostly native language; short, repeated target phrases.
- **Growing** — mostly target language; native when you stall.
- **Immersed** — stay in the target language; simpler words and cues.

Stage tips and explanations always use the **native** language you picked (including Persian / Sorani script). Spoken practice lines use the **learning** language. Re-invite a fellow after changing languages so the new brief applies.

Persian, Central Kurdish (Sorani), Arabic, and Hebrew render **RTL** in chat (tips, speech bars, and the compose box). Latin practice lines inside a turn stay LTR.

## Code

- Catalog, language list, and briefs: `src/shared/fellows.ts`
- Hire UI: `src/client/features/fellows/`
- Learner profile: `src/client/state/learner.ts`
- Desk **E** opens fellow hire: `src/client/features/workers/actions.ts`
- Logic prototype (throwaway): `prototypes/language-fellows-logic.html`

Coding hire paths (boards, **P** task prompt, shells) still work. Real TripAdvisor / YouTube UI tools are stubs named in the brief for now.
