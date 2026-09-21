import { registerWebModule, NativeModule } from 'expo';

class AndroidLauncherModule extends NativeModule<{}> {}

export default registerWebModule(AndroidLauncherModule, 'AndroidLauncherModule');
