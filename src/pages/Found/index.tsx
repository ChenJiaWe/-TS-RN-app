import { RootState } from "@/models/index";
import { IFound } from "@/models/found";
import React, { FC, useEffect, useState } from "react";
import { Text, View, Button, FlatList, ListRenderItemInfo } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { RootStackNavigation } from "../../navigator";
import Item from "./Item";

const mapStateToProps = ({ player }: RootState) => {
    return {
        playState: player.playState
    };
};


const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;


interface IProps extends ModelState {
    navigation: RootStackNavigation;
};


const Found: FC<IProps> = (props) => {
    const { navigation, dispatch, playState } = props;
    const [list, setList] = useState<IFound[]>([]);
    const [currentId, saveCurrentId] = useState("");
    useEffect(() => {
        dispatch({
            type: "found/fetchList",
            callback: (data: IFound[]) => {
                setList(data);
            }
        });
    }, []);
    useEffect(() => {
        if (playState === "playing" && currentId !== "") {
            saveCurrentId("");
        };
    }, [playState]);
    const setCurrentId = (id: string) => {
        saveCurrentId(id);
        if (id && playState === "playing") {
            dispatch({
                type: "player/pause"
            });
        };
    };
    const rendItem = ({ item }: ListRenderItemInfo<IFound>) => {
        const paused = item.id !== currentId;
        return (
            <Item data={item} paused={paused} setCurrentId={setCurrentId} />
        );
    };

    return (
        <FlatList
            data={list}
            renderItem={rendItem}
            extraData={currentId}
        />
    )
};


export default connector(Found);