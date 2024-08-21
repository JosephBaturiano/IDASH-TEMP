import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import WeeklyContent from '../components/WeeklyContent';
import PUPLogo from '../assets/PUPLogo.png'

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    column: {
        width: '50%',
        fontWeight: 'bold',
    },
    content: {
        width: '50%',
    },
    table: {
        marginBottom: 20,
        borderCollapse: 'collapse',
        width: '100%',
    },
    tableRow: {
        border: '1px solid black',
    },
    tableCell: {
        border: '1px solid black',
        padding: 5,
        textAlign: 'left',
    },
    signatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signature: {
        width: '48%',
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 50,
    },
});

const WeeklyPdf = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View>
                <Image
                    style={styles.image}
                    src={PUPLogo} 
                />
                <Text style={styles.header}>CMPE 30213 On-The-Job Training 2 (300 hours)</Text>
                <Text style={styles.subHeader}>STUDENT’S WEEKLY REPORT ON ACTIVITIES</Text>
            </View>

            <View>
                <Text style={styles.subHeader}>Student Information</Text>
                <View style={styles.row}>
                    <Text style={styles.column}>Name of Student:</Text>
                    <Text style={styles.content}>[Student Name]</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.column}>Company Name:</Text>
                    <Text style={styles.content}>[Company Name]</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.column}>Company Address:</Text>
                    <Text style={styles.content}>[Company Address]</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.column}>OJT Adviser/s:</Text>
                    <Text style={styles.content}>[OJT Adviser/s]</Text>
                </View>
            </View>

            <View>
                <Text style={styles.subHeader}>WEEK 0 (July 24, 2024 – July 26, 2024)</Text>
                <WeeklyContent />
            </View>

            <View style={styles.signatures}>
                <View style={styles.signature}>
                    <Text>Jonas Brian R. Macacua</Text>
                    <Text>Trainee/Student</Text>
                </View>
                <View style={styles.signature}>
                    <Text>Mr. Rene S. Yap</Text>
                    <Text>Technical Director</Text>
                    <Text>VisibleTeam Solutions OPC</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default WeeklyPdf;
