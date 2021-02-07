import { IFound } from "@/models/found";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import VideoControl from 'react-native-video-custom-controls';

interface IProps {
    data: IFound;
    setCurrentId: (id: string) => void;
    paused: boolean;
};



const Item: FC<IProps> = (props) => {
    const { data, setCurrentId, paused } = props;
    const onPlay = () => {
        setCurrentId(data.id);
    };
    const onPause = () => {
        setCurrentId("");
    };
    return (
        <View>
            <Text>
                {data.title}
            </Text>
            <VideoControl
                paused={paused}
                source={{ uri: data.videoUrl }}
                style={styles.video}
                onPlay={onPlay}
                onPause={onPause}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    video: {
        height: 220
    }
});

export default Item;