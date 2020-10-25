import { declare } from "@babel/helper-plugin-utils";
import transformReactJSX from "@babel/plugin-transform-react-jsx";
import transformReactJSXDevelopment from "@babel/plugin-transform-react-jsx-development";
import transformReactDisplayName from "@babel/plugin-transform-react-display-name";
import transformReactPure from "@babel/plugin-transform-react-pure-annotations";

export default declare((api, opts) => {
  api.assertVersion(7);

  let { pragma, pragmaFrag } = opts;

  const {
    pure,
    throwIfNamespace = true,
    runtime = "classic",
    importSource,
  } = opts;

  // TODO: (Babel 8) Remove setting these defaults
  if (runtime === "classic") {
    pragma = pragma || "React.createElement";
    pragmaFrag = pragmaFrag || "React.Fragment";
  }

  // TODO: (Babel 8) Don't cast these options but validate it
  const development = !!opts.development;
  const useBuiltIns = !!opts.useBuiltIns;

  if (typeof development !== "boolean") {
    throw new Error(
      "@babel/preset-react 'development' option must be a boolean.",
    );
  }

  return {
    plugins: [
      [
        development ? transformReactJSXDevelopment : transformReactJSX,
        {
          importSource,
          pragma,
          pragmaFrag,
          runtime,
          throwIfNamespace,
          useBuiltIns,
          useSpread:
            "useSpread" in opts ? opts.useSpread : runtime !== "classic",
          pure,
        },
      ],
      transformReactDisplayName,
      pure !== false && transformReactPure,
    ].filter(Boolean),
  };
});
