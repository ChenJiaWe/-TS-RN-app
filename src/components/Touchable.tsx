import _ from "lodash";
import React, { FC, memo, useCallback } from "react";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";


const Touchable: FC<TouchableOpacityProps> = memo((props) => {
    const { style, onPress, ...rest } = props;
    const touchableStyle = rest.disabled ? [style, styles.disabled] : style;
    let throttleOnPress = undefined;
    if (typeof onPress === "function") {
        throttleOnPress = useCallback(_.throttle(onPress, 1000, {
            //节流之前执行
            leading: true,
            trailing: false
        }), [onPress]);
    };
    return (
        <TouchableOpacity activeOpacity={0.8} {...rest} style={touchableStyle} onPress={throttleOnPress} />
    )
});

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.5
    }
})

export default Touchable;