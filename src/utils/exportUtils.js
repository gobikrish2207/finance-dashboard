/**
 * Professional CSV Export Utility
 * Handles field escaping and Blob-based downloads for large datasets.
 */

export const downloadCSV = (data, headers, fileName) => {
  if (!data || !data.length) return;

  const escapeField = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [];
  
  // Add Headers
  csvRows.push(headers.join(','));

  // Add Data Rows
  data.forEach(row => {
    const values = headers.map(header => {
      const key = header.toLowerCase();
      return escapeField(row[key]);
    });
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
