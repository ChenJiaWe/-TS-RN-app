import React, { FC, useEffect, useMemo, useState } from "react";
import { FlatList, View, Text, ListRenderItemInfo, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { RootState } from "@/models/index";
import { RootStackNavigation } from "../../navigator";
import { connect, ConnectedProps } from "react-redux";
import Carousel, { sideHeight } from "./Carousel";
import Guess from "./Guess";
import { IChannel, IGUESS } from "@/models/home";
import ChannelItemMemo from "./ChannelItem";
import useIsMountedRef from "@/utils/useIsMountedRef";
import { RouteProp } from "@react-navigation/native";
import { HomeParamList } from "@/navigator/HomeTabs";




const mapStateToProps = (state: RootState, { route }:
    { route: RouteProp<HomeParamList, string> }) => {
    const { namespace } = route.params;
    const modelState = state[namespace]; 3
    return {
        carousels: modelState.carousels,
        channels: modelState.channels,
        hasMore: modelState.pagination.hasMore,
        loading: state.loading.effects[namespace + "/fetchChannels"],
        gradientVisible: modelState.gradientVisible,
        namespace
    }
};

const connector = connect(mapStateToProps);


type MadelState = ConnectedProps<typeof connector>;

interface IProps extends MadelState {
    navigation: RootStackNavigation;
}



const Home: FC<IProps> = (props) => {
    const { dispatch, loading, carousels,
        channels, navigation,
        hasMore, gradientVisible, namespace } = props;
    const [refreshing, setRefreshing] = useState(false);
    const isMountedRef = useIsMountedRef();
    useEffect(() => {
        if (isMountedRef.current) {
            dispatch({
                type: namespace + "/fetchCarousels"
            });
            dispatch({
                type: namespace + "/fetchChannels"
            });
        };
        return () => {
            isMountedRef.current = false;
        }
    }, []);
    //频道的点击事件
    const goAblum = (data: IChannel | IGUESS) => {
        navigation.navigate("Album", {
            item: data
        });
    };
    const keyExtractor = (item: IChannel) => {
        return item.id;
    };

    const renderItem = ({ item, index }: ListRenderItemInfo<IChannel>) => {
        return <ChannelItemMemo key={index} onPress={goAblum} data={item} />
    };
    const header = useMemo(() => {
        return (
            <View>
                <Carousel namespace={namespace} />
                <View style={styles.background}>
                    <Guess namespace={namespace} goAlbum={goAblum} />
                </View>
            </View>
        )
    }, [carousels]);
    const footer = () => {
        if (!hasMore) {
            return (
                <View style={styles.end}>
                    <Text>--我是有底线--</Text>
                </View>
            );
        };
        if (loading && hasMore && channels.length > 0) {
            return (
                <View style={styles.loading}>
                    <Text>正在加载中。。。</Text>
                </View>
            )
        };
        return null;
    };
    const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = nativeEvent.contentOffset.y;
        const newGradientVisible = offsetY < sideHeight;
        if (gradientVisible !== newGradientVisible) {
            dispatch({
                type: namespace + "/setState",
                payload: {
                    gradientVisible: newGradientVisible
                }
            });
        };
    }
    const empty = () => {
        if (loading) {
            return null;
        } else {
            return (
                <View style={styles.empty}>
                    <Text>暂无数据</Text>
                </View>
            );
        };
    };
    //加载更多
    const onEndReached = () => {
        if (loading || !hasMore) {
            return;
        };
        dispatch({
            type: namespace + "/fetchChannels",
            payload: {
                loadMore: true
            }
        });
    };
    //刷新
    const onRefresh = () => {
        // 1. 修改刷新状态为true
        setRefreshing(true);
        //2. 获取数据
        dispatch({
            type: namespace + "/fetchChannels",
            callback: () => {
                //3. 修改刷新状态为false
                setRefreshing(false);
            }
        });
    };
    return (
        <FlatList
            data={channels}
            renderItem={renderItem}
            ListHeaderComponent={header}
            keyExtractor={keyExtractor}
            onEndReached={onEndReached}
            //距离底部多远触发onEndReached
            onEndReachedThreshold={0.2}
            ListFooterComponent={footer}
            ListEmptyComponent={empty}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onScroll={onScroll}
        />
    )
};


const styles = StyleSheet.create({
    end: {
        alignItems: "center",
        paddingVertical: 10,
    },
    loading: {
        alignItems: "center",
        paddingVertical: 10
    },
    empty: {
        alignItems: "center",
        paddingVertical: 100
    },
    background: {
        backgroundColor: "#fff"
    }
});

export default connector(Home);