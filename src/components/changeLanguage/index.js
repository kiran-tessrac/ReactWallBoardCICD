import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';

import KeyEvent from 'react-native-keyevent';

import {countFormat, navigateBack} from '../../../helpers';
import ColorsWrapper from '../../../colors';

import ListBase from '../mainMenu/listBase';
import {t, updateLanguage} from '../../../reducers/language';

const Language = ({
  navigation,
  language,
  language: {selectedLanguage},
  t,
  updateLanguage,
  componentId,
}) => {
  const [format, setFormat] = useState(countFormat());
  const [selectedKey, setSelectedKey] = useState(0);
  const rerender = () => setFormat(countFormat());

  const setLanguage = (l) => updateLanguage(l);

  const languageArray = language.languageTiles.map((item, index) => ({
    name: item,
    key: 2 + index,
    current: selectedLanguage === item,
    action: () => setLanguage(item),
  }));
  const TVEventHandler = async (key) => {
    window.isTV = true;
    // 9 - key (2); languageArray.length + 1 - last key;  index + 2 - first key;
    actions.forEach((item, index) => {
      if (item.key === Number(key) - 7) {
        setSelectedKey(index);
      }
    });
    if (key >= 9 && key <= languageArray.length + 8) {
      const index = key - 9;
      languageArray[index].action();
      return;
    }

    switch (Number(key)) {
      case 8: // 1 key
        setLanguage('system');
        break;
      case 16: // 9 back key
        navigateBack(componentId);
        break;
      case 19: {
        // UP
        if (selectedKey === 0) {
          setSelectedKey(languageArray.length + 1);
        } else {
          setSelectedKey(selectedKey - 1);
        }

        break;
      }
      case 20: {
        // down
        if (selectedKey === languageArray.length + 1) {
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

  KeyEvent.onKeyUpListener((keyEvent) => {
    console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
    TVEventHandler(keyEvent.keyCode);
  });

  useEffect(() => {
    Dimensions.addEventListener('change', rerender);
    setTimeout(() => {
      KeyEvent.onKeyUpListener((keyEvent) => {
        console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
        TVEventHandler(keyEvent.keyCode);
      });
    }, 100);
    return () => {
      console.log('destroy');
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  const actions = [
    {
      name: t('follow_system_language', 'Follow system language'),
      key: 1,
      current: selectedLanguage === 'system' || !selectedLanguage,
      action: () => setLanguage('system'),
    },
    ...languageArray,
    {
      name: t('back', 'Back'),
      key: 9,
      action: () => navigateBack(componentId),
    },
  ];

  return (
    <ListBase
      {...{
        format,
        list: actions,
        selectedKey,
        header: t(
          'change_language',
          'Change language / Sprache wechseln / Verander taal',
        ),
      }}
    />
  );
};

const mapStateToProps = ({language}) => ({language});

export default connect(mapStateToProps, {t, updateLanguage})(
  ColorsWrapper(Language),
);
