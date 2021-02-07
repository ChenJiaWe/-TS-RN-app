import { RootState } from "@/models/index";
import { navigate, viewportWidth } from "@/utils/index";
import React, { FC } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import Play from "./Play";


interface IProps {
    routeName: string;
}


const mapStateToProps = ({ player }: RootState) => {
    return {
        playState: player.playState
    };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {

};


const PlayView: FC<IProps> = (props) => {
    const { routeName, playState } = props;

    const onPress = () => {
        navigate("Detail");
    };
    if (routeName === "Root" || routeName === "Detail" || playState === "paused") {
        return null;
    };
    return (
        <View style={styles.container}>
            <Play onPress={onPress} />
        </View>
    );
};


const width = 50;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: width,
        height: width + 20,
        bottom: 0,
        left: (viewportWidth - width) / 2,
        // rgba(255,255,255,0.8)
        backgroundColor: "rgba(255,255,255,0.8)",
        padding: 4,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        ...Platform.select({
            android: {
                elevation: 4,
            },
            ios: {
                shadowColor: "rgba(0,0,0,0.3)",
                shadowOpacity: 0.85,
                shadowRadius: 5,
                shadowOffset: {
                    width: StyleSheet.hairlineWidth,
                    height: StyleSheet.hairlineWidth
                },
            },
        }),
    },
});


export default connector(PlayView);