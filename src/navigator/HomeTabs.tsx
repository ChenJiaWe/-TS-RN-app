import React, { FC } from "react";
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import Home from "@/pages/Home";
import { StyleSheet, View } from "react-native";
import TopTabBarWrapper from "@/pages/views/TopTabBarWrapper";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";
import { ICategory } from "@/models/category";
import { createHomeModel } from "@/config/dva";
import ViewPagerAdapter from "react-native-tab-view-viewpager-adapter";

export type HomeParamList = {
    [key: string]: {
        namespace: string
    };
}


const Tab = createMaterialTopTabNavigator<HomeParamList>();

const mapStateToProps = ({ category }: RootState) => {
    return {
        myCategory: category.myCategorys
    }
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {

};

const HomeTabs: FC<IProps> = (props) => {
    const { myCategory, } = props;
    //重新定义标签栏
    const renderTabBar = (props: MaterialTopTabBarProps) => {
        return (
            <TopTabBarWrapper {...props} />
        )
    };

    const renderScreen = (item: ICategory) => {
        createHomeModel(item.id);
        return (<Tab.Screen
            key={item.id}
            name={item.id}
            component={Home}
            initialParams={
                {
                    namespace: item.id
                }}
            options={{ tabBarLabel: item.name }}></Tab.Screen>)
    };

    return (
        <Tab.Navigator
            lazy
            tabBar={renderTabBar}
            sceneContainerStyle={styles.sceneContainer}
            // 进行有性能优化
            pager={props => <ViewPagerAdapter {...props} />}
            tabBarOptions={{
                //允许标签栏滚动
                scrollEnabled: true,
                tabStyle: {
                    width: 80
                },
                //标签栏的下划线
                indicatorStyle: {
                    height: 4,
                    width: 20,
                    marginLeft: 30,
                    borderRadius: 2,
                    backgroundColor: "#f86442"
                },
                activeTintColor: "#f86442",
                inactiveTintColor: "#333",
            }}
        >
            {
                myCategory.map(renderScreen)
            }

        </Tab.Navigator>
    )
};

const styles = StyleSheet.create({
    sceneContainer: {
        backgroundColor: "transparent"
    }
})

export default connector(HomeTabs);