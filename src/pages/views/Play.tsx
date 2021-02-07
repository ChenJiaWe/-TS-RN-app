import Touchable from "@/components/Touchable";
import React, { FC, useEffect } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import Icon from "@/assets/iconfont/index";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";
import Progress from "./Progress";



const mapStateToProps = ({ player }: RootState) => {
    return {
        thumbnailUrl: player.thumbnailUrl,
        playState: player.playState
    };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
    onPress?: () => void;
};


const Play: FC<IProps> = (props) => {
    const { thumbnailUrl = "", playState, onPress } = props;
    const anim = new Animated.Value(0);
    let timing = Animated.loop(Animated.timing(anim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
        easing: Easing.linear
    }), { iterations: -1 });
    let rotate: Animated.AnimatedInterpolation = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    });
    useEffect(() => {
        if (playState === "playing") {
            timing.start();
        } else if (playState === "paused") {
            timing.stop();
        };
    }, [playState]);

    const handlePress = () => {
        if (onPress && thumbnailUrl) {
            onPress();
        };
    };

    return (
        <Touchable style={styles.play} onPress={handlePress}>
            <Progress>
                <Animated.View
                    style={
                        { transform: [{ rotate: rotate }] }}
                >
                    {
                        thumbnailUrl.length > 0 ?
                            <Image
                                style={styles.image}
                                source={{ uri: thumbnailUrl }} /> : <Icon
                                name="icon-bofang3"
                                color="#ededed"
                                size={40}
                            />
                    }
                </Animated.View>
            </Progress>
        </Touchable>
    );
};


const styles = StyleSheet.create({
    play: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 42,
        height: 42,
        borderRadius: 21
    }
});

export default connector(Play);