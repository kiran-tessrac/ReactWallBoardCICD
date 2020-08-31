import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Platform, NativeModules, View, ActivityIndicator} from 'react-native';

import {getLanguage} from '../../../reducers/language';
import {initUser} from '../../../reducers/user';

import {startApp} from '../../../App';

import RNReactNativeLocale from 'react-native-locale-listener';
import RNRestart from 'react-native-restart';

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages //iOS 13
    : NativeModules.I18nManager.localeIdentifier;

const LookUp = ({
  language: {langiageLoaded},
  getLanguage,
  initUser,
  children,
  userIP,
}) => {
  const changeLayout = (language) => {
    if (deviceLanguage !== language) {
      RNRestart.Restart();
    }
  };

  useEffect(() => {
    (async () => {
      await getLanguage();
      await initUser();
    })();

    RNReactNativeLocale.addLocaleListener(changeLayout);

    return () => {
      RNReactNativeLocale.removeLocaleListener(changeLayout);
    };
  }, []);

  useEffect(() => {
    if (langiageLoaded && userIP.loaded) {
      startApp();
    }
  }, [langiageLoaded, userIP.loaded]);

  // if (!langiageLoaded || !userIP.loaded) {
  //   return (
  //     <View
  //       style={[
  //         {
  //           flex: 1,
  //           justifyContent: 'center',
  //           alignContent: 'center',
  //           backgroundColor: 'white',
  //         },
  //       ]}>
  //       <ActivityIndicator size="large" color="#777777" />
  //     </View>
  //   );
  // }

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
          backgroundColor: '#E2E3E4',
        },
      ]}>
      <ActivityIndicator size="large" color="#777777" />
    </View>
  );
};

const mapStateToProps = ({language, user: {userIP}}) => ({language, userIP});

export default connect(mapStateToProps, {getLanguage, initUser})(LookUp);
