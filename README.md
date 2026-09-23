# GDT Companion

Static planner for **Game Dev Tycoon**. Select one or more topics, a genre, a platform, and a target audience to rank combinations. Open a result to see all four compatibility checks and suggested sliders for the three development stages.

## Use

Open the [web app on GitHub Pages](https://seeknhack.github.io/GDTCompanion/) or open `index.html` in a browser. There are no dependencies, installation steps, or build process. To publish it with GitHub Pages, select the `main` branch and `/ (root)` folder under **Settings → Pages**.

By default, the planner picks the highest-scoring platform in the dataset for each topic and genre pair. You can select a specific platform or show them all. Selected topics are saved in the browser. Results are displayed in batches to keep the page responsive.

## How the ranking works

The tables in `data.js` describe topic and platform compatibility with six genres and three audiences. The planner adds four checks: topic × genre, genre × platform, topic × audience, and platform × audience. Each rating becomes points: `+++` = 100, `++` = 80, `+` = 60, `--` = 30, `---` = 0. The maximum is 400. Ties favor topic × genre, then genre × platform. The displayed percentage is the total divided by four.

The three stages use genre-based slider presets. They are starting points, not guaranteed values: game size, features, team skills, repeated ideas, and the quality of previous games all affect the outcome.

Data sources: [Steam tables](https://steamcommunity.com/sharedfiles/filedetails/?l=romanian&id=216784744), [Success Guild 1.7.8](https://gamedevtycoon.fandom.com/wiki/Success_Guild_updated_for_1.7.8), and [GameDevTycoon-Assistant](https://github.com/boeloep/GameDevTycoon-Assistant).
