# DevDeck

Static planner for finding topic / genre / platform combinations for **Game Dev Tycoon**.

The app includes a **Game guide** section covering the four compatibility checks, research priorities, slider starting points, repetition penalties, game-size multipliers, staff scaling, G3 timing, AAA, MMO and custom hardware.

## Deploy su GitHub Pages

The project has no build step or dependencies. Publish the `main` branch with the `/ (root)` folder selected under **Settings → Pages → Deploy from a branch**. GitHub Pages will serve `index.html` directly.

In alternativa, da terminale:

```bash
git add .
git commit -m "Create Game Dev Tycoon combination planner"
git push origin main
```

## Data notes

The ranking is a decision aid, not the complete scoring formula. It considers topic/genre pairs and simplified platform compatibility; sliders, audience, game size, Design/Tech points, and repetition penalties still affect the in-game result.

The guide content was cross-checked against the [Success Guild updated for 1.7.8](https://gamedevtycoon.fandom.com/wiki/Success_Guild_updated_for_1.7.8), the community's [1.7.8 guide](https://www.reddit.com/r/GameDevTycoon/comments/1oge8gy/simpleish_guide_for_178_expanded/), [part 2](https://www.reddit.com/r/GameDevTycoon/comments/1oged1p/simpleish_guide_for_178_expanded_part_2/), [part 3](https://www.reddit.com/r/GameDevTycoon/comments/1otq1e4/simpleish_guide_for_178_expanded_part_3/), and the open-source [Game-Dev-Tycoon-advicer](https://github.com/reiswaffel78/Game-Dev-Tycoon-advicer).
