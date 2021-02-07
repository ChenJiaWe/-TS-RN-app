import { IProgram } from "@/models/album";
import React, { FC, RefObject, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Platform, StyleSheet, Text, View } from "react-native";
import { NativeViewGestureHandler, PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import { SceneRendererProps, TabBar, TabView } from "react-native-tab-view";
import Introduction from "./Introduction";
import List from "./List";
interface IRoute {
    key: string;
    title: string;
}

interface IState {
    routes: IRoute[];
    index: number;
};

export interface ITabProps {
    panRef: RefObject<PanGestureHandler>;
    tapRef: RefObject<TapGestureHandler>;
    nativeRef: RefObject<NativeViewGestureHandler>;
    onScrollDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onItemPress: (data: IProgram, index: number) => void;
};

const Tab: FC<ITabProps> = (props) => {
    const { panRef, tapRef, nativeRef, onScrollDrag, onItemPress } = props;
    const [index, setIndex] = useState(1);
    const [routes, setRoutes] = useState([
        { key: "introduction", title: "简介" },
        { key: "albums", title: "节目" },
    ])

    const onIndexChange = (index: number) => {
        setIndex(index);
    };

    const renderScene = ({ route }: { route: IRoute }) => {
        switch (route.key) {
            case "introduction":
                return <Introduction />;
            case "albums":
                return <List onScrollDrag={onScrollDrag}
                    panRef={panRef}
                    tapRef={tapRef}
                    nativeRef={nativeRef}
                    onItemPress={onItemPress}
                />
        }

    };

    const renderTabBar = (props: SceneRendererProps & { navigationState: IState }) => {

        return <TabBar  {...props} scrollEnabled
            tabStyle={styles.tabStyle}
            labelStyle={styles.label}
            style={styles.tabbar}
            indicatorStyle={styles.indicator}
        />

    };

    return (
        <TabView
            navigationState={{
                routes,
                index
            }}
            onIndexChange={onIndexChange}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
        />
    )
};


const styles = StyleSheet.create({
    tabStyle: {
        width: 80
    },
    label: {
        color: "#333"
    },
    tabbar: {
        backgroundColor: "#fff",
        ...Platform.select({
            android: {
                elevation: 0,
                borderBottomColor: "#e3e3e3",
                borderBottomWidth: StyleSheet.hairlineWidth
            }
        })
    },
    indicator: {
        backgroundColor: "#eb6d48",
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderColor: "#fff"
    }
})


export default Tab;