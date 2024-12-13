import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';

export interface Spec extends TurboModule {
    extendToTitlebar(extendViewIntoTitleBar: boolean): void;
}

export default TurboModuleRegistry.get<Spec>(
  'Infinity'
) as Spec | null;
