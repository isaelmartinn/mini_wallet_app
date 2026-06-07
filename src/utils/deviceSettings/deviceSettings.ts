import { Linking, Platform } from 'react-native';

export const openDeviceSettings = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const canOpenAppSettings = await Linking.canOpenURL('app-settings:');

      if (canOpenAppSettings) {
        await Linking.openURL('app-settings:');
        return true;
      } else {
        console.warn(
          'app-settings: not available, falling back to openSettings()',
        );
        await Linking.openSettings();
        return true;
      }
    }

    if (Platform.OS === 'android') {
      await Linking.openSettings();
      return true;
    }

    console.warn('openSettings is not supported on this platform');
    return false;
  } catch (error) {
    console.error('Error opening device settings:', error);

    try {
      console.log('Attempting fallback to Linking.openSettings()');
      await Linking.openSettings();
      return true;
    } catch (fallbackError) {
      console.error('Error opening device settings:', fallbackError);
      return false;
    }
  }
};
