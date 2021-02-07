import React, { FC } from "react";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";
import { Image, StyleSheet, Text, View } from "react-native";
import Touchable from "@/components/Touchable";
import defaultAbatarImg from "@/assets/default_avatar.png";
import { navigate } from "@/utils/index";



interface IProps {
    authority?: boolean;
    noMatch?: () => JSX.Element;
}

const Authorized: FC<IProps> = (props) => {
    const { children, authority, noMatch } = props;
    const onPress = () => {
        navigate("Login");
    };

    const renderNoMatch = () => {
        if (typeof noMatch === "function") {
            return <View>{noMatch()}</View>
        } else {
            return (
                <View style={styles.loginView}>
                    <Image
                        source={defaultAbatarImg}
                        style={styles.avatar}
                    />
                    <View
                        style={styles.right}
                    >
                        <Touchable style={styles.loginBtn} onPress={onPress}>
                            <Text style={styles.loginBtnText}>立即登录</Text>
                        </Touchable>
                        <Text style={styles.tip}>登录后自动同步所有记录哦~</Text>
                    </View>
                </View>
            )
        }
    };
    if (authority) {
        return children as React.ReactElement;
    };
    return (
        renderNoMatch()
    )
};

const styles = StyleSheet.create({
    loginView: {
        flexDirection: "row",
        margin: 15
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    right: {
        flex: 1,
        marginLeft: 15
    },
    loginBtn: {
        justifyContent: "center",
        alignItems: "center",
        height: 26,
        width: 76,
        borderRadius: 13,
        borderColor: "#f86442",
        borderWidth: 1,
        marginBottom: 12
    },
    loginBtnText: {
        color: "#f86442",
        fontWeight: "900"
    },
    tip: {
        color: "#999"
    }
});

export default Authorized;