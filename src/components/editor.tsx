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
import { Box, IconButton, Paper, Popper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ProsemirrorNode, RemirrorJSON } from "remirror";
import SearchIcon from "@mui/icons-material/Search";
import { NextPage } from "next";
import { useRecoilState } from "recoil";
import { appwrite, pagesState, Server, userState } from "../server/global";
import { json } from "stream/consumers";
import { Permission, Role } from "appwrite";

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

// const renderEmoji = (node: ProsemirrorNode) => {
//   const emoji = document.createElement("span");
//   emoji.textContent = node.attrs.emoji;
//   return emoji;
// };

interface Props {
  pageId: string;
}

const Editor: NextPage<Props> = (props) => {
  const { pageId } = props;

  const { manager, state, onChange } = useRemirror({
    extensions,
    content: "",
    selection: "end",
    stringHandler: "html",
  });

  const [pages, setPages] = useRecoilState(pagesState);
  const [user, setUser] = useRecoilState(userState);
  const [isSaving, setIsSaving] = useState(false);

  const [initialContent] = useState<RemirrorJSON | undefined>(() => {
    // Retrieve the JSON from localStorage (or undefined if not found)
    const content = pages.find((page) => page.$id === pageId)?.content;
    console.log(content);
    const json: RemirrorJSON | undefined = content
      ? JSON.parse(content)
      : undefined;
    return json;
  });

  //   useEffect(() => {
  //     const content = pages.find((page) => page.$id === pageId);
  //     console.log(content);
  //   }, []);

  const handleEditorChange = useCallback((json: RemirrorJSON) => {
    if (!isSaving) {
      setIsSaving(true);
      saveCloud(json);
    }
  }, []);

  const saveCloud = async (json: RemirrorJSON) => {
    if (user?.$id) {
      const userId = user!.$id;
      const promise = appwrite.database.updateDocument(
        Server.databaseID,
        userId,
        pageId,
        {
          name: "test1",
          content: JSON.stringify(json),
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
          Permission.write(Role.user(userId)),
        ]
      );
      promise.then(
        function (response) {
          console.log(response); // Success
          setIsSaving(false);
        },
        function (error) {
          console.log(error); // Failure
          setIsSaving(false);
        }
      );
    }
  };

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
            <Typography>{}</Typography>
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
