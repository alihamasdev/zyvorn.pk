# Vendored anti-slop Oxlint plugin

- Source repository: unknown (copied from `install-anti-slop` agent skill assets)
- Source revision / commit: unknown
- Copied assets:
  - `tools/oxlint/anti-slop/index.ts` (generic plugin entry point)
  - `tools/oxlint/anti-slop/rules/` (generic rule implementations)
  - `tools/oxlint/anti-slop/shared/` (shared AST and scope helpers)
  - `tools/oxlint/anti-slop/effect/` (optional Effect plugin, vendored but not enabled as the repo does not depend on Effect)
  - `tools/oxlint/anti-slop/vendor/eslint-stylistic/` (vendored `padding-line-between-statements` rule, MIT license retained)
- Configuration:
  - Generic rules registered under plugin name `"anti-slop"` via `./tools/oxlint/anti-slop/index.ts` in `.oxlintrc.json`
  - Effect plugin not registered (repo does not depend on `effect`)
- Intentional deviations:
  - None (pristine fresh install from skill assets)
