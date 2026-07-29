# Contributing to mcp-kit

Thank you for helping improve `mcp-kit`. Contributions to the CLI, project templates, shared utilities, tests,
documentation, and issue triage are welcome.

By participating, you agree to follow the project [Code of Conduct](CODE_OF_CONDUCT.md).

## Choose the right channel

- Use [GitHub Discussions](https://github.com/my-mcp-hub/mcp-kit/discussions) for usage questions, integration help,
  ideas, and showcases.
- Use [GitHub Issues](https://github.com/my-mcp-hub/mcp-kit/issues/new/choose) for reproducible bugs, concrete feature
  proposals, and documentation problems.
- Search existing issues and discussions before opening a new one.

A bug report should include the `create-mcp-kit` version, operating system, Node.js version, package manager, project
type, language, transports, selected template and plugins, and a minimal reproduction. Include the generated project
or terminal output when possible, after removing secrets and other sensitive information.

## Development setup

This repository is a pnpm workspace managed with Turborepo. Use the Node.js version declared in
[.nvmrc](.nvmrc) and the pnpm version declared in [package.json](package.json).

```bash
git clone https://github.com/my-mcp-hub/mcp-kit.git
cd mcp-kit
nvm use
corepack enable
pnpm install
```

Start all packages and the documentation site in development mode:

```bash
pnpm dev
```

To work on one part of the repository, use a workspace filter. For example:

```bash
pnpm --filter create-mcp-kit dev
pnpm --filter @mcp-kit/docs dev
```

## Making a change

1. Create a focused branch from the current default branch.
2. Keep the change limited to one problem or feature.
3. Add or update tests for behavior changes.
4. Keep the TypeScript and JavaScript variants, and the server and client templates, consistent where the change
   applies to more than one generated project.
5. Update both `docs/en` and `docs/zh` when changing user-facing APIs, workflows, or documentation.
6. Add a Changeset with `pnpm changeset` when a change affects a published package. Documentation-only, test-only,
   and internal maintenance changes usually do not need one.
7. Use a [Conventional Commit](https://www.conventionalcommits.org/) message such as
   `fix: preserve selected transports in generated projects` or `docs: clarify client setup`.

Do not edit package changelogs or versions directly. They are generated from Changesets as part of the release
workflow.

## Working on templates

The templates under `packages/create-mcp-kit/template` are the source of generated projects. When changing them:

- Update every applicable `server-ts`, `server-js`, `client-ts`, and `client-js` variant.
- Preserve the `.hbs` extension for Handlebars-rendered files and verify that template variables work for all
  relevant option combinations.
- Check both the Standard and Custom setup paths when a change affects optional tooling.
- Generate a project locally and run its relevant install, build, lint, and test commands when the generated output
  changes.

## Verification

Run the checks relevant to your change before opening a pull request:

```bash
pnpm exec biome check \
  packages/create-mcp-kit/src packages/create-mcp-kit/tests \
  packages/shared/src packages/shared/tests
pnpm exec eslint \
  packages/create-mcp-kit/src packages/create-mcp-kit/tests \
  packages/shared/src packages/shared/tests
pnpm test
pnpm build
```

For a small source change, run the closest Vitest file first. For example:

```bash
pnpm vitest run packages/shared/tests/projectSetup.test.ts
```

For documentation-only changes, build the documentation site:

```bash
pnpm --filter @mcp-kit/docs build
```

If generated output changes, describe the project types, languages, transports, templates, and plugin combinations
you tested manually in the pull request.

## Pull requests

- Link the related issue or discussion when one exists.
- Explain the problem, the chosen solution, and any tradeoffs.
- Include terminal output, generated-file examples, screenshots, or recordings when they make the change easier to
  review.
- Call out breaking changes and migration steps explicitly.
- Include the required Changeset for user-facing changes to published packages.
- Keep unrelated formatting, dependency, generated-file, and lockfile changes out of the pull request.
- Make sure all relevant checks pass.

Maintainers may ask for a smaller reproduction, additional template coverage, or more tests before reviewing an
implementation. This keeps reviews focused and helps prevent regressions across generated project variants.
