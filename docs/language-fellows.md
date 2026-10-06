# Language fellows

Back to the [README](../README.md).

Ferfelo Academy turns empty desks into seats for **language fellows**: cultural-context companions that help a newbie live scenes in a target language.

## Hire

1. Walk to an empty desk and press **E**.
2. Pick **native** and **learning** languages from the list (Persian, Central Kurdish (Sorani), English, German, French, and more — either side), plus level (**Newbie** / **Growing** / **Immersed**). Kept in this browser — also editable any time under **⚙️ Settings → You → Learner**.
3. Pick a fellow and optionally rewrite the scene note.
4. Invite — fellows default to **Cursor** (✏️ Edit to pick another provider).

The fellow sits down under their catalog name (Lena, Marco, …) with a brief that sets role, language mix, scene, and soft tool hints. Chat opens automatically.

## Mode

The building runs as **Academy** by default (`AGENT_OFFICE_MODE=academy` or `--mode academy`), with **Ferfelo City** as the default map until someone picks another in Settings. With no floors yet, the office opens a **Ferfelo Campus** floor automatically — no GitHub project picker. Admins can switch to **Coding office** in **⚙️ Settings → Building → Mode** to surface GitHub boards in the main menu again. In Academy mode those boards sit under Staff tools; empty-desk **P** invites a fellow instead of a coding task hire.

## Chat

**E** at a fellow opens a chat window (not the CLI). Replies stream from the agent session. Quick chips under the thread let you jump in (“I'm in”), steal their last practice line, ask what it means, or push the next beat. Closing the chat keeps the thread for that fellow until they leave the desk (same browser tab). **🖥️ Terminal** (or **O** at the desk) opens the raw terminal when you need it.

Fellows run an **engagement loop**: land a sensory hook, give you a choice with stakes, end every turn with one try-this line in your learning language, then recycle it. They move through scene beats more like a story than a lesson plan.

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

- **Newbie** — coach energy: native for comfort, one tiny target chunk to own and repeat.
- **Growing** — co-player energy: mostly target; choices and stakes; one natural recast, then move on.
- **Immersed** — adventure energy: stay in the target language; native only as a freeze rescue.

Stage tips and explanations always use the **native** language you picked (including Persian / Sorani script). Spoken practice lines use the **learning** language. Re-invite a fellow after changing languages so the new brief applies.

Persian, Central Kurdish (Sorani), Arabic, and Hebrew render **RTL** in chat (tips, speech bars, and the compose box). Latin practice lines inside a turn stay LTR.

## Code

- Fellow definitions (one file each): `src/shared/fellows/` — add a def + one line in `catalog.ts`
- Hire / chat / learner UI: `src/client/features/fellows/`
- Learner profile: `src/client/state/learner.ts` (Settings → You)
- Desk **E** opens fellow hire: `src/client/features/workers/actions.ts`
- Rooftop Top 30: `src/shared/charts.ts` + `src/client/features/charts/`
- Karaoke stage: `src/client/features/karaoke/`
- Maps: Ferfelo City + City-ship in `src/shared/maps/city.ts` and `ship.ts`
- Logic prototype (throwaway): `prototypes/language-fellows-logic.html`

Coding hire paths (boards, **P** task prompt, shells) still work. Real TripAdvisor / YouTube UI tools are stubs named in the brief for now.
