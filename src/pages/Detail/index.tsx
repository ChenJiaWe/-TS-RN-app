import { RouteProp } from "@react-navigation/native";
import React, { FC, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { ModalStackNavigation, ModalStackParamList } from "@/navigator/index";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";
import Touchable from "@/components/Touchable";
import Icon from "@/assets/iconfont/index";
import PlaySlider from "./PlaySlider";
import { viewportWidth } from "@/utils/index";
import LinearGradient from "react-native-linear-gradient";
import Barrage, { Message } from "@/components/Barrage/index";
import useIsMountedRef from "@/utils/useIsMountedRef";

const mapStateToProps = ({ player }: RootState) => {
    return {
        soundUrl: player.soundUrl,
        playState: player.playState,
        title: player.title,
        previousId: player.previousId,
        nextId: player.nextId,
        thumbnailUrl: player.thumbnailUrl,
        id: player.id
    };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;


interface IProps extends ModelState {
    route: RouteProp<ModalStackParamList, "Detail">;
    navigation: ModalStackNavigation;
};



const IMAGE_WIDTH = 180;

const PADDING_TOP = (viewportWidth - IMAGE_WIDTH) / 2;

//屏幕宽度除以图片宽度的比例
const SCALE = viewportWidth / IMAGE_WIDTH;


const data: string[] = [
    "最灵繁的人也看不见自己的背脊",
    "朝闻道，夕死可矣",
    "阅读是人类进步的阶梯",
    "内外相应，言行相称",
    "人的一生是短的",
    "抛弃时间的人，时间也抛弃他",
    "自信在于沉稳",
    "过犹不及",
    "开卷有益",
    "有志者事竟成",
    "合理安排时间，就等于节约时间",
    "成功源于不懈的努力"
];

function randomIndex(length: number) {
    return Math.floor(Math.random() * length);
};

function getText() {
    return data[randomIndex(data.length)];
};


const Detail: FC<IProps> = (props) => {
    const { dispatch, route, playState,
        previousId, nextId, thumbnailUrl,
        navigation, title, id } = props;
    const [barrage, setBarrage] = useState(false);
    const [barrageData, setBarrageData] = useState<Message[]>([]);
    let barrageRef = useRef(barrage);
    let anim = useRef(new Animated.Value(1)).current;
    const isMountedRef = useIsMountedRef();
    useEffect(() => {
        if (isMountedRef.current) {
            if (route.params && route.params.id !== id) {
                dispatch({
                    type: "player/fetchShow",
                    payload: {
                        id: route.params.id
                    }
                });
            } else {
                dispatch({
                    type: "player/play",
                });
            };
            addBarrage();
        };
        return () => {
            isMountedRef.current = false;
        }
    }, []);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: title
        })
    }, [title]);
    useEffect(() => {
        barrageRef.current = barrage;
    }, [barrage]);
    const toggle = () => {
        dispatch({
            type: playState === "playing" ? "player/pause" : "player/play"
        })
    };
    const previous = () => {
        dispatch({
            type: "player/previous"
        })
    };
    const next = () => {
        dispatch({
            type: "player/next"
        })
    };
    const handelBarrage = () => {
        setBarrage(() => !barrage);
        Animated.timing(anim, {
            toValue: barrage ? 1 : SCALE,
            duration: 100,
            useNativeDriver: false,
        }).start();
    };
    const addBarrage = () => {
        setInterval(() => {
            if (barrageRef.current) {
                const id = Date.now();
                const title = getText();
                setBarrageData([{ id, title }]);
            }
        }, 500);
    };
    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Animated.Image source={{ uri: thumbnailUrl }}
                    style={[styles.image, {
                        borderRadius: barrage ? 0 : 8,
                        transform: [{ scale: anim }]
                    }]} />
            </View>
            {
                barrage && (
                    <>
                        <LinearGradient colors={["rgba(128,104,120,0.5)", "#807c66"]}
                            style={styles.liner} />
                        <Barrage style={{ top: PADDING_TOP }}
                            maxTrack={5} data={barrageData} />
                    </>
                )
            }
            <Touchable style={styles.barrageBtn} onPress={handelBarrage}>
                <Text style={styles.barrageText}> 弹幕</Text>
            </Touchable>
            <PlaySlider />
            <View style={styles.control} >
                <Touchable disabled={!previousId} onPress={previous} style={styles.button}>
                    <Icon name="icon-shangyishou" size={30} color="#fff" />
                </Touchable>
                <Touchable onPress={toggle} style={styles.button}>
                    <Icon name={playState === "playing" ?
                        "icon-paste" : "icon-bofang"}
                        size={40}
                        color="#fff"
                    />
                </Touchable>
                <Touchable disabled={!nextId} onPress={next} style={styles.button}>
                    <Icon name="icon-xiayishou" size={30} color="#fff" />
                </Touchable>
            </View>

        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        paddingTop: PADDING_TOP,

    },
    control: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 15,
        marginHorizontal: 90
    },
    button: {
        marginHorizontal: 10
    },
    imageView: {
        alignItems: "center",
        height: IMAGE_WIDTH
    },
    image: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH,
        borderRadius: 8,
        backgroundColor: "#ccc"
    },
    barrageBtn: {
        height: 20,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 1,
        marginLeft: 10
    },
    barrageText: {
        color: "#fff"
    },
    liner: {
        position: "absolute",
        top: 0,
        height: viewportWidth,
        width: viewportWidth
    }
});

export default connector(Detail);