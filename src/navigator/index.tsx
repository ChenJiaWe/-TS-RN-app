import React, { FC, useEffect, useState, } from "react";
import { NavigationContainer, NavigationState, RouteProp, } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, StackNavigationProp, TransitionPresets } from "@react-navigation/stack";
import BottomTabs from "./BottomTabs";
import { Animated, Platform, StatusBar, StyleSheet } from "react-native";
import Category from "@/pages/Category";
import Album from "@/pages/Album";
import { StackNavigationOptions } from "@react-navigation/stack";
import Detail from "@/pages/Detail";
import Icon from "@/assets/iconfont/index";
import PlayView from "@/pages/views/PlayView";
import { getActiveRouteName, navigationRef } from "../utils";
import Login from "@/pages/Login";
import SplashScreen from "react-native-splash-screen";

export type RootStackPrmList = {
    BottomTabs: {
        screen?: string;
    },
    Category: undefined,
    Album: {
        item: {
            id: string,
            title: string,
            image: string
        },
        opacity?: Animated.Value;
    },
}

export type RootStackNavigation = StackNavigationProp<RootStackPrmList>;


const Stack = createStackNavigator<RootStackPrmList>();



function getAlbumOptions({ route }: {
    route: RouteProp<RootStackPrmList, "Album">
}) {
    const options: StackNavigationOptions = {
        headerTitle: route.params.item.title,
        headerTransparent: true,
        headerTitleStyle: {
            opacity: route.params.opacity
        },
        headerBackground: () => {
            return (
                <Animated.View style={[styles.headerBackground,
                { opacity: route.params.opacity }]} />
            )
        }
    }
    return options;
};

function RootStackScreen() {
    return (
        <Stack.Navigator headerMode="float"
            screenOptions={{
                ...Platform.select({
                    android: {
                        headerStatusBarHeight: StatusBar.currentHeight,
                    }
                }),
                headerTitleAlign: "center",
                //标题滑动方向
                headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
                //卡片滑动方向
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                //开启手势滑动
                gestureEnabled: true,
                //水平方向
                gestureDirection: "horizontal",
                headerStyle: {
                    ...Platform.select({
                        android: {
                            //将阴影设置为0
                            elevation: 0,
                            //定义为当前设备的仔细宽度
                            borderBottomWidth: StyleSheet.hairlineWidth
                        }
                    })
                },
                //设置ios 返回隐藏
                headerBackTitleVisible: false,
                //标题颜色
                headerTintColor: "#333"
            }}>
            <Stack.Screen name="BottomTabs" component={BottomTabs}></Stack.Screen>
            <Stack.Screen name="Category" component={Category}
                options={{ headerTitle: "分类" }} ></Stack.Screen>
            <Stack.Screen options={getAlbumOptions}
                name="Album"
                component={Album}></Stack.Screen>
        </Stack.Navigator>
    )
};

export type ModalStackParamList = {
    Root: undefined;
    Detail: {
        id: string
    };
    Login: undefined;
};

const ModalStack = createStackNavigator<ModalStackParamList>()

export type ModalStackNavigation = StackNavigationProp<ModalStackParamList>;

function ModalStackScreen() {
    return (
        <ModalStack.Navigator
            //modal - This does 2 things:
            // Sets headerMode to screen for the stack unless specified
            // Make the screens slide in from the bottom on iOS which is a common iOS pattern.
            mode="modal"
            // screen - Each screen has a header attached to it 
            // and the header fades in and out together with the screen. 
            // This is a common pattern on Android.
            headerMode="screen"
            screenOptions={{
                headerTitleAlign: 'center',
                gestureEnabled: true,
                ...TransitionPresets.ModalSlideFromBottomIOS,
                //设置IOS返回的标题隐藏
                headerBackTitleVisible: false,
                
                headerTintColor:"#333"
            }}
        >
            <ModalStack.Screen
                name="Root"
                component={RootStackScreen}
                options={{ headerShown: false }}
            />
            <ModalStack.Screen name="Detail" component={Detail}
                options={{
                    headerTintColor: "#fff",
                    headerTitle: "",
                    headerTransparent: true,
                    //页面容器样式
                    cardStyle: {
                        backgroundColor: "#807c66"
                    },
                    headerBackImage: ({ tintColor }) => (
                        <Icon name="icon-down"
                            size={30}
                            color={tintColor}
                            style={
                                styles.headerBackImage
                            }
                        />
                    )
                }}

            />
            <ModalStack.Screen
                name="Login"
                component={Login}
                options={{
                    headerTitle: "登录"
                }}
            />
        </ModalStack.Navigator>
    )
}

const Navigator: FC = () => {
    const [routeName, setRouteName] = useState("Root");
    const onStateChange = (state: NavigationState | undefined) => {
        if (state) {
            const routeName = getActiveRouteName(state);
            setRouteName(routeName);
        };
    };
    useEffect(()=>{
        SplashScreen.hide();
    },[]);
    return (
        <NavigationContainer
            onStateChange={onStateChange}
            ref={navigationRef}
        >
            <ModalStackScreen />
            <PlayView routeName={routeName} />
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    headerBackground: {
        flex: 1,
        backgroundColor: "#fff",
        opacity: 0
    },
    headerBackImage: {
        marginHorizontal: Platform.OS === "android" ? 0 : 8,
    }
});

export default Navigator;