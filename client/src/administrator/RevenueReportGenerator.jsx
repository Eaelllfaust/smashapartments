import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Document as DocxDocument, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  chart: { marginBottom: 20 },
});

const RevenueReportPDF = ({ revenueData, bookingData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Revenue Report</Text>
      <Text style={styles.subtitle}>Total Revenue</Text>
      <Text style={styles.text}>NGN {revenueData.total}</Text>
      <Text style={styles.subtitle}>Revenue Over Time</Text>
      <View style={styles.chart}>
        <Line
          data={{
            labels: revenueData.dates,
            datasets: [{
              label: 'Revenue',
              data: revenueData.amounts,
              borderColor: 'rgba(75,192,192,1)',
            }],
          }}
        />
      </View>
      <Text style={styles.subtitle}>Monthly Bookings</Text>
      <View style={styles.chart}>
        <Bar
          data={{
            labels: bookingData.months,
            datasets: [{
              label: 'Bookings',
              data: bookingData.counts,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            }],
          }}
        />
      </View>
      <Text style={styles.subtitle}>Booking Status Distribution</Text>
      <Text style={styles.text}>Pending: {bookingData.statusCounts.pending}</Text>
      <Text style={styles.text}>Confirmed: {bookingData.statusCounts.confirmed}</Text>
      <Text style={styles.text}>Reserved: {bookingData.statusCounts.reserved}</Text>
      <Text style={styles.text}>Cancelled: {bookingData.statusCounts.cancelled}</Text>
      <Text style={styles.text}>Ended: {bookingData.statusCounts.ended}</Text>
    </Page>
  </Document>
);

const RevenueReportCSV = ({ revenueData = {}, bookingData = {} }) => {
  const csvRows = [
    ['Total Revenue', revenueData.total || 0],
    ['', ''],
    ['Date', 'Revenue'],
    ...(revenueData.dates?.map((date, index) => [date, revenueData.amounts?.[index] || 0]) || []),
    ['', ''],
    ['Month', 'Bookings'],
    ...(bookingData.months?.map((month, index) => [month, bookingData.counts?.[index] || 0]) || []),
    ['', ''],
    ['Booking Status', 'Count'],
    ...Object.entries(bookingData.statusCounts || {}).map(([status, count]) => [status, count])
  ];

  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  const encodedCsv = encodeURIComponent(csvContent);

  return (
    <a href={`data:text/csv;charset=utf-8,${encodedCsv}`} download="revenue_report.csv">
      Export as CSV
    </a>
  );
};

const RevenueReportGenerator = ({ revenueData, bookingData }) => {

  const generateDocx = async () => {
    try {
      // Ensure that `revenueData` and `bookingData` have default values
      const totalRevenue = revenueData?.total || 0;
      const revenueDates = revenueData?.dates || [];
      const revenueAmounts = revenueData?.amounts || [];
      const bookingMonths = bookingData?.months || [];
      const bookingCounts = bookingData?.counts || [];
      const bookingStatusCounts = bookingData?.statusCounts || {};
  
      // Initialize a new docx document with metadata
      const doc = new DocxDocument({
        creator: "Revenue Report Generator", // Prevents "undefined" error on creator
        title: "Revenue Report",
        description: "Monthly Revenue and Booking Report",
      });
  
      // Add content to the document
      doc.addSection({
        children: [
          new Paragraph({
            children: [new TextRun(`Total Revenue: NGN ${totalRevenue}`)],
          }),
          new Paragraph({}), // Blank paragraph for spacing
  
          new Paragraph({ text: 'Revenue Over Time:' }),
          ...revenueDates.map((date, index) => (
            new Paragraph({ text: `${date}: NGN ${revenueAmounts[index] || 0}` })
          )),
  
          new Paragraph({}),
          new Paragraph({ text: 'Monthly Bookings:' }),
          ...bookingMonths.map((month, index) => (
            new Paragraph({ text: `${month}: ${bookingCounts[index] || 0}` })
          )),
  
          new Paragraph({}),
          new Paragraph({ text: 'Booking Status Distribution:' }),
          ...Object.entries(bookingStatusCounts).map(([status, count]) => (
            new Paragraph({ text: `${status}: ${count}` })
          )),
        ],
      });
  
      // Convert the document to a Blob and trigger download
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
  
      saveAs(blob, "revenue_report.docx");
      console.log("File download triggered");
    } catch (error) {
      console.error("Error generating DOCX:", error);
    }
  };
  return (
    <div>
      <br />
      <div>
      <PDFDownloadLink
        document={<RevenueReportPDF revenueData={revenueData} bookingData={bookingData} />}
        fileName="revenue_report.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Generating PDF...' : 'Export report as PDF'
        }
      </PDFDownloadLink>
      </div>
      <br />
      <div>
      <RevenueReportCSV revenueData={revenueData} bookingData={bookingData} />
      </div>
 
      
    </div>
  );
};

export default RevenueReportGenerator;
