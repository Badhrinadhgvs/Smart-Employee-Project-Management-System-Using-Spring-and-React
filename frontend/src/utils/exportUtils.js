import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

/**
 * Minimal & robust CSV export function.
 * Handles string escaping for quotes and commas.
 */
export function downloadCsv(filename, headers, rows) {
  const escapeCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((r) => r.map(escapeCell).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Visual summary bar drawer for PDF documents.
 */
function drawPdfBars(doc, items, startY) {
  if (!items || !items.length) return;
  const max = Math.max(...items.map((item) => item.value), 1);
  const colors = [
    [55, 48, 163],
    [15, 118, 110],
    [225, 29, 72],
    [217, 119, 6],
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('Visual summary', 16, startY);

  items.forEach((item, index) => {
    const y = startY + 8 + index * 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(String(item.label).slice(0, 25), 16, y + 3);

    doc.setFillColor(235, 238, 245);
    doc.roundedRect(62, y, 105, 4, 2, 2, 'F');

    doc.setFillColor(...colors[index % colors.length]);
    doc.roundedRect(62, y, Math.max(2, (105 * item.value) / max), 4, 2, 2, 'F');

    doc.setTextColor(30, 41, 59);
    doc.text(String(item.value), 172, y + 3);
  });
}

/**
 * Standardized PDF document generator using jsPDF & autoTable.
 */
export function downloadPdf(filename, title, headers, rows, summary = '', visuals = []) {
  const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const navy = [27, 42, 74];

  // Header Banner
  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 34, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Smart Emp', 16, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('PROJECT & TASK OPS  /  MANAGEMENT REPORT', 16, 24);

  // Title & Metadata
  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, 16, 49);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(91, 100, 114);
  doc.text(`Generated ${new Date().toLocaleDateString()}${summary ? `  •  ${summary}` : ''}`, 16, 57);

  const visualHeight = visuals.length ? 8 + visuals.length * 8 + 8 : 0;
  if (visuals.length) {
    drawPdfBars(doc, visuals, 68);
  }

  // Data Table
  autoTable(doc, {
    startY: 66 + visualHeight,
    head: [headers],
    body: rows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 3,
      textColor: [22, 35, 63],
      lineColor: [227, 232, 239],
      lineWidth: 0.2,
    },
    headStyles: { fillColor: navy, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 249, 252] },
    margin: { left: 16, right: 16 },
    didDrawPage: () => {
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(`Smart Emp  •  Page ${doc.getNumberOfPages()}`, 16, 287);
    },
  });

  doc.save(pdfFilename);
}
