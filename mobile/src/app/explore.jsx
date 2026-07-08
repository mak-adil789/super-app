import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    ios: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    }
  });

  return (
    <ScrollView
      className="flex-1 bg-bg-light dark:bg-bg-dark"
      contentInset={insets}
      contentContainerStyle={contentPlatformStyle}>
      <ThemedView className="max-w-[800px] flex-grow bg-transparent self-center w-full">
        <ThemedView className="gap-4 items-center px-6 py-8 bg-transparent">
          <ThemedText type="subtitle" className="text-txt-light dark:text-txt-dark font-semibold">Explore</ThemedText>
          <ThemedText className="text-center text-txt-sec-light dark:text-txt-sec-dark" themeColor="textSecondary">
            This starter app includes example{'\n'}code to help you get started.
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable className="active:opacity-70">
              <ThemedView className="flex-row px-6 py-3 rounded-full justify-center gap-1 items-center bg-el-light dark:bg-el-dark">
                <ThemedText type="link" className="text-txt-light dark:text-txt-dark font-medium">Expo documentation</ThemedText>
                <SymbolView
                  tintColor={theme.text}
                  name={{ ios: 'arrow.up.right.square', android: 'link' }}
                  size={12}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <ThemedView className="gap-8 px-6 pt-4 bg-transparent">
          <Collapsible title="File-based routing">
            <ThemedText type="small" className="text-txt-light dark:text-txt-dark">
              This app has two screens: <ThemedText type="code" className="text-txt-light dark:text-txt-dark">src/app/index.jsx</ThemedText> and{' '}
              <ThemedText type="code" className="text-txt-light dark:text-txt-dark">src/app/explore.jsx</ThemedText>
            </ThemedText>
            <ThemedText type="small" className="text-txt-light dark:text-txt-dark mt-2">
              The layout file in <ThemedText type="code" className="text-txt-light dark:text-txt-dark">src/app/_layout.jsx</ThemedText> sets up
              the tab navigator.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText type="linkPrimary" className="text-[#3c87f7] font-medium mt-2">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Android, iOS, and web support">
            <ThemedView className="items-center bg-transparent">
              <ThemedText type="small" className="text-txt-light dark:text-txt-dark">
                You can open this project on Android, iOS, and the web. To open the web version,
                press <ThemedText type="smallBold" className="text-txt-light dark:text-txt-dark font-bold">w</ThemedText> in the terminal running this
                project.
              </ThemedText>
              <Image
                source={require('@/assets/images/tutorial-web.png')}
                className="w-full aspect-[296/171] rounded-xl mt-2"
              />
            </ThemedView>
          </Collapsible>

          <Collapsible title="Images">
            <ThemedText type="small" className="text-txt-light dark:text-txt-dark">
              For static images, you can use the <ThemedText type="code" className="text-txt-light dark:text-txt-dark">@2x</ThemedText> and{' '}
              <ThemedText type="code" className="text-txt-light dark:text-txt-dark">@3x</ThemedText> suffixes to provide files for different
              screen densities.
            </ThemedText>
            <Image source={require('@/assets/images/react-logo.png')} className="w-[100px] h-[100px] align-self-center my-4" />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText type="linkPrimary" className="text-[#3c87f7] font-medium">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Light and dark mode components">
            <ThemedText type="small" className="text-txt-light dark:text-txt-dark">
              This template has light and dark mode support. The{' '}
              <ThemedText type="code" className="text-txt-light dark:text-txt-dark">useColorScheme()</ThemedText> hook lets you inspect what the
              user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText type="linkPrimary" className="text-[#3c87f7] font-medium mt-2">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Animations">
            <ThemedText type="small" className="text-txt-light dark:text-txt-dark">
              This template includes an example of an animated component. The{' '}
              <ThemedText type="code" className="text-txt-light dark:text-txt-dark">src/components/ui/collapsible.jsx</ThemedText> component uses
              the powerful <ThemedText type="code" className="text-txt-light dark:text-txt-dark">react-native-reanimated</ThemedText> library to
              animate opening this hint.
            </ThemedText>
          </Collapsible>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
