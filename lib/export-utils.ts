/**
 * Utilities for exporting calculation data as CSV or PDF report.
 */

export interface ExportField {
  label: string;
  value: string;
}

/**
 * Trigger browser file download of CSV content representing the calculation.
 */
export function exportToCSV(
  title: string,
  inputs: ExportField[],
  results: ExportField[]
) {
  let csvContent = `Calculation Report: ${title}\n`;
  csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;

  csvContent += `INPUT VARIABLES\n`;
  csvContent += `Parameter,Value\n`;
  inputs.forEach((ip) => {
    // Escape commas and quotes
    const cleanLabel = `"${ip.label.replace(/"/g, '""')}"`;
    const cleanVal = `"${ip.value.replace(/"/g, '""')}"`;
    csvContent += `${cleanLabel},${cleanVal}\n`;
  });

  csvContent += `\nCALCULATED RESULTS\n`;
  csvContent += `Output,Value\n`;
  results.forEach((res) => {
    const cleanLabel = `"${res.label.replace(/"/g, '""')}"`;
    const cleanVal = `"${res.value.replace(/"/g, '""')}"`;
    csvContent += `${cleanLabel},${cleanVal}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  
  // Format slug-like filename
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  link.setAttribute('download', `${cleanTitle}-calculation.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Open a printable tab styled beautifully as a standard calculation invoice/report.
 */
export function exportToPDF(
  title: string,
  logo: string | undefined,
  brandName: string | undefined,
  inputs: ExportField[],
  results: ExportField[]
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export calculation reports as PDF.');
    return;
  }

  const cleanBrand = brandName || 'HOME OF CALCULATORS';
  const logoHtml = logo
    ? `<img src="${logo}" alt="Logo" style="max-height: 48px; max-width: 200px; object-fit: contain; margin-bottom: 8px;" />`
    : `<div style="font-family: 'Share Tech Mono', monospace; font-size: 16px; font-weight: 800; border: 2px solid #1a1a1f; padding: 4px 8px; display: inline-block; letter-spacing: 0.1em; text-transform: uppercase;">${cleanBrand}</div>`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title} - Calculation Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1a1a1f;
      line-height: 1.5;
      padding: 40px;
      margin: 0;
      background-color: #ffffff;
    }
    .header {
      border-bottom: 2px solid #1a1a1f;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .title-area {
      flex: 1;
    }
    .brand-area {
      text-align: right;
      margin-left: 20px;
    }
    .title {
      font-size: 24px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .meta {
      font-size: 11px;
      color: #5a5a62;
      font-family: monospace;
      margin-top: 5px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #5a5a62;
      border-bottom: 1px solid #e1e1e3;
      padding-bottom: 6px;
      margin-bottom: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
      font-size: 13px;
    }
    th {
      font-weight: 700;
      color: #5a5a62;
      border-bottom: 1.5px solid #1a1a1f;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
    }
    td {
      border-bottom: 1px dashed #e1e1e3;
    }
    .result-row {
      background-color: #f6f6f7;
      font-weight: bold;
    }
    .result-row td {
      border-bottom: 1px solid #c2c2c6;
    }
    .footer {
      margin-top: 60px;
      font-size: 10px;
      text-align: center;
      color: #9e9ea4;
      border-top: 1px solid #e1e1e3;
      padding-top: 15px;
      font-family: monospace;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title-area">
      <h1 class="title">${title}</h1>
      <div class="meta">Report ID: CC-${Math.random().toString(36).substr(2, 9).toUpperCase()} | Date: ${new Date().toLocaleString()}</div>
    </div>
    <div class="brand-area">
      ${logoHtml}
      <div style="font-size: 10px; color: #5a5a62; margin-top: 4px; font-family: monospace;">homeofcalculators.platform</div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Inputs & Parameters</div>
    <table>
      <thead>
        <tr>
          <th style="width: 60%">Parameter Label</th>
          <th style="width: 40%">Value</th>
        </tr>
      </thead>
      <tbody>
        ${inputs.map(ip => `
          <tr>
            <td>${ip.label}</td>
            <td><strong>${ip.value}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Calculated Outputs</div>
    <table>
      <thead>
        <tr>
          <th style="width: 60%">Output Metric</th>
          <th style="width: 40%">Result</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(res => `
          <tr class="result-row">
            <td>${res.label}</td>
            <td><span style="font-family: monospace; font-size: 14px;">${res.value}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    This is an official calculation report generated by ${cleanBrand} on the HomeOfCalculators platform.
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 300);
    }
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
