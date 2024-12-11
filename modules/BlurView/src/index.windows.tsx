import { forwardRef } from "react";
import { PlatformColor, View } from "react-native";
import type { BlurViewProps } from "./index.types";

export const BlurView = forwardRef<View, BlurViewProps>((props, ref) => {
    return <View {...props} ref={ref} style={[props.style, {
        backgroundColor: PlatformColor('SystemControlAcrylicWindowBrush'),
    }]} />
});

const ComponentName = 'BlurView';

BlurView.displayName = ComponentName
