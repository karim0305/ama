import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { AssistantState } from "../../types/commands";

const { width } = Dimensions.get("window");
const CENTER = width / 2;

interface MenuOption {
  key: string;
  icon: string;
  angle: number; // degrees, 0 = right, 90 = down
  onPress: () => void;
}

interface Props {
  state: AssistantState;
  onMicPress: () => void;
  onTextPress: () => void;
  onLanguagePress: () => void;
  onSettingsPress: () => void;
}

const RADIUS = 100;

export default function FloatingButton({
  state,
  onMicPress,
  onTextPress,
  onLanguagePress,
  onSettingsPress,
}: Props) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);
  const pulse = useSharedValue(1);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    progress.value = withSpring(next ? 1 : 0, { damping: 14, stiffness: 160 });
  };

  React.useEffect(() => {
    if (state === "LISTENING") {
      pulse.value = withTiming(1.15, { duration: 500 }, () => {
        pulse.value = withTiming(1, { duration: 500 });
      });
    }
  }, [state]);

  const mainButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 45])}deg` },
      { scale: pulse.value },
    ],
  }));

  const options: MenuOption[] = [
    { key: "mic", icon: "🎤", angle: 200, onPress: onMicPress },
    { key: "text", icon: "⌨️", angle: 245, onPress: onTextPress },
    { key: "lang", icon: "🌐", angle: 290, onPress: onLanguagePress },
    { key: "settings", icon: "⚙️", angle: 335, onPress: onSettingsPress },
  ];

  return (
    <View style={styles.container} pointerEvents="box-none">
      {options.map((opt) => (
        <OptionBubble
          key={opt.key}
          option={opt}
          progress={progress}
          open={open}
        />
      ))}

      <Pressable onPress={toggle} style={styles.mainButtonWrapper}>
        <Animated.View
          style={[styles.mainButton, mainButtonStyle, stateColor(state)]}
        >
          <Text style={styles.mainIcon}>{open ? "✕" : "○"}</Text>
        </Animated.View>
      </Pressable>

      <Text style={styles.label}>{stateLabel(state)}</Text>
    </View>
  );
}

function OptionBubble({
  option,
  progress,
  open,
}: {
  option: MenuOption;
  progress: SharedValue<number>; // <-- changed from Animated.SharedValue<number>
  open: boolean;
}) {
  const style = useAnimatedStyle(() => {
    const rad = (option.angle * Math.PI) / 180;
    const dist = interpolate(progress.value, [0, 1], [0, RADIUS]);
    return {
      transform: [
        { translateX: Math.cos(rad) * dist },
        { translateY: Math.sin(rad) * dist },
        { scale: progress.value },
      ],
      opacity: progress.value,
    };
  });

  return (
    <Animated.View
      style={[styles.optionBubble, style]}
      pointerEvents={open ? "auto" : "none"}
    >
      <Pressable onPress={option.onPress} style={styles.optionInner}>
        <Text style={styles.optionIcon}>{option.icon}</Text>
      </Pressable>
    </Animated.View>
  );
}

function stateColor(state: AssistantState) {
  switch (state) {
    case "LISTENING":
      return { backgroundColor: "#E8734A" };
    case "PROCESSING":
    case "EXECUTING":
      return { backgroundColor: "#8B7CF6" };
    case "SUCCESS":
      return { backgroundColor: "#3FB27F" };
    case "ERROR":
      return { backgroundColor: "#E4574C" };
    default:
      return { backgroundColor: "#4C3AE3" };
  }
}

function stateLabel(state: AssistantState) {
  switch (state) {
    case "LISTENING":
      return "Listening...";
    case "PROCESSING":
      return "Processing...";
    case "EXECUTING":
      return "Executing...";
    case "SUCCESS":
      return "Done";
    case "ERROR":
      return "Error";
    default:
      return "AI Assistant";
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    left: CENTER - 32,
    alignItems: "center",
  },
  mainButtonWrapper: { zIndex: 10 },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  mainIcon: { fontSize: 26, color: "white" },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  optionBubble: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  optionInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  optionIcon: { fontSize: 20 },
});
