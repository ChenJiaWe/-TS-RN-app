package com.ximalaya;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ximalaya";
  }
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
      return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    //显示启动屏，第二个参数是自定义主题的引用
      SplashScreen.show(this,R.style.SplashScreenTheme);  // here 
      super.onCreate(savedInstanceState);
  }
}
