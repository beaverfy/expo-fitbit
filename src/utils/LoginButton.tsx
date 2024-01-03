import { TouchableWithoutFeedback } from "react-native";
import { useFitbitProvider } from "./provider"
import React, { PropsWithChildren } from "react";

/**
 * React component that wraps children with a `TouchableWithoutFeedback` that opens fitbit oauth prompt when clicked
 */
export function LoginButton({ children }: PropsWithChildren) {
    const { promptAsync } = useFitbitProvider();
    return (
        <TouchableWithoutFeedback onPress={() => promptAsync()} aria-label="Login with Fitbit">
            {children}
        </TouchableWithoutFeedback>
    )
}