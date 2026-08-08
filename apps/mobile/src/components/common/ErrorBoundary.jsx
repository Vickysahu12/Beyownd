import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught Error Boundary Catch:", error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Ionicons name="warning-outline" size={48} color="#EF4444" />
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected error occurred. Don't worry, your data is safe.
            </Text>
            <Pressable style={styles.btn} onPress={this.handleRestart}>
              <Text style={styles.btnText}>Restart Screen</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    gap: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 13,
    textAlign: "center",
    maxWidth: 280,
  },
  btn: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});