import { hp, viewportWidth, wp } from "@/utils/index";
import React, { FC, useState } from "react";
import SnapCarousel, { AdditionalParallaxProps, Pagination, ParallaxImage } from "react-native-snap-carousel";
import { StyleSheet, View } from "react-native";
import { ICarousel } from "@/models/home";
import { RootState } from "@/models/index";
import { connect, ConnectedProps } from "react-redux";




const mapStateToProps = (state: RootState, { namespace }: { namespace: string }) => {
    const modelState = state[namespace];
    return {
        data: modelState.carousels,
        activeCarouselIndex: modelState.activeCarouselIndex,
    }
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
    namespace: string;
};


//轮播图宽度
const sliderWidth = viewportWidth;

//图片宽度
const sideWidth = wp(90);
//图片高度
export const sideHeight = hp(26);
//图片宽度  + 加上两边边距的宽度
const itemWidth = sideWidth + wp(2) * 2;


const Carousel: FC<IProps> = (props) => {
    const { dispatch, activeCarouselIndex, data, namespace } = props;
    const onSnapToItem = (slideIndex: number) => {
        dispatch({
            type: namespace + "/setState",
            payload: {
                activeCarouselIndex: slideIndex
            }
        })
    }
    const pagination = {
        get() {
            return (
                <View style={styles.paginationWrapper}>
                    <Pagination
                        containerStyle={styles.paginationContainer}
                        dotsLength={data.length}
                        dotContainerStyle={styles.dotContainer}
                        dotStyle={styles.dot}
                        inactiveDotScale={0.7}
                        inactiveDotOpacity={0.4}
                        activeDotIndex={activeCarouselIndex}></Pagination>
                </View>
            )
        }
    }
    const renderItem = ({ item, index }: { item: ICarousel, index: number }, parallaxProps?: AdditionalParallaxProps) => {
        return (
            <ParallaxImage
                key={index}
                containerStyle={styles.imageContainer}
                style={styles.image}
                source={{ uri: item.image }}
                parallaxFactor={0.8}
                showSpinner
                spinnerColor="rgba(0,0,0,0.25)"
                {...parallaxProps} />
        )
    };
    return (
        <View>
            <SnapCarousel
                data={data}
                autoplay
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                renderItem={renderItem}
                onSnapToItem={onSnapToItem}
                hasParallaxImages
                loop

            />
            {pagination.get()}
        </View>
    )
};

const styles = StyleSheet.create({
    imageContainer: {
        width: itemWidth,
        height: sideHeight,
        borderRadius: 8
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover"
    },
    paginationWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    paginationContainer: {
        position: "absolute",
        top: -20,
        paddingHorizontal: 3,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.25)"
    },
    dotContainer: {
        marginHorizontal: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.95)"
    }
})

export default connector(Carousel);