import Touchable from "@/components/Touchable";
import { IProgram } from "@/models/album";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "@/assets/iconfont/index";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

interface IProps {
    data: IProgram;
    index: number;
    onPress: (data: IProgram, index: number) => void;
}

const Item: FC<IProps> = (props) => {
    const { data, index, onPress } = props;

    const handlePress = () => {
        onPress(data, index);
    };

    return (
        <Touchable style={styles.item} onPress={handlePress}>
            <Text style={styles.serial}>
                {index + 1}
            </Text>
            <View style={styles.content}>
                <Text style={styles.title}>
                    {data.title}
                </Text>
                <View style={styles.info}>
                    <View style={styles.iconView}>
                        <Icon name="icon-V" color="#939393" />
                        <Text style={styles.iconText}>
                            {data.playVolume}
                        </Text>
                    </View>
                    <View style={styles.iconView}>
                        <Icon name="icon-time" color="#939393" />
                        <Text style={styles.iconText}>
                            {data.duration}
                        </Text>
                    </View>
                </View>
            </View>
            <Text style={styles.date}>{data.data}</Text>
        </Touchable>
    )
};

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        padding: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#e3e3e3",
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        flex: 1,
        marginHorizontal: 25
    },
    serial: {
        fontSize: 14,
        color: "#838383",
        fontWeight: "800"
    },
    title: {
        fontWeight: "500",
        marginBottom: 15
    },
    info: {
        flexDirection: "row"
    },
    iconView: {
        flexDirection: "row",
        marginRight: 10
    },
    iconText: {
        marginHorizontal: 5,
        color: "#939393"
    },
    date: {
        color: "#939393"
    }
});


export default Item;