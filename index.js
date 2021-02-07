/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import App from './src';
import { name as appName } from './app.json';

if (!__DEV__) {
    //避免生成环境中打印日志
    const emptyFinc = () => { };
    global.console.log = emptyFinc;
    global.console.info = emptyFinc;
    global.console.warn = emptyFinc;
    global.console.error = emptyFinc;
};

AppRegistry.registerComponent(appName, () => App);
