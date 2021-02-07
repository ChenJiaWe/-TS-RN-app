import { RootState } from "@/models/index";
import React, { FC } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { connect, ConnectedProps } from "react-redux";


const mapStateProps = ({ category }: RootState) => {
    return {
        isEdit: category.isEdit
    };
};

const connector = connect(mapStateProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
    onSubmit: () => void;
};


const HeaderRightBtn: FC<IProps> = (props) => {
    const { onSubmit, isEdit } = props;
    return (
        <HeaderButtons>
            <Item title={isEdit ? "完成" : "编辑"} onPress={onSubmit} />
        </HeaderButtons>
    );
};



export default connector(HeaderRightBtn);