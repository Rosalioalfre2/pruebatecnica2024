/* eslint-disable react/prop-types */
import { Table, Button } from "flowbite-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const BasicTable = ({
  data,
  baseColumns,
  handleUpdate,
  deleteObject,
  showActionsColumn = true,
  actionColumnsValidation = true,
  className,
  masAcciones,
  viewer,
  ...props
}) => {
  let actionColumns= {
    delete: true,
    edit: false,
  };

  if (typeof showActionsColumn == "boolean") {
    actionColumns = showActionsColumn
      ? { edit: true, delete: false }
      : { edit: false, delete: false };
  } else {
    actionColumns = showActionsColumn;
  }

  const columns =
    actionColumns?.delete || actionColumns?.edit
      ? [
          ...baseColumns.filter((base) => base != null),
          {
            header: "",
            accessorKey: "id",
            cell: (row) => (
              <>
                <div className="flex flex-row">
                  {actionColumns.edit &&
                    (actionColumnsValidation == true ||
                      actionColumnsValidation?.edit == true) && (
                      <Button
                        color="success"
                        onClick={() => handleUpdate(row.cell.row.original)}
                      >
                        <FaEdit />
                      </Button>
                    )}
                  {actionColumnsValidation?.edit &&
                    ((actionColumnsValidation.edit.type == "==" &&
                      row.cell.row.original[
                        actionColumnsValidation.edit.name
                      ] == actionColumnsValidation.edit.value) ||
                      (actionColumnsValidation.edit.type == "!=" &&
                        row.cell.row.original[
                          actionColumnsValidation.edit.name
                        ] != actionColumnsValidation.edit.value)) && (
                      <Button
                        color="success"
                        onClick={() => handleUpdate(row.cell.row.original)}
                      >
                        <FaEdit />
                      </Button>
                    )}
                  {actionColumns.delete &&
                    (actionColumnsValidation == true ||
                      actionColumnsValidation?.delete == true) && (
                      <Button
                        color="failure"
                        onClick={() => deleteObject(row.cell.row.original.id)}
                        className="hidden"
                      >
                        <FaTrashAlt />
                      </Button>
                    )}
                    {/* {actionColumnsValidation?.delete &&
                      ((actionColumnsValidation.delete.type == "=" &&
                        row.cell.row.original[
                          actionColumnsValidation.delete.name
                        ] == actionColumnsValidation.delete.value) ||
                        (actionColumnsValidation.delete.type == "!=" &&
                          row.cell.row.original[
                            actionColumnsValidation.delete.name
                          ] != actionColumnsValidation.delete.value)) && (
                        <Button
                          color="failure"
                          onClick={() => deleteObject(row.cell.row.original.id)}
                        >
                          <FaTrashAlt />
                        </Button>
                      )} */}
                      {actionColumns?.delete == true && (
                          <Button
                            color="failure"
                            onClick={() => deleteObject(row.cell.row.original.id)}
                          >
                            <FaTrashAlt />
                          </Button>
                        )}
                  {masAcciones}
                </div>
              </>
            ),
          },
        ]
      : [...baseColumns.filter((base) => base != null)];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <Table
        className={`${className}`}
        theme={tableTheme}
        hoverable
        striped
        {...props}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Head key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.HeadCell key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </Table.HeadCell>
            ))}
          </Table.Head>
        ))}
        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row
              key={row.id}
              onDoubleClick={() => {
                viewer?.setDataViewer(row.original);
                viewer?.setOpenModal(true);
              }}
            >
              {row.getVisibleCells().map((cell, index) => (
                <Table.Cell key={index}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export { BasicTable };

const tableTheme = {
  root: {
    base: "w-full text-left text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-900 rounded-lg",
    shadow:
      "absolute bg-white dark:bg-black w-full h-full top-0 left-0 rounded-lg drop-shadow-md -z-10",
    wrapper: "relative",
  },
  body: {
    base: "group/body",
    cell: {
      base: "group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg px-6 py-4",
    },
  },
  head: {
    base: "group/head text-sm uppercase text-gray-200 dark:text-gray-200",
    cell: {
      base: "group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-gray-900 dark:bg-black px-6 py-3",
    },
  },
  row: {
    base: "group/row",
    hovered: "hover:bg-blue-200 dark:hover:bg-blue-900",
    striped:
      "odd:bg-gray-300 even:bg-slate-200 odd:dark:bg-gray-800 even:dark:bg-gray-700",
  },
};
