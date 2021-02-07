import Sound from "react-native-sound";


//在静音模式下启用播放
Sound.setCategory("Playback");

let sound: Sound;

//创建播放器 
const init = (url: string) => {
    return new Promise((resolve, reject) => {
        // if(sound){
        //     // sound.release();
        // };
        sound = new Sound(url, "", error => {
            if (error) {
                reject(error);
            } else {
                resolve("");
            }
        });
    });
};

const play = () => {
    return new Promise((resolve, reject) => {
        if (sound) {
            sound.play(success => {
                if (success) {
                    resolve("");
                } else {
                    reject();
                };
                //释放资源
                // sound.release();
            });
        } else {
            reject();
        }
    });
};

const pause = () => {
    return new Promise((resolve, reject) => {
        if (sound) {
            sound.pause(() => {
                resolve("");
            });
        } else {
            reject();
        }
    });
};

const stop = () => {
    return new Promise((resolve, reject) => {
        if (sound) {
            sound.stop(() => {
                resolve("");
            });
        } else {
            reject();
        }
    });
};


const getCurrentTime = () => {
    return new Promise((resolve, reject) => {
        if (sound && sound.isLoaded()) {
            sound.getCurrentTime(seconds => {
                resolve(seconds);
            });
        } else {
            reject();
        };
    });
};


const setCurrentTime = (second: number) => {
    console.log(second);
    if (sound) {
        sound.setCurrentTime(second);
    };
};

//获取音频时长
const getDuration = () => {
    if (sound) {
        return sound.getDuration();
    };
    return 0;
};


export {
    sound, init, play,
    pause, getCurrentTime,
    getDuration, stop, setCurrentTime
};
