import { NativeModule, requireNativeModule } from 'expo';

declare class AndroidLauncherModule extends NativeModule<{}> {}

export default requireNativeModule<AndroidLauncherModule>('AndroidLauncher');
