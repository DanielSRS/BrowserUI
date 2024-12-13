using Windows.ApplicationModel.Core;
using Windows.UI.ViewManagement;
using Windows.UI;
using Microsoft.ReactNative.Managed;

namespace BrowserUI
{
    [ReactModule]
    class Infinity
    {
        private ReactContext context;

        [ReactInitializer]
        public void Initialize(ReactContext reactContext)
        {
            context = reactContext;
        }

        [ReactMethod("extendToTitlebar")]
        public void ExtendToTitlebar(bool extendViewIntoTitleBar)
        {
            context.Handle.UIDispatcher.Post(() => {

                // Hide default title bar.
                var coreTitleBar = CoreApplication.GetCurrentView().TitleBar;
                coreTitleBar.ExtendViewIntoTitleBar = extendViewIntoTitleBar;

                /* Sets buttons background color to transparent */
                var applicationView = ApplicationView.GetForCurrentView();
                var titleBar = applicationView.TitleBar;

                // Set active window colors
                if (extendViewIntoTitleBar)
                {
                    titleBar.ButtonBackgroundColor = Colors.Transparent;
                    titleBar.ButtonInactiveBackgroundColor = Colors.Transparent;
                } else
                {
                    titleBar.ButtonBackgroundColor = null;
                    titleBar.ButtonInactiveBackgroundColor = null;
                }
            });
        }
    }
}
