import realm, { IProgram } from "@/config/realm";
import React, { FC, useEffect, useRef, useState, } from "react";
import { Text, View, Button, FlatList, ListRenderItemInfo, StyleSheet, Image } from "react-native";
import { RootStackNavigation } from "../navigator";
import Icon from "@/assets/iconfont/index";
import { formatTime } from "../utils";
import Touchable from "@/components/Touchable";

interface IProps {
    navigation: RootStackNavigation;
}


const Listen: FC<IProps> = (props) => {
    const { navigation } = props;
    const [_, setState] = useState({});
    const programs = realm.objects<IProgram>("Program");
    const deleteBtn = (item: IProgram) => {
        realm.write(() => {
            const program = realm.objects("Program")
                .filtered(`id="${item.id}"`);
            console.log(program)
            realm.delete(program);
            setState({});
        });
    };
    const renderItem = ({ item }: ListRenderItemInfo<IProgram>) => {
        console.log(item);
        return (
            <View style={styles.item}>
                <Image
                    source={{ uri: item.thumbnailUrl }}
                    style={styles.image}
                />
                <View style={styles.content} >
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.bottom}>
                        <Icon
                            name="icon-time"
                            color="#999"
                            size={14}
                        />
                        <Text style={styles.text}>{formatTime(item.duration)}</Text>
                        <Text style={styles.rate}>已播:{item.rate}%</Text>
                    </View>
                </View>
                <Touchable
                    onPress={() => { deleteBtn(item) }}
                    style={styles.deleteBtn} >
                    <Text>删除</Text>
                </Touchable>
            </View>
        )
    }

    return (
        <FlatList
            data={programs}
            renderItem={renderItem}
        />
    )
};

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        marginHorizontal: 10,
        borderBottomColor: "#ccc",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    image: {
        width: 65,
        height: 65,
        borderRadius: 3,
        margin: 5
    },
    title: {
        color: "#999"
    },
    content: {
        flex: 1,
        justifyContent: "space-around"
    },
    bottom: {
        flexDirection: "row",
        alignItems: "center"
    },
    text: {
        color: "#999",
        marginLeft: 5
    },
    rate: {
        marginLeft: 20,
        color: "#f6a624"
    },
    deleteBtn: {
        padding: 10,
        justifyContent: "center"
    }
});

export default Listen;