import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";


const mapStateToProps = ({ album }: RootState) => {
    return {
        introduction: album.introduction
    };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;




const Introduction: FC<ModelState> = (props) => {
    const { introduction } = props;
    return (
        <View style={styles.container}>
            <Text>
                {introduction}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    }
});

export default connector(Introduction);