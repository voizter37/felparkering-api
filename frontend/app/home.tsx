import { StyleSheet, Text, View } from "react-native";
import { useUser } from '../context/UserContext';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import ReportForm from "../components/ReportForm";
import { useApi } from "../services/api";
import axios from "axios";
import ReportWrapper from "../components/ReportWrapper";

export default function Home() {
  const {user} = useUser();
  const router = useRouter();

  const [reports, setReports] = useState([]);

  const api = useApi();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.getAllReports();
        setReports(response.data)
      } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(error.response.data.error);
                }
            }
      }
    }
    fetchReports();
  }, []);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Welcome {user?.email}!</Text>
      <ReportForm />
      <View style={styles.reportsContainer}>
        <View style={styles.reportContainer}>
          <Text style={styles.containerTitle}>Active reports</Text>
          {reports.map((report) => {
            if (report.status != "RESOLVED") {
              return (
                <ReportWrapper 
                  address={report.location} 
                  licensePlate={report.licensePlate} 
                  violation={report.category} 
                  status={report.status}
                />
              );
            }
          })}
        </View>
        <View style={styles.verticalSeparator}/>

        <View style={styles.reportContainer}>
          <Text style={styles.containerTitle}>Archived reports</Text>
          {reports.map((report) => {
            if (report.status == "RESOLVED") {
              return (
                <ReportWrapper 
                  address={report.location} 
                  licensePlate={report.licensePlate} 
                  violation={report.violation} 
                  status={report.status}
                />
              );
            }
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CAD2C5",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 48,
    color: '#fff',
    marginTop: 32,
  },
  containerTitle: {
    fontSize: 24,
  },
  reportsContainer: {
    marginTop: 32,
    flexDirection: 'row',
  },
  reportContainer: {
    alignItems: 'center',
    padding: 16,
  },
  verticalSeparator: {
    borderLeftColor: '#737373',
    borderLeftWidth: StyleSheet.hairlineWidth,
  }
});