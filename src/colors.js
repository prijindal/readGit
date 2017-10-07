// @flow
import color from 'color';

export const transparent = 'rgba(0, 0, 0, 0)';

export const primary = '#212121';

export const primaryDark = '#000000';
export const primaryLight = '#484848';

export const errorColor = color('#FF1744')
  .alpha(0.87)
  .hsl();

export const white = '#fff';

export const background = '#F5F5F6';

export const textLightPrimary = color(white)
  .alpha(1)
  .hsl();
export const textLightSecondary = color(white)
  .alpha(0.7)
  .hsl();
export const textLightDivider = color(white)
  .alpha(0.54)
  .hsl();
export const textLightDisabled = color(white)
  .alpha(0.12)
  .hsl();

export const textDark = '#000000';
export const textDarkPrimary = color(textDark)
  .alpha(0.87)
  .hsl();
export const textDarkSecondary = color(textDark)
  .alpha(0.54)
  .hsl();
export const textDarkDivider = color(textDark)
  .alpha(0.3)
  .hsl();
export const textDarkDisabled = color(textDark)
  .alpha(0.12)
  .hsl();

export const textPrimary = textLightPrimary;
export const textSecondary = textLightSecondary;
export const textDivider = textLightDivider;
export const textDisabled = textLightDisabled;

export const tabBarOptions = {
  activeTintColor: textPrimary,
  inactiveTintColor: textSecondary,
  scrollEnabled: false,
  labelStyle: {
    fontSize: 14,
    color: textPrimary,
  },
  tabStyle: {
    height: 48,
  },
  style: {
    backgroundColor: primaryLight,
  },
  indicatorStyle: {
    backgroundColor: primaryDark,
    height: 3,
  },
};
