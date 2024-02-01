import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db, auth } from '../firebase';

const DashboardScreen = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [dateLabels, setDateLabels] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const formattedDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    return day;
  };

  const fetchData = async () => {
    try {
      console.log('Start data fetching');

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const userUid = currentUser.uid;
      console.log('Current User UID:', userUid);

      const usersRef = db.collection('users');
      const userDoc = await usersRef.doc(userUid).get();

      if (!userDoc.exists) {
        setError('User document not found');
        setLoading(false);
        return;
      }

      const userCompanyID = userDoc.data().companyID;

      console.log('User Company ID:', userCompanyID);

      const invoicesRef = db.collection('invoices');

      const querySnapshot = await invoicesRef.where('companyID', '==', userCompanyID).get();

      console.log('Query Snapshot:', querySnapshot);

      if (querySnapshot.empty) {
        console.log('No invoices found for the current user.');
        setLoading(false);
        return;
      }

      const salesDataMap = new Map();
      const dateLabelsArray = [];
      let tempTotalSales = 0;

      querySnapshot.forEach((doc) => {
        try {
          const amount = doc.data().total;
          const invoiceDate = doc.data().date.toDate();
          const formattedDateString = formattedDate(invoiceDate);

          if (salesDataMap.has(formattedDateString)) {
            salesDataMap.set(formattedDateString, salesDataMap.get(formattedDateString) + amount);
          } else {
            salesDataMap.set(formattedDateString, amount);
            dateLabelsArray.push(formattedDateString);
          }

          tempTotalSales += amount;
        } catch (dateError) {
          console.error('Error parsing date:', dateError.message);
        }
      });

      const sortedDateLabels = dateLabelsArray.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });

      const salesDataArray = sortedDateLabels.map((date) => salesDataMap.get(date) || 0);

      console.log('Total Sales:', tempTotalSales);
      console.log('Date Labels:', sortedDateLabels);

      setTotalSales(tempTotalSales);
      setSalesData(salesDataArray);
      setDateLabels(sortedDateLabels);
      setLoading(false);

      const firstDate = new Date(sortedDateLabels[0]);
      const lastDate = new Date(sortedDateLabels[sortedDateLabels.length - 1]);

      const formattedFirstDate = `${firstDate.toLocaleString('default', { month: 'long' })} ${firstDate.getFullYear()}`;
      const formattedLastDate = `${lastDate.toLocaleString('default', { month: 'long' })} ${lastDate.getFullYear()}`;
      console.log('From:', formattedFirstDate);
      console.log('To:', formattedLastDate);

      setFromDate(formattedFirstDate);
      setToDate(formattedLastDate);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(`Error fetching data: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    console.error(error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  console.log('Rendered successfully');

  return (
    <View style={styles.container}>
      <Text style={styles.totalSalesText}>Total Sales: €{totalSales.toFixed(2)}</Text>
      <Text style={styles.dateRangeText}>{`From: ${fromDate} To: ${toDate}`}</Text>
      <LineChart
        data={{
          labels: dateLabels,
          datasets: [
            {
              data: salesData,
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width}
        height={220}
        yAxisLabel={'€'}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  totalSalesText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  dateRangeText: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
    borderColor: 'red', 
    borderWidth: 2, 
  },
});

export default DashboardScreen;