import {Linking, Platform} from 'react-native';
import {openDeviceSettings} from '../deviceSettings';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openSettings: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
}));

describe('deviceSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('openDeviceSettings', () => {
    it('should call Linking.openURL with app-settings on iOS when available', async () => {
      Platform.OS = 'ios';
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (Linking.openURL as jest.Mock).mockResolvedValue(undefined);

      const result = await openDeviceSettings();

      expect(Linking.canOpenURL).toHaveBeenCalledWith('app-settings:');
      expect(Linking.openURL).toHaveBeenCalledWith('app-settings:');
      expect(result).toBe(true);
    });

    it('should fallback to openSettings on iOS when app-settings is not available', async () => {
      Platform.OS = 'ios';
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(false);
      (Linking.openSettings as jest.Mock).mockResolvedValue(undefined);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await openDeviceSettings();

      expect(Linking.canOpenURL).toHaveBeenCalledWith('app-settings:');
      expect(Linking.openSettings).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'app-settings: not available, falling back to openSettings()',
      );
      expect(result).toBe(true);

      consoleWarnSpy.mockRestore();
    });

    it('should call Linking.openSettings on Android', async () => {
      Platform.OS = 'android';
      (Linking.openSettings as jest.Mock).mockResolvedValue(undefined);

      const result = await openDeviceSettings();

      expect(Linking.openSettings).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should handle errors gracefully with fallback', async () => {
      Platform.OS = 'ios';
      const error = new Error('Failed to open settings');
      (Linking.canOpenURL as jest.Mock).mockRejectedValue(error);
      (Linking.openSettings as jest.Mock).mockResolvedValue(undefined);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await openDeviceSettings();

      expect(result).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error opening device settings:',
        error,
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Attempting fallback to Linking.openSettings()',
      );
      expect(Linking.openSettings).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });

    it('should return false when both primary and fallback fail', async () => {
      Platform.OS = 'ios';
      const error = new Error('Failed to open settings');
      (Linking.canOpenURL as jest.Mock).mockRejectedValue(error);
      (Linking.openSettings as jest.Mock).mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await openDeviceSettings();

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);

      consoleErrorSpy.mockRestore();
    });

    it('should return false on unsupported platforms', async () => {
      Platform.OS = 'web' as typeof Platform.OS;

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await openDeviceSettings();

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'openSettings is not supported on this platform',
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
