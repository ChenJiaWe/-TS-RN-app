import React, { FC, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "react-native-slider-x";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";
import { formatTime } from "@/utils/index";

const mapStateToProps = ({ player }: RootState) => {
    return {
        currentTime: player.currentTime,
        duration: player.duration
    };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;


interface IProps extends ModelState {
};




const PlaySlider: FC<IProps> = (props) => {
    const { currentTime, duration, dispatch } = props;
    const renderThumb = () => {
        // console.log(formatTime(currentTime) + "/" + formatTime(duration));
        return (
            <View>
                <Text style={styles.text}>
                    {formatTime(currentTime)}/{formatTime(duration)}
                </Text>
            </View>
        );
    };
    const onValueChange = (value: number) => {
        dispatch({
            type: "player/setCurrentTime",
            payload: {
                currentTime: value
            }
        });
    };
    return (
        <View style={styles.container}>
            <Slider
                value={currentTime}
                maximumValue={duration}
                //未播放进度条的颜色
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                //已经播放的进度条
                minimumTrackTintColor="white"
                renderThumb={renderThumb}
                thumbStyle={styles.thumb}
                onValueChange={onValueChange}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
    thumb: {
        backgroundColor: "#fff",
        width: 76,
        height: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 10
    }
});

export default connector(PlaySlider);