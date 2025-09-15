import { extname } from "path";
import {
  concatAST,
  DocumentNode,
  FragmentDefinitionNode,
  GraphQLSchema,
  Kind,
} from "graphql";
import {
  oldVisit,
  PluginFunction,
  PluginValidateFn,
  Types,
} from "@graphql-codegen/plugin-helpers";
import { LoadedFragment } from "@graphql-codegen/visitor-plugin-common";
import { ReactApolloRawPluginConfig } from "./config";
import { ReactApolloVisitor } from "./visitor";

export const plugin: PluginFunction<
  ReactApolloRawPluginConfig,
  Types.ComplexPluginOutput
> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: ReactApolloRawPluginConfig
) => {
  const allAst = concatAST(documents.map((v) => v.document) as DocumentNode[]);

  const allFragments: LoadedFragment[] = [
    ...(
      allAst.definitions.filter(
        (d) => d.kind === Kind.FRAGMENT_DEFINITION
      ) as FragmentDefinitionNode[]
    ).map((fragmentDef) => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
    ...(config.externalFragments || []),
  ];

  const visitor = new ReactApolloVisitor(
    schema,
    allFragments,
    config,
    documents
  );
  // @ts-ignore @TODO: FIXME Not sure about type error here
  const visitorResult = oldVisit(allAst, { leave: visitor }) as typeof allAst;

  return {
    prepend: visitor.getImports(),
    content: [
      visitor.fragments,
      ...visitorResult.definitions.filter((t) => typeof t === "string"),
    ].join("\n"),
  };
};

export const validate: PluginValidateFn<any> = async (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: ReactApolloRawPluginConfig,
  outputFile: string
) => {
  if (extname(outputFile) !== ".ts" && extname(outputFile) !== ".tsx") {
    throw new Error(
      `Plugin "typescript-react-apollo" requires extension to be ".ts" or ".tsx"!`
    );
  }
};

export { ReactApolloVisitor };
