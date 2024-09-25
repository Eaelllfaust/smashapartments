import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

// Define styles for the PDF
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

// Main component
const RevenueReportGenerator = ({ revenueData, bookingData }) => {
  return (
    <PDFDownloadLink
      document={<RevenueReportPDF revenueData={revenueData} bookingData={bookingData} />}
      fileName="revenue_report.pdf"
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Generating PDF...' : 'Export total revenue report'
      }
    </PDFDownloadLink>
  );
};

export default RevenueReportGenerator;