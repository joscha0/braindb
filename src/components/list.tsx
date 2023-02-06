import { Box } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Link from "next/link";
import type { Page, User } from "../server/types";

import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import DeleteDialog from "./deleteDialog";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { appwrite, pagesState, Server, userState } from "../server/global";
import { removeItemAtIndex } from "../services/helper";
interface ListProps {
  pages: Page[];
  user: User;
  setPages: SetterOrUpdater<Page[]>;
}

const List = ({ pages, user, setPages }: ListProps) => {
  const [rows, setRows] = useState(pages);

  const [deleteRow, setDeleteRow] = useState<Page | null>(null);

  const handleClose = () => {
    setDeleteRow(null);
  };

  const handleDelete = () => {
    if (deleteRow) {
      setRows(rows.filter((row) => row.$id !== deleteRow.$id));
      const pageIndex = pages.findIndex((page) => page === deleteRow);
      const newPages = removeItemAtIndex(pages, pageIndex);
      setPages(newPages);
      if (user?.$id) {
        const promise = appwrite.database.deleteDocument(
          Server.databaseID,
          user.$id,
          deleteRow.$id
        );

        promise.then(function (error) {
          console.log(error); // Failure
        });
      }
    }
    setDeleteRow(null);
  };

  const handleDeleteClick = (row: Page) => () => {
    setDeleteRow(row);
  };

  const columns: GridColDef[] = [
    {
      field: "$id",
      headerName: "Id",
      width: 150,
      renderCell: (params) => (
        <Link href={`/page/${params.value as string}`}>{params.value} </Link>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 250,
    },
    {
      field: "content",
      headerName: "Content",
      width: 150,
      hide: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      renderCell: (params) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(params.row)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        sx={{ border: 0 }}
        rows={rows}
        getRowId={(row: Page) => row.$id}
        columns={columns}
        pageSize={50}
        components={{
          Toolbar: () => (
            <GridToolbarContainer
              sx={{
                p: 1,
                pl: { xs: 8, sm: 1 },
                justifyContent: "space-between",
              }}
            >
              <Box>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
              </Box>
              <GridToolbarQuickFilter />
            </GridToolbarContainer>
          ),
        }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
      {deleteRow && (
        <DeleteDialog
          open={deleteRow !== null}
          handleClose={handleClose}
          handleDelete={handleDelete}
          deleteRow={deleteRow}
        />
      )}
    </Box>
  );
};

export default List;
