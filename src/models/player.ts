import { saveProgram } from "@/config/realm";
import { getCurrentTime, getDuration, init, pause, play, setCurrentTime, stop } from "@/config/sound";
import storage, { load } from "@/config/storage";
import axios from "axios";
import { Effect, EffectsCommandMap, EffectWithType, Model, SubscriptionsMapObject } from "dva-core-ts";
import { Reducer } from "redux";
import { RootState } from ".";

const SHOW_URL = "/mock/15/show";

export interface PlayerModelState {
    id: string;
    soundUrl: string;
    playState: string;
    currentTime: number;
    duration: number;
    previousId: string;
    nextId: string;
    sounds: { id: string; title: string }[];
    title: string;
    thumbnailUrl: string;
};

export interface PlayerModel extends Model {
    namespace: "player";
    state: PlayerModelState;
    reducers: {
        setState: Reducer<PlayerModelState>;
    };
    effects: {
        fetchShow: Effect;
        play: Effect;
        pause: Effect;
        watcherCurrentTime: EffectWithType;
        previous: Effect;
        next: Effect;
        setCurrentTime: Effect;
        loadData: Effect;
    };
    subscriptions?: SubscriptionsMapObject;
};

const delay = (timeout: number) =>
    (new Promise(resolve => setTimeout(resolve, timeout)));



function* currentTime({ call, put }: EffectsCommandMap) {
    while (true) {
        yield call(delay, 1000);
        try {
            const currentTime = yield call(getCurrentTime);
            yield put({
                type: "setState",
                payload: {
                    currentTime,
                }
            });
        } catch (error) {
        }
    };
};


const initialState: PlayerModelState = {
    id: "",
    soundUrl: "",
    playState: "paused",
    currentTime: 0,
    duration: 0,
    previousId: "",
    nextId: "",
    sounds: [],
    title: "",
    thumbnailUrl: ""
};

const playerModel: PlayerModel = {
    namespace: "player",
    state: initialState,
    reducers: {
        setState(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        }
    },
    effects: {
        *loadData(_, { call, put }) {
            const player = yield call(load, { key: "player" });
            yield put({
                type: "setState",
                payload: {
                    ...player,
                    playState: "paused"
                }
            });
            if (player) {
                yield call(init, player.soundUrl);
            }
        },
        *fetchShow({ payload }, { call, put, select }) {
            try {
                yield call(stop);
            } catch (error) {
            };
            const { data } = yield call(axios.get,
                SHOW_URL, {
                params: { id: payload.id }
            });
            yield put({
                type: "setState",
                payload: {
                    playState: "paused"
                }
            });
            yield call(init, data.soundUrl);
            yield put({
                type: "setState",
                payload: {
                    id: payload.id,
                    soundUrl: data.soundUrl,
                    duration: getDuration()
                }
            });
            yield put({
                type: "play"
            });
            //保存到本地数据库中
            const { id, title,
                thumbnailUrl, currentTime }: PlayerModelState =
                yield select(({ player }: RootState) => player);

            saveProgram({
                id,
                title,
                thumbnailUrl,
                currentTime,
                duration: getDuration()
            })
        },
        *play({ payload }, { call, put, select }) {
            const player: PlayerModelState = yield select(({ player }: RootState) => player);
            storage.save({
                key: "player",
                data: {
                    ...player,
                    payload: {
                        playState: "paused"
                    }
                }
            });
            yield put({
                type: "setState",
                payload: {
                    playState: "playing"
                }
            });

            yield call(play);
            yield put({
                type: "setState",
                payload: {
                    playState: "paused"
                }
            });

        },
        *pause({ payload }, { call, put, select }) {
            yield call(pause);
            yield put({
                type: "setState",
                payload: {
                    playState: "paused"
                }
            });

            const { id, currentTime }: PlayerModelState =
                yield select(({ player }: RootState) => player);

            saveProgram({
                id,
                currentTime,
            });
        },
        watcherCurrentTime: [function* (sagaEffects) {
            const { call, take, race } = sagaEffects;
            while (true) {
                //当调用play开始执行，相当于监听
                yield take("play");
                yield race([call(currentTime, sagaEffects), take("pause")]);
            }

        }, { type: "watcher" }],
        *previous({ payload }, { call, put, select }) {
            // yield call(stop);
            const { id, sounds }: PlayerModelState =
                yield select(({ player }: RootState) => player);
            const index = sounds.findIndex(item => item.id === id);
            const currentIndex = index - 1;
            const currentItem = sounds[currentIndex];
            const previousItem = sounds[currentIndex - 1];
            yield put({
                type: "setState",
                payload: {
                    playState: "paused",
                    id: currentItem.id,
                    title: currentItem.title,
                    previousId: previousItem ? previousItem.id : "",
                    nextId: id
                }
            });
            yield put({
                type: "fetchShow",
                payload: {
                    id: currentItem.id
                }
            });
        },
        *next({ payload }, { call, put, select }) {
            // yield call(stop);
            const { id, sounds }: PlayerModelState =
                yield select(({ player }: RootState) => player);
            const index = sounds.findIndex(item => item.id === id);
            const currentIndex = index + 1;
            const currentItem = sounds[currentIndex];
            const nextItem = sounds[currentIndex + 1];
            yield put({
                type: "setState",
                payload: {
                    playState: "paused",
                    id: currentItem.id,
                    title: currentItem.title,
                    previousId: id,
                    nextId: nextItem ? nextItem.id : ""
                }
            });
            yield put({
                type: "fetchShow",
                payload: {
                    id: currentItem.id
                }
            });
        },
        *setCurrentTime({ payload }, { call, put }) {
            const { currentTime } = payload;
            yield call(setCurrentTime, currentTime);
            yield put({
                type: "setState",
                currentTime
            })
        }
    },
    subscriptions: {
        setUp({ dispatch }) {
            dispatch({
                type: "loadData"
            });
        },
        asyncStorage() {
            storage.sync.player = async () => {
                return null
            }
        }
    }
};


export default playerModel;