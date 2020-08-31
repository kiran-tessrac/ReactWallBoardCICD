import React, {useState, useEffect} from 'react';
import {Dimensions, Image} from 'react-native';
import {connect} from 'react-redux';
import {useNavigationComponentDidAppear} from 'react-native-navigation-hooks';
import KeyEvent from 'react-native-keyevent';
import {Navigation} from 'react-native-navigation';

import {
  countFormat,
  convertTimeLetter,
  navigateTo,
  navigateBack,
} from '../../../helpers';
import ColorsWrapper from '../../../colors';

import Loading from '../loading';

import ConfirmBase from './confirmBase';
import {t, updateLanguage} from '../../../reducers/language';
import {getConfirmCode} from '../../../reducers/user';

let timerID;
const Language = ({
  navigation,
  t,
  confirmCode,
  getConfirmCode,
  componentId,
}) => {
  const [format, setFormat] = useState(countFormat());
  const [selectedKey, setSelectedKey] = useState(0);
  const rerender = () => setFormat(countFormat());
  const {isTV, forHeight, forWidth} = format;

  const {codeLoaded, code} = confirmCode;
  const TVEventHandler = async (key) => {
    window.isTV = true;
    actions.forEach((item, index) => {
      if (item.key === Number(key) - 7) {
        setSelectedKey(index);
      }
    });
    switch (Number(key)) {
      case 7: // 0 back key
        navigateBack(componentId);
        break;
      case 13: // 6 key
        navigateTo(componentId, 'ChangeLanguage');
        break;
      case 14: // 7 key
        trigerRotation();
        break;

      case 19: {
        // UP
        if (selectedKey === 0) {
          setSelectedKey(2);
        } else {
          setSelectedKey(selectedKey - 1);
        }

        break;
      }
      case 20: {
        // down
        if (selectedKey === 2) {
          setSelectedKey(0);
        } else {
          setSelectedKey(selectedKey + 1);
        }
        break;
      }
      case 23: // okay
        if (actions[selectedKey] && actions[selectedKey].action) {
          actions[selectedKey].action();
        }
        break;
      case 66: //KEYCODE_ENTER
        if (actions[selectedKey] && actions[selectedKey].action) {
          actions[selectedKey].action();
        }
        break;
    }
  };

  const exTime = 120;
  const [seconds, setSeconds] = useState(exTime);

  const trigerTimer = () => {
    let s = exTime;

    timerID = setInterval(() => {
      if (s === 0) {
        clearInterval(timerID);
        s = exTime;
        setSeconds(s);
        (async () => {
          await getConfirmCode(trigerTimer);
        })();
        return;
      }
      const nS = s - 1;
      setSeconds(nS);
      s = nS;
    }, 1000);
  };

  useNavigationComponentDidAppear(
    (e) => {
      setTimeout(() => {
        KeyEvent.onKeyUpListener((keyEvent) => {
          console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
          TVEventHandler(keyEvent.keyCode);
        });
      }, 100);
    },
    {componentId},
  );

  useEffect(() => {
    Dimensions.addEventListener('change', rerender);
    (async () => {
      setSeconds(exTime);
      await getConfirmCode(trigerTimer);
    })();
    setTimeout(() => {
      KeyEvent.onKeyUpListener((keyEvent) => {
        console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
        TVEventHandler(keyEvent.keyCode);
      });
    }, 1000);
    return () => {
      clearInterval(timerID);
      console.log('destroy');
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  const time = convertTimeLetter(seconds);

  KeyEvent.onKeyUpListener((keyEvent) => {
    console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
    TVEventHandler(keyEvent.keyCode);
  });

  const trigerRotation = () => {
    const newOrient =
      window.orientationNow === 'portrait' ? 'landscape' : 'portrait';
    Navigation.mergeOptions(componentId, {
      layout: {
        orientation: [newOrient],
      },
    });
    window.orientationNow = newOrient;
  };
  const actions = [
    {
      name: t('main_menu', 'Main menu'),
      key: 0,
      action: () => navigateBack(componentId),
    },
    {
      name: t(
        'change_language',
        'Change language / Sprache wechseln / Verander taal',
      ),
      key: 6,
      action: () => navigateTo(componentId, 'ChangeLanguage'),
    },
  ];

  if (isTV || window.isTV) {
    actions.push({
      name: t('rotate_screen', 'Rotate screen'),
      key: 7,
      action: () => trigerRotation(),
    });
  }

  if (!codeLoaded) {
    return <Loading />;
  }

  return (
    <ConfirmBase
      {...{
        format,
        list: actions,
        selectedKey,
        header: t('activate_wallboard', 'Activate Wallboard'),
        code,
        time,
      }}
    />
  );
};

const mapStateToProps = ({language, user: {confirmCode}}) => ({
  language,
  confirmCode,
});

export default connect(mapStateToProps, {t, updateLanguage, getConfirmCode})(
  ColorsWrapper(Language),
);
