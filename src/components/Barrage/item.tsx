import React, { FC, memo, useEffect, } from "react";
import { Animated, Easing, Text } from "react-native";
import { viewportWidth } from "@/utils/index";
import { IBarrage, Message } from ".";
import useIsMountedRef from "@/utils/useIsMountedRef";


interface IProps {
    data: IBarrage;
    // outside: (data: Message) => void;
    delteRef: React.MutableRefObject<{
        key: boolean;
        outside: (data: IBarrage) => void;
    }>
}

const Item: FC<IProps> = memo((props) => {
    const { data, delteRef } = props;
    const translateX = new Animated.Value(0);
    const width = data.title.length * 15;
    const isMountedRef = useIsMountedRef();
    useEffect(() => {
        if (isMountedRef.current) {
            Animated.timing(translateX, {
                toValue: 10,
                duration: 8000,
                useNativeDriver: true,
                easing: Easing.linear
            }).start(({ finished }) => {
                if (finished) {
                    delteRef.current.outside(data);
                }
            });
            translateX.addListener(({ value }) => {
                if (value > 3) {
                    data.isFree = true;
                }
            });
        };
        return () => {
            isMountedRef.current = false;
        }
    }, []);

    return (
        <Animated.View
            style={{
                position: "absolute",
                top: data.trackIndex * 30,
                transform: [
                    {
                        translateX: translateX.interpolate({
                            inputRange: [0, 10],
                            outputRange: [viewportWidth, -width]
                        })
                    }
                ],
            }}
        >
            <Text>{data.title}</Text>
        </Animated.View>
    );
});


export default Item;