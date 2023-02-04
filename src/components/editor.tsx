import {
  BoldExtension,
  HistoryExtension,
  HeadingExtension,
  ItalicExtension,
  UnderlineExtension,
  WhitespaceExtension,
  CodeExtension,
  TrailingNodeExtension,
  BulletListExtension,
  OrderedListExtension,
  TaskListExtension,
  LinkExtension,
  HorizontalRuleExtension,
  ImageExtension,
  BlockquoteExtension,
  NodeFormattingExtension,
  //   CalloutExtension,
  HardBreakExtension,
} from "remirror/extensions";
import { FindExtension } from "@remirror/extension-find";

import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import { CodeMirrorExtension } from "@remirror/extension-codemirror6";

import {
  EditorComponent,
  useRemirror,
  Remirror,
  BasicFormattingButtonGroup,
  HeadingLevelButtonGroup,
  HistoryButtonGroup,
  Toolbar,
  FindReplaceComponent,
  OnChangeJSON,
  CommandButtonGroup,
  //   CalloutTypeButtonGroup,
  ListButtonGroup,
  TextAlignmentButtonGroup,
  IndentationButtonGroup,
  useCommands,
  DropdownButton,
  CommandMenuItem,
} from "@remirror/react";
import { Box, IconButton, Paper, Popper } from "@mui/material";
import { useCallback, useState } from "react";
import { ProsemirrorNode, RemirrorJSON } from "remirror";
import SearchIcon from "@mui/icons-material/Search";

const extensions = () => [
  new HeadingExtension(),
  new HistoryExtension(),
  new FindExtension(),
  new BoldExtension({}),
  new ItalicExtension(),
  new UnderlineExtension(),
  new WhitespaceExtension(),
  new CodeExtension(),
  new BulletListExtension(),
  new OrderedListExtension(),
  new HardBreakExtension(),
  new TaskListExtension(),
  new TrailingNodeExtension(),
  new HorizontalRuleExtension(),
  new BlockquoteExtension(),
  new NodeFormattingExtension(),
  //   new CalloutExtension({ renderEmoji, defaultEmoji: "💡" }),
  new LinkExtension({ autoLink: true }),
  new ImageExtension({ enableResizing: true }),
  new CodeMirrorExtension({
    languages: languages,
    extensions: [oneDark],
  }),
];

const STORAGE_KEY = "remirror-editor-content";

// const renderEmoji = (node: ProsemirrorNode) => {
//   const emoji = document.createElement("span");
//   emoji.textContent = node.attrs.emoji;
//   return emoji;
// };

const Editor: React.FC = () => {
  const { manager, state, onChange } = useRemirror({
    extensions,
    content: "",
    selection: "end",
    stringHandler: "html",
  });

  const [initialContent] = useState<RemirrorJSON | undefined>(() => {
    // Retrieve the JSON from localStorage (or undefined if not found)
    const content = window.localStorage.getItem(STORAGE_KEY);
    const json: RemirrorJSON | undefined = content
      ? JSON.parse(content)
      : undefined;
    return json;
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
      <Remirror
        manager={manager}
        initialContent={initialContent}
        autoFocus
        onChange={onChange}
      >
        <OnChangeJSON onChange={handleEditorChange} />
        <Box
          sx={{
            position: "fixed",
            overflowX: "scroll",
            overflowY: "hidden",
            width: "100%",
          }}
        >
          <Toolbar>
            <HistoryButtonGroup />
            <BasicFormattingButtonGroup />
            <HeadingLevelButtonGroup showAll />
            <TextAlignmentButtonGroup />
            <IndentationButtonGroup />
            <LineHeightButtonDropdown />
            <ListButtonGroup />
            {/* <CalloutTypeButtonGroup /> */}
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
        <Box sx={{ overflowX: "hidden", overflowY: "scroll" }}>
          <EditorComponent />
        </Box>
      </Remirror>
    </Box>
  );
};

const LineHeightButtonDropdown = () => {
  const { setLineHeight } = useCommands();
  return (
    <CommandButtonGroup>
      <DropdownButton aria-label="Line height" icon="lineHeight">
        <CommandMenuItem
          commandName="setLineHeight"
          onSelect={() => setLineHeight(1)}
          enabled={setLineHeight.enabled(1)}
          label="Narrow"
        />
        <CommandMenuItem
          commandName="setLineHeight"
          onSelect={() => setLineHeight(2)}
          enabled={setLineHeight.enabled(2)}
          label="Wide"
        />
      </DropdownButton>
    </CommandButtonGroup>
  );
};

export default Editor;
