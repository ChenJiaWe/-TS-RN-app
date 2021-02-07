import React, { FC, useEffect, useLayoutEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Animated, NativeSyntheticEvent, NativeScrollEvent, } from "react-native";
import { useHeaderHeight } from "@react-navigation/stack";
import { RootState } from "@/models/index";
import { ConnectedProps, connect } from "react-redux";
import { RouteProp } from "@react-navigation/native";
import { ModalStackNavigation, RootStackNavigation, RootStackPrmList } from "@/navigator/index";
import useIsMountedRef from "@/utils/useIsMountedRef";
import coverRight from "@/assets/cover-right.png";
import { BlurView } from "@react-native-community/blur";
import Tab from "./Tab";
import { NativeViewGestureHandler, PanGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent, State, TapGestureHandler } from "react-native-gesture-handler";
import { viewportHeight } from "@/utils/index";
import { IProgram } from "@/models/album";
const mapStateToProps = ({ album }: RootState) => {
    return {
        summary: album.summary,
        author: album.author,
        list: album.list
    };
};

const connector = connect(mapStateToProps);

type MadelState = ConnectedProps<typeof connector>;

interface IProps extends MadelState {
    route: RouteProp<RootStackPrmList, "Album">;
    navigation: ModalStackNavigation;
}

const USE_NATIVE_DRIVER = true;
const HEADER_HEIGHT = 260;

const Album: FC<IProps> = (props) => {
    const { dispatch, route,
        author, summary,
        navigation, list } = props;
    const headerHeight = useHeaderHeight();
    const isMountedRef = useIsMountedRef();
    const { title, image } = route.params.item;
    const translationY = useRef(new Animated.Value(0)).current;
    const translationYOffset = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(new Animated.Value(0)).current;
    let lastScrollYValue = useRef(0).current;
    const reverseLastScrollY = useRef(Animated.multiply(new Animated.Value(-1),
        lastScrollY)).current;
    const translateY = Animated.add(Animated.add(translationY,
        reverseLastScrollY), translationYOffset);
    const RANGE = useRef([-(HEADER_HEIGHT - headerHeight), 0]).current;
    let translationYValue = useRef(0).current;

    const panRef = useRef<PanGestureHandler>(null);

    const tapRef = useRef<TapGestureHandler>(null);

    //原生的响应组件对象
    const nativeRef = useRef<NativeViewGestureHandler>(null);

    useEffect(() => {
        if (isMountedRef.current) {
            const { id } = route.params.item;

            dispatch({
                type: "album/fetchAlbum",
                payload: {
                    id
                }
            });
            // Animated.timing(translateY, {
            //     toValue: -170,
            //     duration: 3000,
            //     useNativeDriver: false
            // }).start();
            navigation.setParams({
                opacity: translateY.interpolate({
                    inputRange: RANGE,
                    outputRange: [1, 0]
                })
            })
        };
        return () => {
            isMountedRef.current = false;
        }
    }, []);
    const renderHeader = () => {
        if (image !== "" && author.avatar !== "" && author.name !== "" && title !== "") {
            return (
                <View style={[styles.header, { paddingTop: headerHeight }]}>
                    <Image
                        source={{ uri: image }}
                        style={styles.background}
                    />
                    <BlurView
                        blurType="light"
                        blurAmount={10}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.leftView}>
                        <Image
                            source={{ uri: image }}
                            style={styles.thumbnail}
                        />
                        <Image
                            source={coverRight}
                            style={styles.coverRight}
                        />
                    </View>
                    <View style={styles.rightView}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.summary}>
                            <Text style={styles.summaryText} numberOfLines={1}>{summary}</Text>
                        </View>
                        <View style={styles.author}>
                            <Image
                                source={{ uri: author.avatar }}
                                style={styles.avatar}
                            />
                            <Text style={styles.name}>{author.name}</Text>
                        </View>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    };

    const onScrollDrag = Animated.event([{
        nativeEvent: {
            contentOffset: { y: lastScrollY }
        }
    }], {
        useNativeDriver: USE_NATIVE_DRIVER,
        listener: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
            lastScrollYValue = nativeEvent.contentOffset.y;
        }
    });

    const onGestureEvent = Animated.event([{ nativeEvent: { translationY: translationY } }], {
        useNativeDriver: USE_NATIVE_DRIVER,
    });
    const onHandlerStateChange = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
        if (nativeEvent.oldState === State.ACTIVE) {
            const tY = nativeEvent.translationY - lastScrollYValue;
            //Animated.Value
            //value
            //offest
            //将value值清空并赋值给offset
            translationYOffset.extractOffset();
            translationYOffset.setValue(tY);
            //value = value + offet
            translationYOffset.flattenOffset();
            translationY.setValue(0);
            translationYValue += tY;
            let maxDeltaY = -RANGE[0] - translationYValue;
            if (translationYValue < RANGE[0]) {
                translationYValue = RANGE[0];
                Animated.timing(translationYOffset, {
                    toValue: RANGE[0],
                    useNativeDriver: USE_NATIVE_DRIVER
                }).start();
                maxDeltaY = RANGE[1];
            } else if (translationYValue > 0) {
                translationYValue = RANGE[1];
                Animated.timing(translationYOffset, {
                    toValue: RANGE[1],
                    useNativeDriver: USE_NATIVE_DRIVER
                }).start();
                maxDeltaY = -RANGE[0];
            };
            if (tapRef.current) {
                const tap: any = tapRef.current;
                tap.setNativeProps({
                    maxDeltaY
                });
            }
        };
    };
    const onItemPress = (data: IProgram, index: number) => {
        const previousItem = list[index - 1];
        const nextItem = list[index + 1];
        dispatch({
            type: "player/setState",
            payload: {
                previousId: previousItem ? previousItem.id : "",
                nextId: nextItem ? nextItem.id : "",
                title: data.title,
                sounds: list.map(item =>
                    ({ id: item.id, title: item.title })),
                thumbnailUrl: route.params.item.image
            }
        });
        navigation.navigate("Detail", { id: data.id });
    };
    return (
        // 当手指沿Y轴以点表示的给定距离行进且处理程序尚未激活时，它将无法识别手势
        <TapGestureHandler ref={tapRef} maxDeltaY={-RANGE[0]} >
            <View style={styles.container}>
                <PanGestureHandler
                    ref={panRef}
                    //与外边的手势组件同步响应
                    simultaneousHandlers={[tapRef, nativeRef]}
                    onHandlerStateChange={onHandlerStateChange}
                    onGestureEvent={onGestureEvent}>
                    <Animated.View style={[styles.container,
                    // {
                    //     padding: 10,
                    //     opacity: translateY.interpolate({
                    //         inputRange: [-170, 0],
                    //         outputRange: [1, 0]
                    //     }),
                    //     backgroundColor: translateY.interpolate({
                    //         inputRange: [-170, 0],
                    //         outputRange: ["red", "#fff"]
                    //     })
                    // },
                    //当超出这个范围不做处理
                    {
                        transform: [{
                            translateY: translateY.interpolate({
                                inputRange: RANGE,
                                outputRange: RANGE,
                                extrapolate: "clamp"
                            })
                        }]
                    }]}>
                        {renderHeader()}
                        <View style={{ height: viewportHeight - headerHeight }}>
                            <Tab panRef={panRef} tapRef={tapRef}
                                nativeRef={nativeRef}
                                onScrollDrag={onScrollDrag}
                                onItemPress={onItemPress}
                            />
                        </View>
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </TapGestureHandler>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: HEADER_HEIGHT,
        flexDirection: "row",
        paddingHorizontal: 20,
        alignItems: "center"
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#eee"
    },
    leftView: {
        marginRight: 26
    },
    thumbnail: {
        width: 98,
        height: 98,
        backgroundColor: "#fff",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 8,
        borderColor: "#fff"
    },
    coverRight: {
        height: 98,
        position: "absolute",
        right: -23,
        resizeMode: "contain"
    },
    rightView: {
        flex: 1
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "900"
    },
    summary: {
        backgroundColor: "rgba(0,0,0,0.3)",
        padding: 10,
        marginVertical: 10,
        borderRadius: 4
    },
    summaryText: {
        color: "#fff"
    },
    author: {
        flexDirection: "row",
        alignItems: "center"
    },
    avatar: {
        height: 26,
        width: 26,
        borderRadius: 13,
        marginRight: 8
    },
    name: {
        color: "#fff"
    }
});

export default connector(Album);