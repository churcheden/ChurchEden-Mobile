import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppTheme } from '../../src/constants/appTheme';
import {
  loadProfileDraft,
  saveProfileDraft,
  ProfileDraft,
} from '../../src/services/profileStorage';
import { loadMemberProfile, toOverview } from '../../src/services/profileService';
import { useAuth } from '../../src/hooks/useAuth';
import { ChevronLeft, Check } from 'lucide-react-native';

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const MARITAL = ['Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'];

export default function PersonalInformationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ churchId?: string }>();
  const churchId = params.churchId || 'church_1';
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileDraft>({});

  useEffect(() => {
    const init = async () => {
      const [draft, profileRes] = await Promise.all([
        loadProfileDraft(churchId),
        loadMemberProfile(user?.avatarUrl),
      ]);
      const overview = profileRes.success ? toOverview(profileRes.data, user?.avatarUrl) : null;
      setForm((prev) => ({
        ...prev,
        ...(draft || {}),
        fullName: draft?.fullName || overview?.fullName || '',
        email: draft?.email ?? overview?.email ?? '',
        phone: draft?.phone ?? overview?.phone ?? '',
      }));
      setLoading(false);
    };
    init();
  }, [churchId, user?.avatarUrl]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfileDraft(churchId, form);
      Alert.alert('Saved', 'Your personal information has been updated.');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof ProfileDraft, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={22} color={AppTheme.navy} strokeWidth={2.2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Information</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <View style={styles.centerFill}>
            <ActivityIndicator color={AppTheme.gold} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageSubtitle}>
              These details help us serve you better within your church community.
            </Text>

            <Field label="Full Name">
              <TextInput
                style={styles.input}
                value={form.fullName}
                onChangeText={(v) => set('fullName', v)}
                placeholder="Your full name"
                placeholderTextColor={AppTheme.textFaint}
              />
            </Field>

            <Field label="Date of Birth">
              <TextInput
                style={styles.input}
                value={form.dateOfBirth}
                onChangeText={(v) => set('dateOfBirth', v)}
                placeholder="e.g. 1990-01-15"
                placeholderTextColor={AppTheme.textFaint}
              />
            </Field>

            <ChipSelector
              label="Gender"
              options={GENDERS}
              value={form.gender}
              onSelect={(v) => set('gender', v)}
            />

            <ChipSelector
              label="Marital Status"
              options={MARITAL}
              value={form.maritalStatus}
              onSelect={(v) => set('maritalStatus', v)}
            />

            <Field label="Occupation">
              <TextInput
                style={styles.input}
                value={form.occupation}
                onChangeText={(v) => set('occupation', v)}
                placeholder="Your occupation"
                placeholderTextColor={AppTheme.textFaint}
              />
            </Field>

            <Field label="Phone Number">
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(v) => set('phone', v)}
                placeholder="+233 ..."
                placeholderTextColor={AppTheme.textFaint}
                keyboardType="phone-pad"
              />
            </Field>

            <Field label="Email">
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(v) => set('email', v)}
                placeholder="you@example.com"
                placeholderTextColor={AppTheme.textFaint}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Field>

            <Field label="City">
              <TextInput
                style={styles.input}
                value={form.city}
                onChangeText={(v) => set('city', v)}
                placeholder="Your city"
                placeholderTextColor={AppTheme.textFaint}
              />
            </Field>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Save personal information"
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Check size={20} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function ChipSelector({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value?: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(opt)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppTheme.navy,
    fontFamily: 'Inter-Bold',
  },
  headerSpacer: {
    width: 40,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  pageSubtitle: {
    fontSize: 14,
    color: AppTheme.textMuted,
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
  },
  field: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: AppTheme.textSecondary,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    height: 50,
    borderRadius: 14,
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.surfaceBorder,
    paddingHorizontal: 14,
    fontSize: 15,
    color: AppTheme.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.surfaceBorder,
  },
  chipActive: {
    backgroundColor: AppTheme.gold,
    borderColor: AppTheme.gold,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppTheme.textSecondary,
    fontFamily: 'Inter-SemiBold',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: AppTheme.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: AppTheme.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  bottomSpacer: {
    height: 8,
  },
});
