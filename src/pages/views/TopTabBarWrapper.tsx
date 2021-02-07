import { MaterialTopTabBarProps, MaterialTopTabBar } from "@react-navigation/material-top-tabs";
import React, { FC } from "react";
import { StyleSheet, Text, View, } from "react-native";
import Touchable from "@/components/Touchable";
//可获取IOS顶部那啥高度
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import LinearAnimatedGradientTransition from 'react-native-linear-animated-gradient-transition';
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";
import { getActiveRouteName } from "@/utils/index";

const mapStateToProps = (state: RootState, props: MaterialTopTabBarProps) => {
    const routeName = getActiveRouteName(props.state);
    const modeulState = state[routeName];
    return {
        linearColors: modeulState.carousels.length ?
            (modeulState.carousels[modeulState.activeCarouselIndex] ?
                modeulState.carousels[modeulState.activeCarouselIndex].colors : undefined) : undefined,
        gradientVisible: modeulState.gradientVisible

    }
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;



type Iprops = MaterialTopTabBarProps & ModelState

const TopTabBarWrapper: FC<Iprops> = (props) => {
    let { linearColors = ["#ccc", "#e2e2e2"], gradientVisible, indicatorStyle, navigation, ...restProps } = props;
    let textStyle = styles.text;
    let activeTintColor = "#333";
    if (gradientVisible) {
        textStyle = styles.whiteText;
        activeTintColor = "#fff";
        if (indicatorStyle) {
            indicatorStyle = StyleSheet.compose(indicatorStyle, styles.whiteBackgroundColor)
        }
    }
    const linearGradient = () => {
        if (gradientVisible) {
            return (
                <LinearAnimatedGradientTransition colors={linearColors} style={styles.gradient} />
            );
        } else {
            return null;
        };
    };

    const goCategory = () => {
        navigation.navigate("Category");
    };

    return (
        <View style={styles.container}>
            {linearGradient()}
            <View style={styles.topBarView}>
                {/* 直接复用 */}
                <MaterialTopTabBar   {...restProps} navigation={navigation} indicatorStyle={indicatorStyle} style={styles.tabbar} activeTintColor={activeTintColor} />
                <Touchable style={styles.categoryBtn} onPress={goCategory}>
                    <Text style={textStyle}>分类</Text>
                </Touchable>
            </View>
            <View style={styles.bottom}>
                <Touchable style={styles.searchBtn}>
                    <Text style={textStyle}>搜索按钮</Text>
                </Touchable>
                <Touchable style={styles.historyBtn}>
                    <Text style={textStyle}>历史记录</Text>
                </Touchable>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingTop: getStatusBarHeight(),
        backgroundColor: "#fff"
    },
    tabbar: {
        elevation: 0,
        flex: 1,
        overflow: "hidden",
        backgroundColor: "transparent"
    },
    topBarView: {
        flexDirection: "row",
        alignItems: "center"
    },
    categoryBtn: {
        paddingHorizontal: 10,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: "#ccc"
    },
    bottom: {
        flexDirection: "row",
        paddingVertical: 7,
        paddingHorizontal: 15,
        alignItems: "center"
    },
    searchBtn: {
        flex: 1,
        paddingLeft: 12,
        height: 30,
        justifyContent: "center",
        borderRadius: 15,
        backgroundColor: "rgba(0,0,0,0.1)"
    },
    historyBtn: {
        marginLeft: 24
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        height: 260
    },
    text: {
        color: "#333"
    },
    whiteText: {
        color: "#fff"
    },
    whiteBackgroundColor: {
        backgroundColor: "#fff"
    }
});

export default connector(TopTabBarWrapper);