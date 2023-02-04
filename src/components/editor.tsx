import {
  BoldExtension,
  CalloutExtension,
  HistoryExtension,
  HeadingExtension,
  ItalicExtension,
  UnderlineExtension,
  CodeBlockExtension,
  WhitespaceExtension,
} from "remirror/extensions";
import { FindExtension } from "@remirror/extension-find";

import css from "refractor/lang/css.js";
import javascript from "refractor/lang/javascript.js";
import json from "refractor/lang/json.js";
import markdown from "refractor/lang/markdown.js";
import typescript from "refractor/lang/typescript.js";

import {
  EditorComponent,
  useRemirror,
  Remirror,
  BasicFormattingButtonGroup,
  HeadingLevelButtonGroup,
  HistoryButtonGroup,
  Toolbar,
  FindReplaceComponent,
  ThemeProvider,
  OnChangeJSON,
} from "@remirror/react";
import { Box, IconButton, Paper, Popper } from "@mui/material";
import { useCallback, useState } from "react";
import { RemirrorJSON } from "remirror";
import SearchIcon from "@mui/icons-material/Search";

const extensions = () => [
  new HeadingExtension(),
  new HistoryExtension(),
  new FindExtension(),
  new BoldExtension({}),
  new ItalicExtension(),
  new UnderlineExtension(),
  new WhitespaceExtension(),
  new CodeBlockExtension({
    supportedLanguages: [css, javascript, json, markdown, typescript],
  }),
];

const STORAGE_KEY = "remirror-editor-content";

const Editor: React.FC = () => {
  const { manager, state } = useRemirror({
    extensions,
    content: "<p>I love <b>Remirror</b></p>",
    selection: "end",
    stringHandler: "html",
  });

  const [initialContent] = useState<RemirrorJSON | undefined>(() => {
    // Retrieve the JSON from localStorage (or undefined if not found)
    const content = window.localStorage.getItem(STORAGE_KEY);
    return content ? JSON.parse(content) : undefined;
  });

  const handleEditorChange = useCallback((json: RemirrorJSON) => {
    // Store the JSON in localStorage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Remirror manager={manager} initialContent={initialContent}>
        <OnChangeJSON onChange={handleEditorChange} />
        <Box sx={{ position: "fixed" }}>
          <Toolbar>
            <HistoryButtonGroup />
            <BasicFormattingButtonGroup />
            <HeadingLevelButtonGroup showAll />
            <IconButton aria-describedby={id} onClick={handleClick}>
              <SearchIcon />
            </IconButton>
          </Toolbar>
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <Paper sx={{ p: 1 }}>
              <FindReplaceComponent onDismiss={() => setAnchorEl(null)} />
            </Paper>
          </Popper>
        </Box>

        <EditorComponent />
      </Remirror>
    </Box>
  );
};

export default Editor;
