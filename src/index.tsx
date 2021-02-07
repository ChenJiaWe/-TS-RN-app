import React from "react";
import Navigator from "@/navigator/index";
import { Provider } from "react-redux";
import store from "@/config/dva";
import { StatusBar } from "react-native";
import "@/config/http";
import { RootSiblingParent } from 'react-native-root-siblings';
import { enableScreens } from "react-native-screens";

//减少内存占用的
enableScreens();


export default function () {
    return (
        <Provider store={store}>
            <RootSiblingParent>
                <Navigator />
            </RootSiblingParent>
            {/* 状态栏 */}
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent
            ></StatusBar>
        </Provider>
    )
};