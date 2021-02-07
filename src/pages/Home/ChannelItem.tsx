import { IChannel } from "@/models/home";
import React, { FC, memo } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Icon from "@/assets/iconfont/index";
import Touchable from "@/components/Touchable";
interface Iprops {
    data: IChannel;
    onPress: (data: IChannel) => void;
}

const ChannelItem: FC<Iprops> = (props) => {
    const { data, onPress } = props;
    const handlePress = () => {
        if (typeof onPress === "function") {
            onPress(data);
        };
    };
    return (
        <Touchable onPress={handlePress}>
            <View style={styles.container}>
                <Image source={{ uri: data.image }} style={styles.image} />
                <View style={styles.rightContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {data.title}
                    </Text>
                    <Text numberOfLines={2} style={styles.remark}>
                        {data.remark}
                    </Text>
                    <View style={styles.bottom}>
                        <View style={styles.playedView}>
                            <Icon name="icon-V" size={14} />
                            <Text style={styles.number}>{data.played}</Text>
                        </View>
                        <View style={styles.playingView}>
                            <Icon name="icon-shengyin" size={14} />
                            <Text style={styles.number}>{data.playing}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Touchable>
    );
};


const ChannelItemMemo = memo(ChannelItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        margin: 10,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        //安卓不支持
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        //安卓支持
        // elevation:5
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: "#dedede",
        marginRight: 10
    },
    rightContainer: {
        flex: 1,
        justifyContent: "space-around"
    },
    title: {
        fontSize: 16,
        marginBottom: 10,
    },
    remark: {
        backgroundColor: "#f8f8f8",
        padding: 5,
        marginBottom: 5
    },
    bottom: {
        flexDirection: "row",
    },
    playedView: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20
    },
    playingView: {
        flexDirection: "row",
        alignItems: "center",
    },
    number: {
        marginLeft: 5
    }
});


export default ChannelItemMemo;