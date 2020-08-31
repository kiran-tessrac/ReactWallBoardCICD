import React, {useEffect, useState} from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import {isIphoneX} from 'react-native-device-detection';

import ColorsWrapper from '../../../colors';
import {connect} from 'react-redux';
import {font} from '../../../helpers';

import Logo from '../../../assets/icons/logo.svg';
import {t} from '../../../reducers/language';

const ListBase = ({
  Colors,
  t,
  format,
  list,
  header,
  selectedKey,
  code,
  time,
}) => {
  const {scale, isTV, isPortrail} = format;
  const lineText = {
    color: Colors('label'),
    fontSize: scale(12, false),
    letterSpacing: scale(0.1, false),
    ...font.medium,
  };

  return (
    <View
      style={{
        backgroundColor: Colors('menuBackground'),
        flex: 1,
        paddingTop: scale(isPortrail ? 0 : 21),
        flexDirection: 'column',
      }}>
      <View
        style={{
          position: 'absolute',
          top: scale(isIphoneX && isPortrail ? 80 : 20),
          left: scale(isIphoneX && !isPortrail ? 80 : 20),
        }}>
        <Logo width={scale(52)} height={scale(18)} />
      </View>
      <View
        style={{
          height: '100%',
          justifyContent: 'space-between',
          //   justifyContent: isPortrail ? 'center' : 'flex-start',
        }}>
        <View
          style={{
            justifyContent: isPortrail ? 'center' : 'flex-start',
            height: isPortrail ? '70%' : '57.5%',
            paddingLeft: scale(isPortrail ? 30 : 20),
          }}>
          <Text
            style={{
              color: Colors('label'),
              fontSize: scale(18.8, false),
              textTransform: 'uppercase',
              letterSpacing: scale(0.7, false),
              marginLeft: isPortrail ? 0 : '15.5%',
              ...font.black,
            }}>
            {header}
          </Text>
          <View
            style={{
              //   height: '100%',
              marginLeft: isPortrail ? 0 : '15.5%',
              marginTop: scale(isPortrail ? 21 : 15),
              paddingLeft: scale(2),
            }}>
            <Text style={{...lineText}}>
              {t(
                'use_anouther_activated',
                '1. Use another device that is already activated',
              )}
            </Text>
            <Text style={{...lineText, marginTop: scale(isPortrail ? 20 : 15)}}>
              {t(
                'on_this_other_device_confirm_this_code',
                '2. On this other device, confirm this code:',
              )}
            </Text>
            <View
              style={{
                marginLeft: scale(68),
                marginTop: scale(10),
              }}>
              <View
                style={{
                  backgroundColor: Colors('fieldBackground'),
                  height: scale(45),
                  width: scale(174),
                }}>
                <Text
                  style={{
                    color: Colors('label'),
                    fontSize: scale(40, false),
                    letterSpacing: scale(8, false),
                    lineHeight: scale(47),
                    textAlign: 'center',
                    ...font.normal,
                  }}>
                  {code}
                </Text>
                <Text
                  style={{
                    color: Colors('secondaryLabel'),
                    fontSize: scale(9),
                    textAlign: 'center',
                    marginTop: scale(1),
                    letterSpacing: scale(0.1, false),
                    ...font.normal,
                  }}>
                  {t('code_expires_in', 'Code expires in')}: {time.m}:{time.s}
                </Text>
              </View>
            </View>
            <Text style={{...lineText, marginTop: scale(23)}}>
              3. {t('ready', 'Ready')}!
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Colors('otheroptionsBackground'),
            borderTopWidth: scale(0.5),
            borderTopColor: Colors('Hairline'),
            width: '100%',
            paddingBottom: scale(20),
          }}>
          <View
            style={{
              paddingLeft: scale(isPortrail ? 30 : 12),
              marginLeft: isPortrail ? 0 : '15.5%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: scale(4),
                marginTop: scale(14),
                marginBottom: scale(9),
              }}>
              <Text
                style={{
                  color: Colors('label'),
                  fontSize: scale(14),
                  letterSpacing: scale(0.7, false),
                  ...font.bold,
                }}>
                {t('other_options', 'Other options')}
              </Text>
              <Text
                style={{
                  color: Colors('secondaryLabel'),
                  fontSize: scale(10),
                  marginLeft: scale(6),
                  ...font.normal,
                }}>
                ({t('use_remote_tv', 'you can use the remote of your Smart TV')}
                )
              </Text>
            </View>
            {list.map((item, index) => (
              <TouchableWithoutFeedback
                key={`menu-item-${item.key}`}
                onPress={() => {
                  if (item.action) {
                    item.action();
                  }
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: scale(1.5, false),
                    paddingBottom: scale(5, false),
                    paddingTop: scale(5, false),
                    paddingLeft: scale(5, false),
                    width: scale(350),
                    backgroundColor:
                      index === selectedKey && (isTV || window.isTV)
                        ? Colors('Hairline')
                        : Colors('otheroptionsBackground'),
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors('secondaryLabel'),
                      width: scale(20),
                      height: scale(20),
                      borderRadius: scale(20) / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#4A4A4A',
                      shadowOffset: {
                        width: 0,
                        height: scale(2),
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: scale(1),
                      elevation: 2,
                      marginRight: scale(8, false),
                    }}>
                    <Text
                      style={{
                        color: Colors('invertedLabel'),
                        fontSize: scale(12, false),
                        ...font.normal,
                      }}>
                      {item.key}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: Colors('label'),
                      fontSize: scale(10, false),
                      letterSpacing: scale(0.55, false),
                      ...font.medium,
                    }}>
                    {item.name}{' '}
                    {item.current && (
                      <Text
                        style={{
                          color: Colors('secondaryLabel'),
                          fontSize: scale(8),
                          ...font.normal,
                        }}>
                        ({t('currently_selected', 'Currently selected')})
                      </Text>
                    )}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default connect(null, {t})(ColorsWrapper(ListBase));
