import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { ChevronLeft, Church as ChurchIcon, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';

export function RequestChurchScreen() {
  const [churchName, setChurchName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [leadPastor, setLeadPastor] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!churchName.trim() || !contactEmail.trim()) {
      Alert.alert('Required Fields', 'Please provide at least the church name and contact email.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <CheckCircle2 size={40} color="#166534" strokeWidth={2} />
          </View>
          <Text style={styles.title}>Registration Request Received!</Text>
          <Text style={styles.subtitle}>
            Thank you for requesting to add <Text style={{ fontWeight: '700', color: '#07182F' }}>{churchName}</Text> to ChurchEden. Our team will contact the church leadership to verify and onboard your ministry.
          </Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => router.replace('/find-church')}
            activeOpacity={0.8}
          >
            <Text style={styles.returnButtonText}>Back to Find Your Church</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ChevronLeft size={22} color="#07182F" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Church</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconCircle}>
          <ChurchIcon size={32} color="#C98A16" strokeWidth={2} />
        </View>

        <Text style={styles.title}>Add your church to ChurchEden</Text>
        <Text style={styles.subtitle}>
          Help us connect your congregation with modern tools for community, discipleship, and giving.
        </Text>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Church Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Grace Sanctuary"
              placeholderTextColor="#8A95A5"
              value={churchName}
              onChangeText={setChurchName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City / Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Kumasi, Ghana"
              placeholderTextColor="#8A95A5"
              value={city}
              onChangeText={setCity}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lead Pastor / Leader (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Rev. Emmanuel Mensah"
              placeholderTextColor="#8A95A5"
              value={leadPastor}
              onChangeText={setLeadPastor}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Email or Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="contact@church.org"
              placeholderTextColor="#8A95A5"
              keyboardType="email-address"
              autoCapitalize="none"
              value={contactEmail}
              onChangeText={setContactEmail}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Submit Church Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#07182F',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF7F2',
    borderWidth: 1.5,
    borderColor: '#E8D5B5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#07182F',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#647082',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#07182F',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    fontSize: 14.5,
    color: '#07182F',
    backgroundColor: '#FAFAFA',
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#C98A16',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#07182F',
    fontSize: 15,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  returnButton: {
    backgroundColor: '#C98A16',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 24,
  },
  returnButtonText: {
    color: '#07182F',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default RequestChurchScreen;
