import { stringify } from "csv-stringify/sync";

export const toCsv = (records, columns) =>
  stringify(records, {
    header: true,
    columns,
    quoted: true
  });
