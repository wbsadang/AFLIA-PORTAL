/**
 * Converts array of objects to CSV and triggers browser download
 */
export function exportToCSV(filename: string, rows: Record<string, unknown>[]): void {
  if (!rows || !rows.length) {
    alert('No data to export.');
    return;
  }

  const separator = ',';
  const keys = Object.keys(rows[0]);

  const headerRow = keys
    .map((key) => `"${key.replace(/"/g, '""')}"`)
    .join(separator);

  const contentRows = rows.map((row) => {
    return keys
      .map((key) => {
        const val = row[key];
        if (val === null || val === undefined) {
          return '""';
        }
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(separator);
  });

  const csvContent = [headerRow, ...contentRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
