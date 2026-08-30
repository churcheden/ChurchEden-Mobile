import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { ShieldCheck } from "lucide-react-native";
import { router } from "expo-router";

function CelebrationG({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#10B981"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
    </Svg>
  );
}

export function ChurchRequestConfirmationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CelebrationG size={120} />

        <Text style={styles.title}>Church Request Submitted</Text>
        <Text style={styles.subtitle}>
          Your church request has been successfully received. We'll review it
          and get back to you soon.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>What happens next:</Text>

        <View style={styles.nextSteps}>
          <View style={styles.step}>
            <ShieldCheck size={20} color="#10B981" />
            <Text style={styles.stepText}>
              Our team will verify the information provided
            </Text>
          </View>
          <View style={styles.step}>
            <ShieldCheck size={20} color="#10B981" />
            <Text style={styles.stepText}>
              Approval typically within 2-3 business days
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 32,
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#07182F",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#647082",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#07182F",
    marginBottom: 8,
  },
  nextSteps: {
    marginVertical: 16,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  stepText: {
    fontSize: 14,
    color: "#334155",
  },
  primaryButton: {
    width: "100%",
    padding: 14,
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    marginTop: 24,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});