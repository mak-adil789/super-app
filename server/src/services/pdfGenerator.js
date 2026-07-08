import PDFDocument from 'pdfkit';

export const generateZakatPdf = (data, stream) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(stream);

  // Header
  doc.fontSize(20).text('ZAKAT CALCULATION REPORT', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
  doc.moveDown();

  // Assets Section
  doc.fontSize(14).text('ASSETS', { underline: true });
  doc.moveDown(0.5);

  const drawRow = (label, value) => {
    doc.fontSize(12).text(label, { continued: true });
    doc.text(`: $${value.toLocaleString()}`, { align: 'right' });
  };

  drawRow('Cash on Hand & Bank', data.cash);
  drawRow('Gold & Silver Value', data.metals);
  drawRow('Investments (Stocks/Shares)', data.investments);
  drawRow('Money Owed to You', data.receivables);

  doc.moveDown();
  doc.fontSize(12).font('Helvetica-Bold').text('Total Assets', { continued: true });
  doc.text(`: $${data.totalAssets.toLocaleString()}`, { align: 'right' });
  doc.font('Helvetica');
  doc.moveDown();

  // Liabilities
  doc.fontSize(14).text('LIABILITIES', { underline: true });
  doc.moveDown(0.5);
  drawRow('Debts & Bills Due', data.liabilities);
  doc.moveDown();

  // Summary
  doc.rect(50, doc.y, 500, 100).stroke();
  doc.moveDown();
  doc.fontSize(14).font('Helvetica-Bold').text('SUMMARY', { align: 'center' });
  doc.moveDown(0.5);

  doc.fontSize(12).text('Net Zakat-able Wealth', { continued: true });
  doc.text(`: $${data.netAssets.toLocaleString()}`, { align: 'right' });

  doc.fillColor('green').text('Zakat Due (2.5%)', { continued: true });
  doc.text(`: $${data.zakatDue.toLocaleString()}`, { align: 'right' });

  doc.fillColor('black').moveDown(2);
  doc.fontSize(8).text('Disclaimer: This report is an estimation based on the values provided. Please consult with a qualified scholar for complex financial situations.', { align: 'center', italic: true });

  doc.end();
};
