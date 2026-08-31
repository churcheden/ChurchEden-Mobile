import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import {
  Check,
  FileSearch,
  Clock,
  Mail,
  Phone,
  MapPin,
  Church as ChurchIcon,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});
const bodyFont = Platform.select({
  ios: "Inter-Regular",
  android: "sans-serif",
  default: "sans-serif",
});
const boldFont = Platform.select({
  ios: "Inter-Bold",
  android: "sans-serif-medium",
  default: "sans-serif",
});

type SummaryField = { label: string; value: string; icon: React.ReactNode };

export function ChurchRequestConfirmationScreen() {
  const params = useLocalSearchParams<{
    churchName?: string;
    city?: string;
    leaderName?: string;
    contactMode?: string;
    phone?: string;
    email?: string;
  }>();

  const churchName = params.churchName || "your church";
  const contactMode = params.contactMode;
  const hasPhone = contactMode === "phone" && !!params.phone;
  const hasEmail = contactMode === "email" && !!params.email;

  const summaryFields: SummaryField[] = [
    {
      label: "Church Name",
      value: churchName,
      icon: <ChurchIcon size={16} color="#667085" strokeWidth={2.2} />,
    },
  ];

  if (hasPhone) {
    summaryFields.push({
      label: "Phone",
      value: params.phone as string,
      icon: <Phone size={16} color="#667085" strokeWidth={2.2} />,
    });
  } else if (hasEmail) {
    summaryFields.push({
      label: "Email",
      value: params.email as string,
      icon: <Mail size={16} color="#667085" strokeWidth={2.2} />,
    });
  }

  if (params.city) {
    summaryFields.push({
      label: "Location",
      value: params.city,
      icon: <MapPin size={16} color="#667085" strokeWidth={2.2} />,
    });
  }

  const handleDone = () => {
    router.dismissTo("/(tabs)");
  };

  const handleSubmitAnother = () => {
    router.replace("/request-church");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Success badge — gold ring checkmark */}
        <View style={styles.iconCircle}>
          <Check size={40} color="#C98A16" strokeWidth={3} />
        </View>

        {/* Heading */}
        <Text style={styles.title}>Church Request Submitted</Text>
        <Text style={styles.subtitle}>
          Your church request has been received. We&apos;ll review the details
          below and be in touch with you shortly.
        </Text>

        {/* Submission summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>What you submitted</Text>
          <View style={styles.divider} />
          {summaryFields.map((field, index) => (
            <React.Fragment key={field.label}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>{field.icon}</View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>{field.label}</Text>
                  <Text style={styles.infoValue}>{field.value}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* What happens next */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What happens next</Text>

          <View style={styles.stepCard}>
            <View style={styles.stepIcon}>
              <FileSearch size={20} color="#3A4A63" strokeWidth={2.2} />
            </View>
            <Text style={styles.stepText}>
              Our team will verify the information provided
            </Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepIcon}>
              <Clock size={20} color="#3A4A63" strokeWidth={2.2} />
            </View>
            <Text style={styles.stepText}>
              Approval typically within 2-3 business days
            </Text>
          </View>

          <View style={styles.afterCard}>
            <Text style={styles.afterText}>
              You&apos;ll get a notification the moment your church is approved,
              and can start using ChurchEden right away.
            </Text>
          </View>
        </View>

        {/* Bottom actions */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleDone} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleSubmitAnother} activeOpacity={0.7}>
          <Text style={styles.secondaryButtonText}>Submit another church request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F0E8",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 30,
    alignItems: "center",
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FAF7F2",
    borderWidth: 2,
    borderColor: "#E8D5B5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#C98A16",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#07182F",
    fontFamily: serifFont,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15.5,
    color: "#475569",
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 28,
    fontFamily: bodyFont,
    paddingHorizontal: 4,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ECE7DF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#667085",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontFamily: boldFont,
    paddingVertical: 12,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEBE3",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F5F0E8",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8A99AD",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: boldFont,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#172033",
    marginTop: 3,
    fontFamily: boldFont,
  },
  section: {
    width: "100%",
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#667085",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontFamily: boldFont,
    marginBottom: 12,
    marginLeft: 4,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#EEEAE2",
    marginBottom: 10,
    width: "100%",
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5ECD7",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    flex: 1,
    fontSize: 14.5,
    color: "#334155",
    fontFamily: bodyFont,
    lineHeight: 20,
    fontWeight: "500",
  },
  afterCard: {
    backgroundColor: "#FAF7F2",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1EAE0",
    width: "100%",
    marginTop: 2,
  },
  afterText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    textAlign: "center",
    fontFamily: bodyFont,
  },
  primaryButton: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: "#C98A16",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#C98A16",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#07182F",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: boldFont,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 4,
    alignSelf: "center",
  },
  secondaryButtonText: {
    color: "#3A4A63",
    fontSize: 14.5,
    fontWeight: "600",
    fontFamily: boldFont,
    textDecorationLine: "underline",
  },
});
