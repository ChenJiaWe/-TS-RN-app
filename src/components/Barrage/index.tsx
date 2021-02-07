import Item from "./item";
import React, { FC, useEffect, useRef, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import useIsMountedRef from "@/utils/useIsMountedRef";


export interface Message {
    id: number;
    title: string;
};

interface IProps {
    data: Message[];
    maxTrack: number;
    style?: StyleProp<ViewStyle>;
};

export interface IBarrage extends Message {
    trackIndex: number;
    isFree?: boolean;
};

//添加弹幕
function addBarrage(data: Message[], maxTrack: number, list: IBarrage[][]) {
    for (let i = 0; i < data.length; i++) {
        const trackIndex = getTrackIndex(list, maxTrack);
        if (trackIndex < 0) {
            continue;
        };
        if (!list[trackIndex]) {
            list[trackIndex] = [];
        };
        const barrage = {
            ...data[i],
            trackIndex
        };
        list[trackIndex].push(barrage);
    };
    return list;
};

//获取轨道下标
function getTrackIndex(list: IBarrage[][], maxTrack: number) {
    for (let i = 0; i < maxTrack; i++) {
        const barragesOfTrack = list[i];
        if (!barragesOfTrack || barragesOfTrack.length === 0) {
            return i;
        };
        const lastBarragesofTrack =
            barragesOfTrack[barragesOfTrack.length - 1];
        if (lastBarragesofTrack.isFree) {
            return i;
        };
    };
    return -1;
};

const Barrage: FC<IProps> = (props) => {
    const { maxTrack, style } = props;
    const [list, setList] = useState<IBarrage[][]>([[]]);
    const isMountedRef = useIsMountedRef();
    const outside = (data: IBarrage) => {
        if (isMountedRef.current) {
            const newList = list.slice();
            if (newList.length > 0) {
                const { trackIndex } = data;
                newList[trackIndex] = newList[trackIndex]
                    .filter(item => item.id !== data.id);
                setList(newList);
            }
        };
    };
    const delteRef = useRef<{
        key: boolean,
        outside: (data: IBarrage) => void
    }>({ key: false, outside });
    useEffect(() => {
        if (isMountedRef.current) {
            setList(addBarrage(props.data, maxTrack, list));
        };
        return () => {
            isMountedRef.current = false;
        }
    }, [props.data]);


    const renderItem = (item: IBarrage[], index: number) => {
        return item.map((barrage, index) => {
            return (
                <Item
                    delteRef={delteRef}
                    key={barrage.id} data={barrage} />

            )
        })
    };

    return (
        <View style={[styles.container, style]}>
            {list.map(renderItem)}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        position: "absolute"
    }
});

export default Barrage;