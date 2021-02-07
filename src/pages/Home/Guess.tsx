import React, { FC, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, Alert, ListRenderItemInfo } from "react-native";
import { RootState } from "@/models/index";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { IGUESS } from "@/models/home";
import Icon from "@/assets/iconfont/index";
import Touchable from "@/components/Touchable";
import useIsMountedRef from "@/utils/useIsMountedRef";
const mapStateToProps = (state: RootState, props: { namespace: string }) => {
    const namespace = props.namespace
    const modelState = state[namespace];
    return {
        guess: modelState.guess
    };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
    namespace: string;
    goAlbum: (item: IGUESS) => void;
}


const Guess: FC<IProps> = (props) => {
    const { guess, namespace, goAlbum } = props;
    const dispatch = useDispatch();
    const isMounted = useIsMountedRef();
    useEffect(() => {
        if (isMounted.current) {
            fetch();
        }
    }, []);
    const fetch = () => {
        dispatch({
            type: namespace + "/fetchGuess"
        });
    };
    const renderItem = ({ item }: ListRenderItemInfo<IGUESS>) => {
        return (
            <Touchable style={styles.item} onPress={() => goAlbum(item)}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text numberOfLines={2}>{item.title}</Text>
            </Touchable>
        )
    };
    const keyExtractor = (item: IGUESS) => {
        return item.id;
    };
    const ListHeaderComponent = () => {
        return (
            <View style={styles.header}>
                <View style={styles.headerRight}>
                    <Icon name="icon-xihuan" />
                    <Text style={styles.headerTitle}>猜你喜欢</Text>
                </View>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerRight}>更多</Text>
                    <Icon name="icon-more" />
                </View>
            </View>
        )
    };
    const ListFooterComponent = () => {
        return (
            <Touchable style={styles.changeGuess} onPress={fetch} >
                <Icon name="icon-huanyipi" color="red" />
                <Text style={styles.changeGuessText}>换一批</Text>
            </Touchable>
        )
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={guess}
                renderItem={renderItem}
                numColumns={3}
                style={styles.list}
                keyExtractor={keyExtractor}
                ListHeaderComponent={
                    ListHeaderComponent
                }
                ListFooterComponent={
                    ListFooterComponent
                }
            />

        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 8,
        margin: 16
    },
    item: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 10
    },
    image: {
        width: "100%",
        height: 100,
        borderRadius: 8,
        marginBottom: 10
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomColor: "#efefef",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        marginLeft: 5,
        color: "#333"
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    moreText: {
        color: "#6f6f6f",

    },
    changeGuess: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 5
    },
    changeGuessText: {
        marginLeft: 5
    },
    list: {
        padding: 10
    }
});

export default connector(Guess);