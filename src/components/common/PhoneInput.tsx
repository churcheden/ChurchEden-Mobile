import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { ChevronDown, Search, X, Check } from 'lucide-react-native';
import {
  COUNTRIES,
  popularCountries,
  getCountry,
} from '../../lib/phone';

export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  countryIso: string;
  onChangeCountry: (iso: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string | null;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
}

export function PhoneInput({
  value,
  onChangeText,
  countryIso,
  onChangeCountry,
  onBlur,
  onFocus,
  error,
  placeholder,
  editable = true,
  autoFocus = false,
}: PhoneInputProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');

  const country = getCountry(countryIso) ?? getCountry('GH')!;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q) ||
        c.dialCode.includes(q),
    );
  }, [query]);

  const popular = popularCountries();

  const selectCountry = (iso: string) => {
    onChangeCountry(iso);
    setPickerOpen(false);
    setQuery('');
  };

  return (
    <>
      <View style={[styles.wrap, error ? styles.wrapError : null]}>
        <TouchableOpacity
          style={styles.countryButton}
          activeOpacity={0.7}
          onPress={() => editable && setPickerOpen(true)}
        >
          <Text style={styles.countryFlag}>{country.flag}</Text>
          <Text style={styles.dialCode}>{country.dialCode}</Text>
          <ChevronDown size={15} color="#647082" strokeWidth={2.2} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={placeholder ?? 'Phone number'}
          placeholderTextColor="#8A95A5"
          keyboardType="phone-pad"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          onFocus={onFocus}
          editable={editable}
          autoFocus={autoFocus}
        />
      </View>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPickerOpen(false)}
                activeOpacity={0.7}
              >
                <X size={20} color="#647082" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchWrap}>
              <Search size={17} color="#8A95A5" strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search country or code"
                placeholderTextColor="#8A95A5"
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            {query.trim() ? null : (
              <View style={styles.popularSection}>
                <Text style={styles.sectionLabel}>POPULAR</Text>
                <View style={styles.popularRow}>
                  {popular.map((c) => {
                    const active = c.iso === country.iso;
                    return (
                      <TouchableOpacity
                        key={c.iso}
                        style={[styles.popularChip, active ? styles.popularChipActive : null]}
                        activeOpacity={0.7}
                        onPress={() => selectCountry(c.iso)}
                      >
                        <Text style={styles.popularFlag}>{c.flag}</Text>
                        <Text style={[styles.popularName, active ? styles.popularNameActive : null]}>
                          {c.name}
                        </Text>
                        <Text style={[styles.popularDial, active ? styles.popularDialActive : null]}>
                          {c.dialCode}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.iso}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={20}
              renderItem={({ item }) => {
                const active = item.iso === country.iso;
                return (
                  <TouchableOpacity
                    style={styles.row}
                    activeOpacity={0.7}
                    onPress={() => selectCountry(item.iso)}
                  >
                    <Text style={styles.rowFlag}>{item.flag}</Text>
                    <Text style={styles.rowName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.rowDial}>{item.dialCode}</Text>
                    {active ? (
                      <Check size={18} color="#C98A16" strokeWidth={2.5} />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.empty}>
                  No countries match {`"${query}"`}.
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  wrapError: {
    borderColor: '#EF4444',
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 12,
    paddingRight: 10,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    backgroundColor: '#F1F2F4',
  },
  countryFlag: {
    fontSize: 18,
  },
  dialCode: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#07182F',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#07182F',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(7,24,47,0.5)',
  },
  modalSheet: {
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#07182F',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#07182F',
    paddingVertical: 0,
  },
  popularSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A95A5',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  popularRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  popularChipActive: {
    borderColor: '#C98A16',
    backgroundColor: '#FEF3C7',
  },
  popularFlag: {
    fontSize: 14,
  },
  popularName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#647082',
  },
  popularNameActive: {
    color: '#07182F',
    fontWeight: '700',
  },
  popularDial: {
    fontSize: 12,
    color: '#8A95A5',
  },
  popularDialActive: {
    color: '#C98A16',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEF1F4',
  },
  rowFlag: {
    fontSize: 18,
    width: 26,
  },
  rowName: {
    flex: 1,
    fontSize: 15,
    color: '#07182F',
  },
  rowDial: {
    fontSize: 14,
    color: '#647082',
    marginRight: 6,
  },
  empty: {
    textAlign: 'center',
    color: '#8A95A5',
    fontSize: 14,
    paddingVertical: 24,
  },
});

export default PhoneInput;
