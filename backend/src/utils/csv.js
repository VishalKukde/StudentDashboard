const { stringify } = require("csv-stringify/sync");

const toCsv = (records, columns) =>
  stringify(records, {
    header: true,
    columns,
    quoted: true
  });

module.exports = { toCsv };
