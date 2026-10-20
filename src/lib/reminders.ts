import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { reminderSlots } from '@/lib/reminder-times';
import type { ReminderSettings } from '@/store/types';

const CHANNEL = 'reminders';

/**
 * Make the phone's scheduled notifications match the saved reminder settings (card FN-07): cancel what was scheduled
 * and schedule one weekly notification per chosen day. Does nothing on the web or without permission. The text is a
 * gentle line that changes with the day, never a guilt trip.
 */
export async function syncReminders(
  settings: ReminderSettings,
  text: { title: string; lines: string[]; channel: string }
) {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const slots = reminderSlots(settings);
    if (!slots.length) return;
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL, {
        name: text.channel,
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    for (const s of slots) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: text.title,
          body: text.lines[(s.iso - 1) % text.lines.length],
          data: { url: '/home' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: s.weekday,
          hour: s.hour,
          minute: s.minute,
          channelId: CHANNEL,
        },
      });
    }
  } catch {
    /* reminders are a nicety: never crash the app over them */
  }
}

/** Show a reminder that arrives while the app is open as a quiet banner (no sound). */
export function configureNotificationDisplay() {
  if (Platform.OS === 'web') return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}
