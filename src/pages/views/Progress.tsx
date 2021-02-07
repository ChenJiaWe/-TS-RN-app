import { RootState } from "@/models/index";
import React, { FC } from "react";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { connect, ConnectedProps } from "react-redux";


const mapStateToProps = ({ player }: RootState) => {
    return {
        currentTime: player.currentTime,
        duration: player.duration
    };
};


const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {

};


const Progress: FC<IProps> = (props) => {
    const { children, currentTime, duration } = props;
    const fill = duration ? (currentTime / duration) * 100 : 0;
    return (
        <AnimatedCircularProgress
            size={40}
            width={2}
            backgroundColor="#ededed"
            tintColor="#f86442"
            fill={fill}
        >
            {() => <>{children}</>}
        </AnimatedCircularProgress>
    );
};


export default connector(Progress);