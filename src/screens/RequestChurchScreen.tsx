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
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { ChevronLeft, Church as ChurchIcon, Phone, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import { useChurchRequest } from '../hooks/useChurchRequest';
import { churchRequestSchema } from '../lib/schemas';
import { isAppError } from '../lib/errors';

export function RequestChurchScreen() {
  const [churchName, setChurchName] = useState('');
  const [city, setCity] = useState('');
  const [leaderName, setLeadPastor] = useState('');
  const [contactMode, setContactMode] = useState<'phone' | 'email'>('phone');
  const [phoneContact, setPhoneContact] = useState('');
  const [emailContact, setEmailContact] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const churchRequest = useChurchRequest();

  const handleSubmit = () => {
    setFormErrors({});
    setGeneralError(null);

    const payload = {
      churchName: churchName.trim(),
      city: city.trim(),
      leaderName: leaderName.trim(),
      phoneContact: contactMode === 'phone' ? phoneContact.trim() : undefined,
      emailContact: contactMode === 'email' ? emailContact.trim() : undefined,
    };

    const validation = churchRequestSchema.safeParse(payload);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = String(issue.path[0]);
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    churchRequest.mutate(validation.data as any, {
      onError: (err) => {
        if (isAppError(err) && err.details) {
          const fieldErrs: Record<string, string> = {};
          Object.entries(err.details).forEach(([f, msgs]) => {
            fieldErrs[f] = msgs[0];
          });
          setFormErrors(fieldErrs);
        } else {
          setGeneralError(isAppError(err) ? err.message : 'Failed to submit church request. Please try again.');
        }
      },
    });
  };

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

        {generalError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{generalError}</Text>
          </View>
        )}

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Church Name *</Text>
            <TextInput
              style={[styles.input, formErrors.churchName ? styles.inputError : null]}
              placeholder="e.g. Grace Sanctuary"
              placeholderTextColor="#8A95A5"
              value={churchName}
              onChangeText={(t) => {
                setChurchName(t);
                if (formErrors.churchName) setFormErrors((prev) => ({ ...prev, churchName: '' }));
              }}
            />
            {formErrors.churchName ? <Text style={styles.fieldError}>{formErrors.churchName}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City / Location *</Text>
            <TextInput
              style={[styles.input, formErrors.city ? styles.inputError : null]}
              placeholder="e.g. Kumasi, Ghana"
              placeholderTextColor="#8A95A5"
              value={city}
              onChangeText={(t) => {
                setCity(t);
                if (formErrors.city) setFormErrors((prev) => ({ ...prev, city: '' }));
              }}
            />
            {formErrors.city ? <Text style={styles.fieldError}>{formErrors.city}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lead Pastor / Leader *</Text>
            <TextInput
              style={[styles.input, formErrors.leaderName ? styles.inputError : null]}
              placeholder="e.g. Rev. Emmanuel Mensah"
              placeholderTextColor="#8A95A5"
              value={leaderName}
              onChangeText={(t) => {
                setLeadPastor(t);
                if (formErrors.leaderName) setFormErrors((prev) => ({ ...prev, leaderName: '' }));
              }}
            />
            {formErrors.leaderName ? <Text style={styles.fieldError}>{formErrors.leaderName}</Text> : null}
          </View>

          {/* Contact Preference Selector (Decision 4 XOR requirement) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Contact Method *</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, contactMode === 'phone' && styles.toggleButtonActive]}
                onPress={() => {
                  setContactMode('phone');
                  if (formErrors.phoneContact || formErrors.emailContact) {
                    setFormErrors((prev) => ({ ...prev, phoneContact: '', emailContact: '' }));
                  }
                }}
                activeOpacity={0.8}
              >
                <Phone size={16} color={contactMode === 'phone' ? '#07182F' : '#647082'} />
                <Text style={[styles.toggleText, contactMode === 'phone' && styles.toggleTextActive]}>
                  Phone Number
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toggleButton, contactMode === 'email' && styles.toggleButtonActive]}
                onPress={() => {
                  setContactMode('email');
                  if (formErrors.phoneContact || formErrors.emailContact) {
                    setFormErrors((prev) => ({ ...prev, phoneContact: '', emailContact: '' }));
                  }
                }}
                activeOpacity={0.8}
              >
                <Mail size={16} color={contactMode === 'email' ? '#07182F' : '#647082'} />
                <Text style={[styles.toggleText, contactMode === 'email' && styles.toggleTextActive]}>
                  Email Address
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {contactMode === 'phone' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Contact *</Text>
              <TextInput
                style={[styles.input, formErrors.phoneContact ? styles.inputError : null]}
                placeholder="+233 24 123 4567"
                placeholderTextColor="#8A95A5"
                keyboardType="phone-pad"
                value={phoneContact}
                onChangeText={(t) => {
                  setPhoneContact(t);
                  if (formErrors.phoneContact) setFormErrors((prev) => ({ ...prev, phoneContact: '' }));
                }}
              />
              {formErrors.phoneContact ? <Text style={styles.fieldError}>{formErrors.phoneContact}</Text> : null}
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Contact *</Text>
              <TextInput
                style={[styles.input, formErrors.emailContact ? styles.inputError : null]}
                placeholder="contact@church.org"
                placeholderTextColor="#8A95A5"
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailContact}
                onChangeText={(t) => {
                  setEmailContact(t);
                  if (formErrors.emailContact) setFormErrors((prev) => ({ ...prev, emailContact: '' }));
                }}
              />
              {formErrors.emailContact ? <Text style={styles.fieldError}>{formErrors.emailContact}</Text> : null}
            </View>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={churchRequest.isPending}
            activeOpacity={0.85}
          >
            {churchRequest.isPending ? (
              <ActivityIndicator color="#07182F" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Church Request</Text>
            )}
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
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
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
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  toggleButtonActive: {
    borderColor: '#C98A16',
    backgroundColor: '#FEF3C7',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#647082',
  },
  toggleTextActive: {
    fontWeight: '700',
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
  inputError: {
    borderColor: '#EF4444',
  },
  fieldError: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 2,
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
});

export default RequestChurchScreen;
