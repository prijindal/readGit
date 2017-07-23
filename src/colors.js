// @flow
import color from 'color';

export const transparent = 'rgba(0, 0, 0, 0)';

export const primary = '#9C27B0';

export const primaryDark = '#7b1fa2';

export const accent = '#b2ff59';

export const errorColor = color('#FF1744').alpha(0.87).hsl();

export const white = '#fff';

export const textPrimary = color(white).alpha(1).hsl();
export const textSecondary = color(white).alpha(0.7).hsl();
export const textDivider = color(white).alpha(0.54).hsl();
export const textDisabled = color(white).alpha(0.12).hsl();

export const textDark = '#000000';
export const textDarkPrimary = color(textDark).alpha(0.87).hsl();
export const textDarkSecondary = color(textDark).alpha(0.54).hsl();
export const textDarkDivider = color(textDark).alpha(0.12).hsl();;

export const tabBarOptions = {
  activeTintColor: textPrimary,
  inactiveTintColor: textSecondary,
  scrollEnabled: false,
  labelStyle: {
    fontSize: 14,
    color: textPrimary
  },
  tabStyle: {
    height: 48,
  },
  style: {
    backgroundColor: primary
  },
  indicatorStyle: {
    backgroundColor: accent,
    height: 2
  }
}
