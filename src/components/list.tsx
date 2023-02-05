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
} from "@mui/x-data-grid";
import Link from "next/link";
import { Page } from "../server/types";

interface ListProps {
  pages: Page[];
}

const List = ({ pages }: ListProps) => {
  const columns: GridColDef[] = [
    {
      field: "$id",
      headerName: "Id",
      width: 150,
      renderCell: (params) => (
        <Link href={"/page/" + params.value}>{params.value} </Link>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "content",
      headerName: "Content",
      width: 150,
      hide: true,
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        sx={{ border: 0 }}
        rows={pages}
        getRowId={(row) => row.$id}
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
    </Box>
  );
};

export default List;
