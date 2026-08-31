import profileService from '../services/profileService';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Image,
} from 'react-native';
import {
  ChevronLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Home,
  User,
  Users,
  Briefcase,
  Heart,
  Camera,
  Check,
  ArrowRight,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import churchService from '../services/churchService';
import { loadProfileDraft, saveProfileDraft } from '../services/profileStorage';
import { setSelectedChurchId } from '../services/selectedChurchStore';

const GENDERS = ['Male', 'Female', 'Prefer not to say'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ProfileForm {
  fullName: string;
  photoUri: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  city: string;
  fullAddress: string;
  maritalStatus: string;
  occupation: string;
}

const EMPTY_FORM: ProfileForm = {
  fullName: '',
  photoUri: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  city: '',
  fullAddress: '',
  maritalStatus: '',
  occupation: '',
};

// Y/M/D selection for the lightweight date picker
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 90 }, (_, i) => new Date().getFullYear() - i);

export function CompleteProfileScreen() {
  const params = useLocalSearchParams<{ churchId?: string }>();
  const churchId = params.churchId || 'church_1';

  const [churchName, setChurchName] = useState('Your Church');
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const draftDate = useRef({ day: 1, month: 0, year: new Date().getFullYear() - 30 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await churchService.getChurchById(churchId);
      const name = res.success && res.data ? res.data.name : 'Your Church';
      if (!mounted) return;
      setChurchName(name);
      // Restore any saved progress for this church.
      const draft = await loadProfileDraft(churchId);
      if (draft) {
        setForm((prev) => ({ ...prev, ...draft, photoUri: prev.photoUri || '' }));
        if (draft.gender) setGenderRestored(draft.gender);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [churchId]);

  // Debounced auto-save of progress as the user types.
  const formRef = useRef(form);
  formRef.current = form;
  const saveTimer = useRef<any>(null);
  const autoSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProfileDraft(churchId, { ...formRef.current, churchId });
    }, 400);
  }, [churchId]);

  useEffect(() => {
    autoSave();
  }, [form, autoSave]);

  const setGenderRestored = (g: string) => {
    setForm((prev) => ({ ...prev, gender: g }));
  };

  const setField = (key: keyof ProfileForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // ---- Validation ----
  const validate = useCallback((f: ProfileForm): Record<string, string> => {
    const errs: Record<string, string> = {};

    if (!f.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    } else if (f.fullName.trim().length < 3) {
      errs.fullName = 'Full name must be at least 3 characters.';
    }

    if (!f.dateOfBirth) {
      errs.dateOfBirth = 'Please select your date of birth.';
    } else if (isNaN(Date.parse(f.dateOfBirth))) {
      errs.dateOfBirth = 'Please choose a valid date of birth.';
    }

    const phoneClean = f.phone.replace(/[\s()-]/g, '');
    if (!f.phone.trim()) {
      errs.phone = 'Please enter your phone number.';
    } else if (phoneClean.length < 9 || phoneClean.length > 15) {
      errs.phone = 'Enter a valid phone number with country code.';
    }

    const email = f.email.trim();
    if (!email) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }

    if (!f.city.trim()) {
      errs.city = 'Please enter your city or area.';
    }

    return errs;
  }, []);

  const isFormComplete = (() => {
    const required: (keyof ProfileForm)[] = ['fullName', 'dateOfBirth', 'phone', 'email', 'city'];
    return required.every((k) => (form[k] || '').toString().trim().length > 0);
  })();

  const enterTouchedRequired = (key: keyof ProfileForm) => {
    const v = (form[key] || '').toString();
    if (!v.trim()) {
      setErrors((prev) => ({ ...prev, [key]: `This field is required.` }));
    }
  };

  // ---- Submit ----
  const handleSubmit = async () => {
    Keyboard.dismiss();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      // 1. Submit complete profile to backend
      const profileRes = await profileService.submitCompleteProfile({
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        phoneNumber: form.phone,
        contactEmail: form.email,
        city: form.city,
        address: form.fullAddress || form.city,
        maritalStatus: form.maritalStatus,
        occupation: form.occupation,
        photoUri: form.photoUri,
      });

      if (!profileRes.success) {
        alert(profileRes.error || 'Could not save your profile. Please try again.');
        return;
      }

      // 2. Submit join request to backend
      const response = await churchService.requestToJoinChurch(churchId);
      if (response.success) {
        await saveProfileDraft(churchId, { ...form, churchId });
        await setSelectedChurchId(churchId);
        router.replace({
          pathname: '/pending-approval',
          params: { churchId },
        });
      } else {
        alert(response.error || 'Failed to send your request.');
      }
    } catch (err) {
      alert('Network error while sending your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Photo picker ----
  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Photo library permission is required to upload a profile picture. Please enable access in your device settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setForm((prev) => ({ ...prev, photoUri: result.assets[0].uri }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.photoUri;
        return next;
      });
    }
  };

  // ---- Date picker handlers ----
  const openDatePicker = () => {
    if (form.dateOfBirth) {
      const [y, m, d] = form.dateOfBirth.split('-').map(Number);
      if (y && m && d) draftDate.current = { day: d, month: m - 1, year: y };
    }
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    const { day, month, year } = draftDate.current;
    const validDays = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(day, validDays);
    const value = `${year}-${String(month + 1).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
    setForm((prev) => ({ ...prev, dateOfBirth: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.dateOfBirth;
      return next;
    });
    setShowDatePicker(false);
  };

  const formatDOB = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    return `${d} ${MONTHS[m - 1]} ${y}`;
  };

  const requiredBaseFields = 5;
  const completedCount = (() => {
    const required: (keyof ProfileForm)[] = ['fullName', 'dateOfBirth', 'phone', 'email', 'city'];
    return required.filter((k) => (form[k] || '').toString().trim().length > 0).length;
  })();
  const progressPct = Math.round((completedCount / requiredBaseFields) * 100);

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
        <ChevronLeft size={22} color="#07182F" strokeWidth={2.2} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Complete Your Profile</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      {renderHeader()}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Intro */}
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            This helps {churchName} get to know you before approving your request.
          </Text>

          {/* Progress indicator */}
          <View style={styles.progressBlock}>
            <View style={styles.progressMetaRow}>
              <Text style={styles.progressLabel}>Profile completion</Text>
              <Text style={styles.progressValue}>{progressPct}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
          </View>

          {/* ===== Section 1: Identity ===== */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBadge}>
              <User size={18} color="#C98A16" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Identity</Text>
              <Text style={styles.sectionSubtitle}>Required</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            {/* Photo (optional) */}
            <View style={styles.photoRow}>
              <TouchableOpacity
                style={styles.avatarButton}
                onPress={pickPhoto}
                activeOpacity={0.8}
                accessibilityLabel="Add a photo"
              >
                {form.photoUri ? (
                  <Image source={{ uri: form.photoUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Camera size={22} color="#C98A16" strokeWidth={1.8} />
                  </View>
                )}
                <View style={styles.photoEditCircle}>
                  <Camera size={13} color="#07182F" strokeWidth={2.2} />
                </View>
              </TouchableOpacity>
              <View style={styles.photoTextCol}>
                <Text style={styles.photoLabel}>Profile photo (optional)</Text>
                <Text style={styles.photoHint}>Shown to church members when approved.</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Full name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={[styles.inputWrap, errors.fullName && styles.inputWrapError]}>
                <User size={17} color="#8A95A5" strokeWidth={2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Kofi Mensah"
                  placeholderTextColor="#8A95A5"
                  value={form.fullName}
                  onChangeText={setField('fullName')}
                  onBlur={() => enterTouchedRequired('fullName')}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
            </View>

            {/* Date of birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth *</Text>
              <TouchableOpacity
                style={[styles.inputWrap, errors.dateOfBirth && styles.inputWrapError]}
                onPress={openDatePicker}
                activeOpacity={0.7}
              >
                <Calendar size={17} color="#8A95A5" strokeWidth={2} style={styles.inputIcon} />
                <Text style={form.dateOfBirth ? styles.inputText : styles.inputPlaceholder}>
                  {form.dateOfBirth ? formatDOB(form.dateOfBirth) : 'Select your date of birth'}
                </Text>
              </TouchableOpacity>
              {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}
            </View>

            {/* Gender (optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender (optional)</Text>
              <View style={styles.segmented}>
                {GENDERS.map((g) => {
                  const selected = form.gender === g;
                  return (
                    <TouchableOpacity
                      key={g}
                      style={[styles.segment, selected && styles.segmentActive]}
                      onPress={() => setField('gender')(g)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* ===== Section 2: Contact ===== */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBadge}>
              <Users size={18} color="#C98A16" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Contact Info</Text>
              <Text style={styles.sectionSubtitle}>Required</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={[styles.inputWrap, errors.phone && styles.inputWrapError]}>
                <Phone size={17} color="#8A95A5" strokeWidth={2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. +233 24 123 4567"
                  placeholderTextColor="#8A95A5"
                  value={form.phone}
                  onChangeText={setField('phone')}
                  onBlur={() => enterTouchedRequired('phone')}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <View style={[styles.inputWrap, errors.email && styles.inputWrapError]}>
                <Mail size={17} color="#8A95A5" strokeWidth={2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@email.com"
                  placeholderTextColor="#8A95A5"
                  value={form.email}
                  onChangeText={setField('email')}
                  onBlur={() => enterTouchedRequired('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* City / Area */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>City / Area *</Text>
              <View style={[styles.inputWrap, errors.city && styles.inputWrapError]}>
                <MapPin size={17} color="#8A95A5" strokeWidth={2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Kumasi, Ghana"
                  placeholderTextColor="#8A95A5"
                  value={form.city}
                  onChangeText={setField('city')}
                  onBlur={() => enterTouchedRequired('city')}
                  autoCapitalize="words"
                />
              </View>
              {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
            </View>

            {/* Full address (optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Address (optional)</Text>
              <View style={styles.inputWrap}>
                <Home size={17} color="#8A95A5" strokeWidth={2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Street, house number, landmark..."
                  placeholderTextColor="#8A95A5"
                  value={form.fullAddress}
                  onChangeText={setField('fullAddress')}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>

          {/* ===== Section 3: Church context ===== */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBadge}>
              <Heart size={18} color="#C98A16" strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Church Context</Text>
              <Text style={styles.sectionSubtitle}>Optional · helps admin approve faster</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            {/* Marital status */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Marital Status (optional)</Text>
              <View style={styles.optionWrap}>
                {MARITAL_STATUSES.map((ms) => {
                  const selected = form.maritalStatus === ms;
                  return (
                    <TouchableOpacity
                      key={ms}
                      style={[styles.optionChip, selected && styles.optionChipActive]}
                      onPress={() => setField('maritalStatus')(selected ? '' : ms)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.optionChipText, selected && styles.optionChipTextActive]}>
                        {ms}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Occupation */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Occupation (optional)</Text>
              <View style={styles.inputWrap}>
                <Briefcase size={17} color="#8A95A5" strokeWidth={2} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Software Engineer, Teacher"
                  placeholderTextColor="#8A95A5"
                  value={form.occupation}
                  onChangeText={setField('occupation')}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>

          {/* Footer button block */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, (!isFormComplete || isSubmitting) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormComplete || isSubmitting}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Send Join Request"
            >
              <Text
                style={[
                  styles.submitButtonText,
                  (!isFormComplete || isSubmitting) && styles.submitButtonTextDisabled,
                ]}
              >
                Send Join Request
              </Text>
              <ArrowRight size={18} color={isFormComplete && !isSubmitting ? '#07182F' : '#9AA5B1'} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.helperText}>
              You can update this information anytime after joining.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date picker modal */}
      <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.dateSheet}>
            <Text style={styles.dateSheetTitle}>Date of Birth</Text>
            <View style={styles.dateColumns}>
              <View style={styles.dateCol}>
                <Text style={styles.dateColLabel}>Day</Text>
                <ScrollView
                  style={styles.dateScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.dateScrollContent}
                >
                  {DAYS.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.dateItem, draftDate.current.day === d && styles.dateItemActive]}
                      onPress={() => (draftDate.current = { ...draftDate.current, day: d })}
                    >
                      <Text style={[styles.dateItemText, draftDate.current.day === d && styles.dateItemTextActive]}>
                        {String(d).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateCol}>
                <Text style={styles.dateColLabel}>Month</Text>
                <ScrollView
                  style={styles.dateScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.dateScrollContent}
                >
                  {MONTHS.map((m, idx) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.dateItem, draftDate.current.month === idx && styles.dateItemActive]}
                      onPress={() => (draftDate.current = { ...draftDate.current, month: idx })}
                    >
                      <Text style={[styles.dateItemText, draftDate.current.month === idx && styles.dateItemTextActive]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateCol}>
                <Text style={styles.dateColLabel}>Year</Text>
                <ScrollView
                  style={styles.dateScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.dateScrollContent}
                >
                  {YEARS.map((y) => (
                    <TouchableOpacity
                      key={y}
                      style={[styles.dateItem, draftDate.current.year === y && styles.dateItemActive]}
                      onPress={() => (draftDate.current = { ...draftDate.current, year: y })}
                    >
                      <Text style={[styles.dateItemText, draftDate.current.year === y && styles.dateItemTextActive]}>
                        {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.dateActions}>
              <TouchableOpacity style={styles.dateCancelButton} onPress={() => setShowDatePicker(false)} activeOpacity={0.8}>
                <Text style={styles.dateCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateConfirmButton} onPress={confirmDate} activeOpacity={0.8}>
                <Check size={16} color="#07182F" strokeWidth={2.5} />
                <Text style={styles.dateConfirmText}>Set Date</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontFamily: Platform.select({ ios: 'Inter-Bold', android: 'sans-serif-medium', default: 'sans-serif' }),
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#07182F',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#647082',
    lineHeight: 21,
    fontFamily: Platform.select({ ios: 'Inter-Regular', android: 'sans-serif', default: 'sans-serif' }),
    marginBottom: 20,
  },
  progressBlock: {
    marginBottom: 24,
  },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C98A16',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E7DFD2',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#C98A16',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    marginTop: 6,
  },
  sectionIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF7F2',
    borderWidth: 1.5,
    borderColor: '#E8D5B5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#07182F',
    fontFamily: Platform.select({ ios: 'Inter-Bold', android: 'sans-serif-medium', default: 'sans-serif' }),
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#8A95A5',
    fontFamily: Platform.select({ ios: 'Inter-Regular', android: 'sans-serif', default: 'sans-serif' }),
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    gap: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1EBE1',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#07182F',
    fontFamily: Platform.select({ ios: 'Inter-SemiBold', android: 'sans-serif-medium', default: 'sans-serif' }),
  },
  inputWrap: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  inputWrapError: {
    borderColor: '#DC2626',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: '#07182F',
    height: '100%',
  },
  inputText: {
    fontSize: 14.5,
    color: '#07182F',
  },
  inputPlaceholder: {
    fontSize: 14.5,
    color: '#8A95A5',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 2,
  },
  segmented: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  segmentActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#C98A16',
  },
  segmentText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  segmentTextActive: {
    color: '#8A5A00',
    fontWeight: '700',
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  optionChipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#C98A16',
  },
  optionChipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  optionChipTextActive: {
    color: '#8A5A00',
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FAF7F2',
    borderWidth: 1.5,
    borderColor: '#E8D5B5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  photoEditCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C98A16',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoTextCol: {
    flex: 1,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#07182F',
    marginBottom: 2,
  },
  photoHint: {
    fontSize: 12,
    color: '#8A95A5',
    lineHeight: 16,
  },
  footer: {
    marginTop: 8,
    gap: 12,
  },
  submitButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#C98A16',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#C98A16',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#E7DFD2',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#07182F',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Inter-Bold', android: 'sans-serif-medium', default: 'sans-serif' }),
  },
  submitButtonTextDisabled: {
    color: '#9AA5B1',
  },
  helperText: {
    fontSize: 12.5,
    color: '#8A95A5',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Inter-Regular', android: 'sans-serif', default: 'sans-serif' }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 24, 47, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dateSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  dateSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#07182F',
    textAlign: 'center',
    marginBottom: 14,
  },
  dateColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  dateCol: {
    flex: 1,
  },
  dateColLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A95A5',
    marginBottom: 6,
    textAlign: 'center',
  },
  dateScroll: {
    maxHeight: 220,
  },
  dateScrollContent: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  dateItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  dateItemActive: {
    backgroundColor: '#FEF3C7',
  },
  dateItemText: {
    fontSize: 15,
    color: '#475569',
  },
  dateItemTextActive: {
    color: '#8A5A00',
    fontWeight: '700',
  },
  dateActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  dateCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCancelText: {
    color: '#647082',
    fontSize: 14.5,
    fontWeight: '600',
  },
  dateConfirmButton: {
    flex: 1.2,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#C98A16',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dateConfirmText: {
    color: '#07182F',
    fontSize: 14.5,
    fontWeight: '700',
  },
});

export default CompleteProfileScreen;
