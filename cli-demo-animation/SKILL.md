---
name: cli-demo-animation
description: Produces polished, publication-ready CLI demo animations for READMEs, docs, release notes, and launch posts — authentic, colour-faithful asciinema casts and GIFs. Use when asked to record, edit, or verify a terminal demo: CLI walkthroughs, scripted prompt flows, realistic typing and pasting, local-build demonstrations, cast editing, or GIF rendering.
license: MIT
compatibility: Requires asciinema 3.x, expect, agg, ffmpeg, and Node.js
---

# CLI demo animation

Produce a short, editable terminal recording that matches how the project tells users to run its CLI. Script the interaction for repeatability, but let the real command produce every prompt, result, error, and side effect.

The pipeline is: discover the project's convention → map the visible command to the executable under review → pre-warm in a real PTY → record → validate content and colour → edit whole event blocks if needed → render → inspect representative and final frames → report provenance.

## Prerequisites

Use `asciinema` 3.x, `expect`, `agg`, and `ffmpeg`. Prefer the bundled helpers:

- [`assets/demo.exp`](assets/demo.exp) provides prompt, typing, pasting, and colour-clean process helpers. Copy and adapt it for the story.
- [`scripts/record.sh`](scripts/record.sh) records through a consistent colour-enabled PTY.
- [`scripts/check_cast.mjs`](scripts/check_cast.mjs) checks the cast format, visible command, target-owned colour marker, cursor balance, duration, and final hold.

Pre-warm every network and package-backed command once off-camera through the same Expect PTY. Piped warmups are not equivalent: tools can suppress colour, skip prompts, or take different non-interactive paths.

## 1. Discover the project convention

Read the repository's README, install/usage documentation, and any local demo notes. Inspect existing casts or GIFs when available. Decide before scripting:

- **Canonical user command** — the documented command a viewer can copy and run, such as `npx @scope/package`, `uvx package`, or an installed binary.
- **Execution command** — normally the same command. For unpublished work, it may target a local build.
- **Entry behaviour** — which parts a user would type and which they would paste.
- **Visual baseline** — terminal dimensions, theme, font size, prompt treatment, branded colour, and pacing used by existing project demos.

The visible command must be a real documented invocation. When the execution command differs to exercise an unpublished local build, keep its behaviour equivalent and disclose the mapping in the report. A shorter global alias is appropriate only when the project presents it as the normal user path.

Completion criterion: the canonical visible command, actual execution command, entry behaviour, and visual baseline are written down before the driver is recorded.

## 2. Script an authentic interaction

Expect supplies a PTY and deterministic timing. Command entry is editorial; command output is not.

- Type short command names, subcommands, and ordinary flags naturally.
- Paste URLs, hashes, IDs, JSON, generated values, and long paths in one event.
- Paste the whole command when users normally copy it from documentation.
- Run the actual CLI for all target output, prompts, exit codes, and filesystem effects.
- Run verification commands genuinely as well; prepare deterministic fixtures off-camera when needed.

Use the helpers from `assets/demo.exp`:

```expect
prompt
type_text "npx @scope/package add "
paste_text $manifest_url
press_enter

# The visible command is canonical. This local execution exercises unpublished code.
run_cmd [list node $local_cli add $manifest_url]
```

The bundled prompt renders a green `terminal$ ` prefix so user-entered commands are visually distinct from program output and look like a real shell session. Pass a different label to `prompt` when the project has an established prompt convention, while keeping the prompt coloured and immediately recognisable.

The spawned process inherits a clean, colour-enabled environment from the template. `NO_COLOR` must be absent: setting it to `false` or an empty value is not portable because many tools disable colour based on presence alone.

Prompt handling is part of the story. Match a prompt once, pause long enough to read, send the chosen response, then drain to EOF. For redraw-heavy select menus, match the menu title once and avoid an `exp_continue` loop that can react to every redraw.

Completion criterion: every displayed command is runnable as shown, paste-sized values appear as paste events, and the real target process—not inserted text—produces the CLI output.

## 3. Pre-warm under the recording PTY

Run the complete driver once off-camera with the same environment and disposable starting state as the recording. Re-warm after tool or dependency upgrades.

Confirm during pre-warm that:

- the target sees a TTY and takes its interactive path;
- prompts are answered exactly once;
- the canonical visible command maps to the intended executable;
- target-owned branded, success, warning, or error text is coloured;
- dependency downloads and first-run notices will not appear on camera.

Completion criterion: the exact driver reaches its payoff once under the PTY with the expected colours and no surprise prompts.

## 4. Record with a clean colour environment

Use the bundled wrapper:

```sh
scripts/record.sh demo.exp raw.cast "<demo title>" 100x28
```

It runs asciinema with `NO_COLOR`, `FORCE_COLOR`, and `CI` removed; `TERM=xterm-256color`, `COLORTERM=truecolor`, and `NODE_OPTIONS=`; a two-second idle cap; and overwrite enabled. The Expect child inherits the same environment.

Natural TTY colour is preferred over forcing colour. If a tool still suppresses colour in a proven TTY, document why a tool-specific force-colour flag is required.

Record from a fresh disposable project. Keep fixture state and extracted frames outside the deliverable directory.

Completion criterion: the raw cast was produced by the pre-warmed driver in the standard environment and retains target-owned ANSI styling.

## 5. Validate before editing

Convert and read the entire transcript:

```sh
asciinema convert -f txt --overwrite raw.cast raw.txt
```

Then validate the cast with a canonical command and a marker from coloured output owned by the target CLI—not the fake prompt, Git, or a nested installer:

```sh
node scripts/check_cast.mjs raw.cast \
  --command "npx @scope/package do-thing" \
  --color-marker "tool-name"
```

Choose a marker that shares an event with the target's ANSI styling, such as its branded wordmark, coloured success label, warning, or error. Inspect the matching cast event if the check fails; do not substitute an unrelated coloured marker.

Completion criterion: the full transcript is correct, the canonical command is present, target-owned colour is verified, cursor state is balanced, and duration is suitable or has a documented reason to be edited.

## 6. Cut only complete visual blocks

Asciicast v3 is line-oriented JSON: a header followed by relative `[interval, "o", text]` events. Deleting whole events preserves later timing; editing inside spinner or redraw events can strand cursor-hide, clear-line, or style sequences.

- Locate cuts by stable text markers rather than line numbers.
- Include the clear-line or cursor-hide event that begins a noisy block and the matching cursor-show event that ends it.
- Reset the first retained event after a cut to about one second so the splice reads as a beat.
- Keep the driven CLI's own useful output. Condense repetitive dependency or sub-tool detail only when it obscures the story.
- Insert an explicit `[recording edit: … condensed]` label when the omission would otherwise mislead a viewer.

One recording may be split into standalone demos at fake-prompt events. Rewrite each title, rebase the first interval to about 0.2 seconds, and append `[1.8, "o", ""]` to hold the payoff frame.

Completion criterion: every cut removes whole visual blocks, cursor/style pairs remain balanced, and every material omission is disclosed.

## 7. Render and inspect representative frames

Render with the project's established dimensions and font size, or use the default:

```sh
agg demo.cast demo.gif --font-size 16
ffmpeg -i demo.gif /tmp/demo-frames/%03d.png
```

Inspect at original resolution:

1. The first meaningful target-CLI output frame.
2. A success, warning, or error frame where colour carries meaning.
3. The final payoff frame.

Compare against an existing project demo when one exists. Confirm the shell prompt is obvious, branded colour is retained, and hierarchy, line wrapping, cursor state, theme, and font size match—not merely that the GIF renders. Aim for 5–15 seconds and end on the money line.

Run `check_cast.mjs` again on the final cast after edits.

Completion criterion: representative and final frames visibly match the project's terminal convention, target-owned colour remains present, and no cut artifact is visible.

## 8. Deliver reproducibility and provenance

Deliver the final `.cast` and `.gif`; include the `.exp` driver and `.txt` transcript when the user wants reproducibility. Do not keep frame explosions, disposable projects, secrets, or raw intermediates unless requested.

Report:

```markdown
- Canonical user command:
- Visible command:
- Executed command:
- Reason for any difference:
- Typed segments:
- Pasted segments:
- Prompt prefix and colour:
- Recording environment and dimensions:
- Target-owned colour marker checked:
- Editorial cuts:
- Representative frame inspected:
- Final frame inspected:
- Tests or filesystem assertions supporting non-visual claims:
```

The report makes a scripted recording auditable: entry and fixtures are deterministic, while the demonstrated behaviour still comes from the real tool.
