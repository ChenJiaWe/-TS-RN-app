import { Model, Effect } from "dva-core-ts";
import axios from "axios";
import { Reducer } from "redux";


const ALBUM_URL = "/mock/15/album/list";


//节目
export interface IProgram {
    id: string;
    title: string;
    playVolume: string;
    duration: string;
    data: string;
};

//作者
export interface IAuthor {
    name: string;
    avatar: string;
};

export interface IAlbumModelState {
    id: string;
    title: string;
    summary: string;
    thumbnailUrl: string;
    introduction: string;
    author: IAuthor;
    list: IProgram[];
};

export interface AlbumModel extends Model {
    namespace: "album",
    state: IAlbumModelState;
    effects: {
        fetchAlbum: Effect;
    };
    reducers: {
        setState: Reducer<IAlbumModelState>;
    };
};


const initialState: IAlbumModelState = {
    id: "",
    thumbnailUrl: "",
    title: "",
    summary: "",
    list: [],
    introduction: "",
    author: {
        name: "",
        avatar: ""
    }
};

const albumModel: AlbumModel = {
    namespace: "album",
    state: initialState,
    effects: {
        *fetchAlbum({ payload }, { call, put }) {
            const { data } = yield call(axios.get, ALBUM_URL);
            yield put({
                type: "setState",
                payload: data
            });
        },
    },
    reducers: {
        setState(state = initialState, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
    },
};

export default albumModel;












