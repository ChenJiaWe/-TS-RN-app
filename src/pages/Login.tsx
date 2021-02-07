import React, { FC } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
    Field,
    Formik,
} from "formik";
import Touchable from "@/components/Touchable";
import { RootState } from "../models";
import { connect, ConnectedProps } from "react-redux";
import * as Yup from "yup";
import Input from "@/components/Input";


interface Values {
    account: string;
    password: string;
};

const initialValues: Values = {
    account: "",
    password: "",
};


const mapStateToProps = ({ loading }: RootState) => {
    return {
        loading: loading.effects["user/login"]
    };
};


const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;


const validationSchema = Yup.object().shape({
    account: Yup.string().trim().required("请输入您的账户"),
    password: Yup.string().trim().required("请输入密码")
});


const Login: FC<ModelState> = (props) => {
    const { dispatch, loading } = props;

    const onSubmit = (values: Values) => {
        dispatch({
            type: "user/login",
            payload: values
        });
    };
    return (
        <ScrollView
            //保存键盘被唤醒
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.logo}>听书</Text>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {
                    ({
                        handleSubmit, }) => {
                        return (
                            <View>
                                <Field
                                    name="account"
                                    component={Input}
                                    placeholder="请输入账号"
                                />
                                <Field
                                    name="password"
                                    component={Input}
                                    secureTextEntry
                                    placeholder="请输入密码"
                                />
                                <Touchable
                                    disabled={loading}
                                    style={styles.loginBtn}
                                    onPress={handleSubmit}>
                                    <Text style={styles.loginBtnText}>登录</Text>
                                </Touchable>
                            </View>
                        )
                    }
                }
            </Formik>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    logo: {
        color: "#ff4000",
        fontWeight: "bold",
        fontSize: 50,
        textAlign: "center",
        marginTop: 40
    },
    loginBtn: {
        height: 40,
        borderRadius: 20,
        borderColor: "#ff4000",
        borderWidth: 1,
        margin: 10,
        marginTop: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    loginBtnText: {
        color: "#ff4000",
        fontWeight: "bold",
        fontSize: 16
    }
});



export default connector(Login);