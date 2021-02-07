import React, { FC, useEffect, useRef } from "react";
import { getFocusedRouteNameFromRoute, NavigationContainer, RouteProp, useRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Home from "@/pages/Home";
import Listen from "@/pages/Listen";
import Found from "@/pages/Found";
import Account from "@/pages/Account";
import { RootStackNavigation, RootStackPrmList } from ".";
import Icon from "@/assets/iconfont/index";
import HomeTabs from "./HomeTabs";
import Play from "@/pages/views/Play";
export type BottomTabParamList = {
    HomeTabs: undefined;
    Listen: undefined;
    Found: undefined;
    Account: undefined;
    Play: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

type Route = RouteProp<RootStackPrmList, "BottomTabs">;

interface Iprops {
    navigation: RootStackNavigation;
}


const BottomTabs: FC<Iprops> = (props) => {
    const { navigation } = props;
    const route = useRoute<Route>();
    useEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "HomeTabs";
        if (routeName === "HomeTabs") {
            navigation.setOptions({
                headerTitle: "",
                headerTransparent: true
            });
        } else {
            navigation.setOptions({
                headerTitle: getHeaderTitle(routeName),
                headerTransparent: false
            });
        }
    }, [navigation, route]);
    function getHeaderTitle(routeName: string) {

        switch (routeName) {
            case "Listen":
                return "我听";
            case "Found":
                return "发现";
            case "Account":
                return "账户";
            default:
                return "首页";
        };
    };
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "#f86442"
            }}

        >
            <Tab.Screen name="HomeTabs"
                component={HomeTabs}
                options={{
                    tabBarLabel: "首页",
                    tabBarIcon: ({ color, size }) =>
                        (<Icon size={size} color={color} name="icon-shouye" />)
                }}></Tab.Screen>
            <Tab.Screen name="Listen"
                component={Listen}
                options={{
                    tabBarLabel: "我听",
                    tabBarIcon: ({ color, size }) => (
                        <Icon size={size} color={color} name="icon-shoucang" />
                    )
                }}></Tab.Screen>
            <Tab.Screen
                name="Play"
                component={Play}
                options={({ navigation }) => ({
                    tabBarButton: () => {
                        return <Play onPress={() => navigation.navigate("Detail")} />
                    }
                })}
            ></Tab.Screen>
            <Tab.Screen name="Found"
                component={Found}
                options={{
                    tabBarLabel: "发现",
                    tabBarIcon: ({ color, size }) => (
                        <Icon size={size} color={color} name="icon-faxian" />
                    )
                }}></Tab.Screen>
            <Tab.Screen name="Account"
                component={Account}
                options={{
                    tabBarLabel: "我的",
                    tabBarIcon: ({ color, size }) => (
                        <Icon size={size} color={color} name="icon-user" />
                    )
                }}></Tab.Screen>
        </Tab.Navigator>
    )
};


export default BottomTabs;

