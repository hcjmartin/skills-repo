# skills-repo

A private collection of agent skills, installable with the [Skills CLI](https://skills.sh):

```bash
npx skills add hcjmartin/skills-repo
```

> This is a **private** repository. Any machine or CI job installing from it must be
> authenticated to GitHub (e.g. `gh auth login`) with access to `hcjmartin`.

## Skills in this collection

| Skill | Purpose |
|-------|---------|
| [`skill-creator`](./skill-creator) | Create, edit, evaluate, and optimize skills. |
| [`skill-authoring-workflow`](./skill-authoring-workflow) | Turn rough notes into a compliant, publish-ready `SKILL.md`. |
| [`markdown-documentation`](./markdown-documentation) | GitHub-Flavored Markdown, README, and documentation formatting. |

## Attribution & licenses

These skills are **mirrored from their upstream sources**. Each skill folder retains its
original license file — those terms govern use of that skill.

| Skill | Upstream source | License |
|-------|-----------------|---------|
| `skill-creator` | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 (`skill-creator/LICENSE.txt`) |
| `markdown-documentation` | [aj-geddes/useful-ai-prompts](https://github.com/aj-geddes/useful-ai-prompts) | MIT (`markdown-documentation/LICENSE`) |
| `skill-authoring-workflow` | [deanpeters/product-manager-skills](https://github.com/deanpeters/product-manager-skills) | **CC BY-NC-SA 4.0** (`skill-authoring-workflow/LICENSE`) |

> ⚠️ **`skill-authoring-workflow` is licensed CC BY-NC-SA 4.0 (NonCommercial + ShareAlike).**
> It may be used for private/personal purposes only. Commercial use is not permitted, and any
> derivative must be shared under the same license. Remove or relicense it before using this
> collection in a commercial/company context.
