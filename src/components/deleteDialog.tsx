import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  DialogActions,
  Button,
} from "@mui/material";
import { Remirror, useRemirror } from "@remirror/react";
import type { RemirrorJSON } from "remirror";

import type { Page } from "../server/types";
import { extensions } from "./editor";

interface DialogProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  deleteRow: Page;
}

const DeleteDialog = ({
  open,
  handleClose,
  handleDelete,
  deleteRow,
}: DialogProps) => {
  const { manager } = useRemirror({
    extensions,
    content: "",
    selection: "end",
    stringHandler: "html",
  });
  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      key={deleteRow.$id}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete Page &quot;<strong>{deleteRow.name}</strong>&quot;?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box sx={{ height: 500 }}>
            <Remirror
              manager={manager}
              editable={false}
              autoRender="end"
              initialContent={JSON.parse(deleteRow.content) as RemirrorJSON}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
