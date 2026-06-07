import {Linking, Platform} from 'react-native';

export const openDeviceSettings = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const canOpenAppSettings = await Linking.canOpenURL('app-settings:');
      
      if (canOpenAppSettings) {
        await Linking.openURL('app-settings:');
        return true;
      } else {
        await Linking.openSettings();
        return true;
      }
    }
    
    if (Platform.OS === 'android') {
      await Linking.openSettings();
      return true;
    }
    
    return false;
  } catch (error) {
    
    try {
      await Linking.openSettings();
      return true;
    } catch (fallbackError) {
      return false;
    }
  }
};
