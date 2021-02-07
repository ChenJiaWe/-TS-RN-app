import storage, { load } from "@/config/storage";
import axios from "axios";
import { Effect, Model, SubscriptionsMapObject } from "dva-core-ts";
import { Reducer } from "redux";
import { RootState } from "@/models/index";


const CATEGORY_URL = "http://39.105.213.120/mock/11/bear/category";

const instance = axios.create();

export interface ICategory {
    id: string;
    name: string;
    classify?: string;
}


export interface CategoryModelState {
    myCategorys: ICategory[];
    categorys: ICategory[];
    isEdit: boolean;
};


interface CategoryModel extends Model {
    namespace: "category";
    reducers: {
        setState: Reducer<CategoryModelState>
    };
    state: CategoryModelState;
    effects: {
        loadData: Effect;
        toggle: Effect;
    };

    subscriptions: SubscriptionsMapObject;
}


const initialState: CategoryModelState = {
    myCategorys: [
        {
            id: "home",
            name: "推荐"
        },
        {
            id: "vip",
            name: "Vip"
        }
    ],
    categorys: [],
    isEdit: false
};


const categoryModel: CategoryModel = {
    namespace: "category",
    state: initialState,
    effects: {
        *loadData(_, { call, put }) {
            //从storage获取数据
            const myCategorys = yield call(load, { key: "myCategorys" });
            const categorys = yield call(load, { key: "categorys" });
            //发起action,将数据保存到state
            if (myCategorys && myCategorys.length > 0) {
                yield put({
                    type: "setState",
                    payload: {
                        myCategorys,
                        categorys
                    }
                });
            } else {
                yield put({
                    type: "setState",
                    payload: {
                        categorys
                    }
                });
            };
        },
        *toggle({ payload }, { put, select }) {
            const category = yield select(({ category }: RootState) => category);
            yield put({
                type: "setState",
                payload: {
                    isEdit: !category.isEdit
                }
            });
            if (category.isEdit) {
                storage.save({
                    key: "myCategorys",
                    data: payload.myCategorys,
                });
            };
        }
    },
    reducers: {
        setState(state = initialState, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: "loadData" });
        },
        asyncStorage() {
            storage.sync.categorys = async () => {
                const { data } = await instance.get(CATEGORY_URL);
                return data.data;
            };
            //不需要返回到后台
            storage.sync.myCategorys = async () => {
                return null;
            }
        }
    }
};

export default categoryModel;