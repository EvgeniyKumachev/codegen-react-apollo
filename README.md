# graphql-codegen-typescript-react-apollo-v4

> Fork of `@graphql-codegen/typescript-react-apollo` with (basic) Apollo Client v4 compatibility. Focus: keep existing DX while you migrate to `@apollo/client` v4. **Not a drop‑in replacement for new v4 type features (notably `dataState`).**

## Why this fork?

`@apollo/client` v4 introduced a large TypeScript surface change:

- New `dataState` property ("empty" | "partial" | "streaming" | "complete") for queries / fragments
- Result type narrowing based on `dataState`
- Overridable `DataValue` / `TypeOverrides` patterns (e.g. `DeepPartial<T>` for partial / streaming states)

The upstream `@graphql-codegen/typescript-react-apollo` (as of this fork) targets Apollo Client 3 style result types and does **not** emit code aware of the `dataState` discriminant.

This fork updates peer/runtime expectations so your generated React hooks compile & run against `@apollo/client` v4, while deliberately _not_ attempting to model the new `dataState`-based narrowing yet (to keep migration friction low and avoid leaking unstable upstream internals).

## What is (and is not) supported

| Area                                                                                            | Status                                                                                      |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Basic hook generation (`useQuery`, `useLazyQuery`, `useMutation`, `useSubscription`, fragments) | Supported                                                                                   |
| Apollo Client v4 package structure ("framework-agnostic" core + `@apollo/client/react`)         | Supported (imports resolved via `@apollo/client`)                                           |
| React 18+ Suspense hooks you already use (`useSuspenseQuery`, etc.)                             | Generated only if you have documents using them upstream (same as original plugin behavior) |
| `dataState` strict narrowing (`empty` / `partial` / `streaming` / `complete`)                   | NOT supported (see below)                                                                   |
| Deep partial typing for partial / streaming states                                              | NOT supported                                                                               |
| Custom `TypeOverrides` / `DataValue.*` integration                                              | NOT supported                                                                               |
| Data masking / unmasking types beyond upstream v2 behavior                                      | As upstream (no new v4 overrides)                                                           |

### About `dataState`

Apollo Client v4 adds:

```ts
const { data, dataState } = useQuery(MyQuery);
if (dataState === "complete") {
  /* data is fully typed */
}
```

In official v4-aware tooling, TypeScript narrows `data` based on `dataState`. **Generated hooks from this fork always give you**:

```ts
const { data /* dataState exists at runtime, but */ } = useMyQuery();
// data type: MyQueryQuery | undefined (no discriminated unions, no partial DeepPartial<...>)
```

So:

- You may access properties guarded only by optional chaining (`data?.field`) even when data is partial/streaming.
- You do **not** get compile‑time enforcement distinguishing partial vs complete results.
- `dataState` will still be present on the runtime object returned by Apollo Client; it’s just not part of the generated type contract.

If you depend on precise narrowing (e.g. wanting a compiler error when using a field before `complete`), you currently need either:

1. The upstream plugin once it adds full v4 support, or
2. Manual wrapper types / custom plugin changes (PRs welcome).

## Installation

```bash
pnpm add -D graphql-codegen-typescript-react-apollo-v4
# or
npm i -D graphql-codegen-typescript-react-apollo-v4
# or
yarn add -D graphql-codegen-typescript-react-apollo-v4
```

Peer deps you must already have:

- `graphql` (see `peerDependencies` in `package.json`)
- `@apollo/client` ^4.x

## Example Codegen config

`withHooks` option is treated as default because support for components and hocs is removed in apollo v4, other options are mostly preserved. Check `src/config.ts` for reference

`codegen.yml`:

```yaml
schema: schema.graphql
documents: src/**/*.graphql
generates:
  src/generated/graphql.tsx:
    plugins:
      - typescript
      - typescript-operations
      - graphql-codegen-typescript-react-apollo-v4 # <- this fork
```

Import & use:

```ts
import { useMyQuery } from "./generated/graphql";
const { data, dataState } = useMyQuery();
// data: MyQueryQuery | undefined (no narrowing)
// dataState: "empty" | "complete" | "streaming"
```

### Typical manual guard pattern

```ts
const { data, dataState } = useMyQuery({ returnPartialData: true });
if (dataState === "complete" && data) {
  // here you *know* at runtime it's complete, but TS still sees `data | undefined`
}
```

## Rationale for postponing `dataState` typing

Implementing full fidelity requires:

- Emitting discriminated union wrappers around each hook result
- Tracking `returnPartialData`, `errorPolicy`, `@defer` streaming, and fragments
- Coordinating with Apollo’s overridable `TypeOverrides` + `HKT` patterns

That would be a larger design effort; this fork prioritizes _unblocking_ v4 adoption first. Precise typing can be layered later without breaking runtime behavior.

## License

MIT — see `package.json`.
