# Contributing

Use Node.js 22 (see `.nvmrc`) or another version allowed by `package.json`, then
install with `npm ci`.

Before opening a pull request, run:

```bash
npm run lint
npm run typecheck
npm run build
```

If you changed anything under `components/quest/`, `hooks/` or `lib/` that the
shadcn registry exposes, also rebuild the generated registry payloads and commit
them:

```bash
npx shadcn@latest build
```

(`shadcn` is not a project dependency, so use the `npx` form — the
`registry:build` script assumes it is already on your `PATH`.)

Keep the Quest constraints in mind: interactive targets stay at or above the
48px minimum (`size="xl"` / `size="icon-touch"` on Button, or the `min-h-touch`
/ `size-touch` utilities), layouts stay fluid from roughly 500px to 2000px wide,
and theme tokens live in `app/globals.css` rather than in per-item registry
`cssVars`. See [`docs/QUEST_GUIDELINES.md`](docs/QUEST_GUIDELINES.md) for the
full checklist.

Bug reports and pull requests should include reproduction steps and the tested
browser — for Quest issues, note the Meta Quest browser version and whether the
problem also reproduces in desktop Chrome at the same window size.

## Contributor License Agreement ("CLA")

In order to accept your pull request, we need you to submit a CLA. You only need
to do this once to work on any of Meta's open source projects.

Complete your CLA here: <https://code.facebook.com/cla>

## License

By contributing, you agree that your contributions will be licensed under the
[LICENSE](LICENSE) file in the root directory of this source tree.
