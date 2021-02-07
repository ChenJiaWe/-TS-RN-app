import React, { FC } from "react";
import { Alert, Animated, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";
import { IProgram } from "@/models/album";
import Item from "./item";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { ITabProps } from "../Tab";

const mapStateToProps = ({ album }: RootState) => {
    return {
        list: album.list
    };
};


const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

type IProps = ModelState & ITabProps;

const List: FC<IProps> = (props) => {
    const { list, panRef, tapRef, nativeRef, onScrollDrag, onItemPress } = props;
    const onPress = (data: IProgram, index: number) => {
        if (typeof onItemPress === "function") {
            onItemPress(data, index);
        };
    };
    const renderIttem = ({ item, index }: ListRenderItemInfo<IProgram>) => {
        return (
            <Item onPress={onPress} data={item} index={index} key={item.id} />
        )
    }
    const keyExtractor = (item: IProgram) => item.id;
    return (
        //等待其他手势操作组件响应完
        <NativeViewGestureHandler ref={nativeRef} simultaneousHandlers={panRef} waitFor={tapRef}>
            <Animated.FlatList
                data={list}
                style={styles.container}
                renderItem={renderIttem}
                bounces={false}
                keyExtractor={keyExtractor}
                onScrollBeginDrag={onScrollDrag}
                onScrollEndDrag={onScrollDrag}
            />
        </NativeViewGestureHandler>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff"
    }
})

export default connector(List);