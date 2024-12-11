﻿// AutolinkedNativeModules.g.cs contents generated by "npx @react-native-community/cli autolink-windows"

using System.Collections.Generic;

// Namespaces from react-native-svg
using RNSVG;

// Namespaces from @react-native-async-storage/async-storage
using ReactNativeAsyncStorage;

// Namespaces from @react-native-community/datetimepicker
using DateTimePicker;

// Namespaces from @react-native-community/slider
using SliderWindows;

namespace Microsoft.ReactNative.Managed
{
    internal static class AutolinkedNativeModules
    {
        internal static void RegisterAutolinkedNativeModulePackages(IList<IReactPackageProvider> packageProviders)
        { 
            // IReactPackageProviders from react-native-svg
            packageProviders.Add(new RNSVG.ReactPackageProvider());
            // IReactPackageProviders from @react-native-async-storage/async-storage
            packageProviders.Add(new ReactNativeAsyncStorage.ReactPackageProvider());
            // IReactPackageProviders from @react-native-community/datetimepicker
            packageProviders.Add(new DateTimePicker.ReactPackageProvider());
            // IReactPackageProviders from @react-native-community/slider
            packageProviders.Add(new SliderWindows.ReactPackageProvider());
        }
    }
}