import React, { FC, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";
import { ICategory } from "@/models/category";
import _ from "lodash";
import Item, { itemHeight, itemWidth, margin, parentWidth } from "./item";
import { RootStackNavigation } from "@/navigator/index";
import HeaderRightBtn from "./HeaderRightBtn";
import Touchable from "@/components/Touchable";
import { DragSortableView } from "react-native-drag-sort";
import useIsMountedRef from "@/utils/useIsMountedRef";

const mapStateToProps = ({ category }: RootState) => {
    return {
        myCategorys: category.myCategorys,
        categorys: category.categorys,
        isEdit: category.isEdit
    };
};


const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface Iprops extends ModelState { };


interface Iprops extends ModelState {
    navigation: RootStackNavigation;
}

const fixdItems = ["推荐", "Vip"];
const fixdItemsIndex = [0, 1];

const Category: FC<Iprops> = (props) => {
    const { categorys, navigation, dispatch, isEdit } = props;
    const [myCategorys, setCategorys] = useState<ICategory[]>(props.myCategorys);
    let cRef = useRef<ICategory[]>([]);
    let isEditRef = useRef(isEdit);
    /**
   * {
   *      "推荐":[{id:"",name:"",classify:""}]
   * }
   */
    const classifyGroup = _.groupBy(categorys, (item) => item.classify);
    const isMountedRef = useIsMountedRef();
    useEffect(() => {
        if (isMountedRef.current) {
            navigation.setOptions({
                headerRight: () => <HeaderRightBtn onSubmit={onSubmit} />
            });
        };
        return () => {
            isMountedRef.current = false;
            dispatch({
                type: "category/setState",
                payload: {
                    isEdit: false
                }
            });
            dispatch({
                type: "category/loadData"
            });
        };
    }, []);
    useEffect(() => {
        isEditRef.current = isEdit;
        cRef.current = myCategorys;
    }, [isEdit, myCategorys])
    const renderItem = (item: ICategory, index: number) => {
        const disabled = fixdItems.indexOf(item.name) > -1;
        return (
            <Item key={item.id}
                disabled={disabled}
                data={item} isEdit={isEdit}
                selected />
        )
    };
    const renderUnSelectedItem = (item: ICategory, index: number) => {
        return (
            <Touchable key={item.id}
                onPress={() => onPress(item, index, false)}
                onLongPress={onLongPress}>
                <Item data={item} isEdit={isEdit} selected={false} />
            </Touchable>
        )
    };
    const onSubmit = () => {
        dispatch({
            type: "category/toggle",
            payload: {
                myCategorys: cRef.current,
            }
        });
        if (isEditRef.current) {
            navigation.goBack();
        };
    };
    const onLongPress = () => {
        dispatch({
            type: "category/setState",
            payload: {
                isEdit: true,
            }
        });
    };
    const onPress = (item: ICategory, index: number, selected: boolean) => {
        const disabled = fixdItems.indexOf(item.name) > -1;
        if (disabled) {
            return;
        };
        if (isEdit) {
            if (selected) {
                setCategorys(myCategorys.filter(selectedItem =>
                    selectedItem.id !== item.id));
            } else {
                setCategorys(myCategorys.concat(item));
            };
        };
    };

    const onDataChange = (data: ICategory[]) => {
        setCategorys(data);
    };
    const onClickItem = (data: ICategory[], item: ICategory) => {
        onPress(item, data.indexOf(item), true);
        console.log(213);
    };
    const onSelectedDragStart = () => {
        console.log(123)
    }
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.classifyName} >我的分类</Text>
            <View style={styles.classifyView}>
                <DragSortableView
                    delayLongPress={2}
                    dataSource={myCategorys}
                    fixedItems={fixdItemsIndex}
                    renderItem={renderItem}
                    //编辑情况下才能拖拽
                    sortable={isEdit}
                    keyExtractor={item => item.id}
                    //当进行拖拽的时候才进行回调
                    onDataChange={onDataChange}
                    parentWidth={parentWidth}
                    childrenWidth={itemWidth}
                    childrenHeight={itemHeight}
                    marginChildrenTop={margin}
                    onClickItem={onClickItem}
                    onDragStart={onSelectedDragStart}
                />
            </View>
            <View>
                {
                    Object.keys(classifyGroup).map(classify => {
                        return (
                            <View key={classify}>
                                <Text>{classify}</Text>
                                <View style={styles.classifyView}>
                                    {classifyGroup[classify].map((item, index) => {
                                        if (myCategorys.find(selectedItem => selectedItem.id === item.id)) {
                                            return null;
                                        };
                                        return renderUnSelectedItem(item, index);
                                    })}
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f6f6"
    },
    classifyName: {
        fontSize: 16,
        marginTop: 14,
        marginBottom: 8,
        marginLeft: 10
    },
    classifyView: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 5
    },

});

export default connector(Category);