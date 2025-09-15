import { RawClientSideBasePluginConfig } from "@graphql-codegen/visitor-plugin-common";

/**
 * @description This plugin generates React Apollo components and HOC with TypeScript typings.
 *
 * It extends the basic TypeScript plugins: `@graphql-codegen/typescript`, `@graphql-codegen/typescript-operations` - and thus shares a similar configuration.
 */
export interface ReactApolloRawPluginConfig
  extends RawClientSideBasePluginConfig {
  /**
   * @description Customized the output by enabling/disabling the generated mutation function signature.
   * @default true
   *
   * @exampleMarkdown
   * ```ts filename="codegen.ts"
   *  import type { CodegenConfig } from '@graphql-codegen/cli';
   *
   *  const config: CodegenConfig = {
   *    // ...
   *    generates: {
   *      'path/to/file.ts': {
   *        plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
   *        config: {
   *          withMutationFn: true
   *        },
   *      },
   *    },
   *  };
   *  export default config;
   * ```
   */
  withMutationFn?: boolean;
  /**
   * @description Enable generating a function to be used with refetchQueries
   * @default false
   *
   * @exampleMarkdown
   * ```ts filename="codegen.ts"
   *  import type { CodegenConfig } from '@graphql-codegen/cli';
   *
   *  const config: CodegenConfig = {
   *    // ...
   *    generates: {
   *      'path/to/file.ts': {
   *        plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
   *        config: {
   *          withRefetchFn: false
   *        },
   *      },
   *    },
   *  };
   *  export default config;
   * ```
   */
  withRefetchFn?: boolean;
  /**
   * @description Customize the package where apollo-react hooks lib is loaded from.
   * @default "@apollo/client"
   */
  apolloReactHooksImportFrom?: string;

  /**
   * @description Customized the output by enabling/disabling the generated result type.
   * @default true
   *
   * @exampleMarkdown
   * ```ts filename="codegen.ts"
   *  import type { CodegenConfig } from '@graphql-codegen/cli';
   *
   *  const config: CodegenConfig = {
   *    // ...
   *    generates: {
   *      'path/to/file.ts': {
   *        plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
   *        config: {
   *          withResultType: true
   *        },
   *      },
   *    },
   *  };
   *  export default config;
   * ```
   */
  withResultType?: boolean;
  /**
   * @description Customized the output by enabling/disabling the generated mutation option type.
   * @default true
   *
   * @exampleMarkdown
   * ```ts filename="codegen.ts"
   *  import type { CodegenConfig } from '@graphql-codegen/cli';
   *
   *  const config: CodegenConfig = {
   *    // ...
   *    generates: {
   *      'path/to/file.ts': {
   *        plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
   *        config: {
   *          withMutationOptionsType: true
   *        },
   *      },
   *    },
   *  };
   *  export default config;
   * ```
   */
  withMutationOptionsType?: boolean;

  /**
   * @description Whether or not to include wrappers for Apollo's useFragment hook.
   * @default false
   *
   * @exampleMarkdown
   * ```ts filename="codegen.ts"
   *  import type { CodegenConfig } from '@graphql-codegen/cli';
   *
   *  const config: CodegenConfig = {
   *    // ...
   *    generates: {
   *      'path/to/file.ts': {
   *        plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
   *        config: {
   *          withFragmentHooks: true
   *        },
   *      },
   *    },
   *  };
   *  export default config;
   * ```
   */
  withFragmentHooks?: boolean;

  /**
   * @description Allows you to enable/disable the generation of docblocks in generated code.
   * Some IDE's (like VSCode) add extra inline information with docblocks, you can disable this feature if your preferred IDE does not.
   * @default true
   *
   * @exampleMarkdown
   * ```ts filename="codegen.ts"
   *  import type { CodegenConfig } from '@graphql-codegen/cli';
   *
   *  const config: CodegenConfig = {
   *    // ...
   *    generates: {
   *      'path/to/file.ts': {
   *        plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
   *        config: {
   *          addDocBlocks: true
   *        },
   *      },
   *    },
   *  };
   *  export default config;
   * ```
   */
  addDocBlocks?: boolean;
  /**
   * @description Configure default mutation and query hook options.
   */
  defaultBaseOptions?: ReactApolloPluginConfigDefaultBaseOptions;

  hooksSuffix?: string;
}

export interface ReactApolloPluginConfigDefaultBaseOptions {
  awaitRefetchQueries?: boolean;
  errorPolicy?: string;
  fetchPolicy?: string;
  ignoreResults?: boolean;
  notifyOnNetworkStatusChange?: boolean;
  returnPartialData?: boolean;
  ssr?: boolean;
  [key: string]: any;
}
