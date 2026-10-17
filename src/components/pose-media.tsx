import { useFocusEffect } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pause, Play } from 'phosphor-react-native';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { Exercise } from '@/data/types';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';

/** True when the pose has a real clip (a uri on its `media`). Clips are optional: every pose works without one. */
export const hasPoseVideo = (e: Pick<Exercise, 'media'>) => e.media.type === 'video' && !!e.media.uri;

interface Props {
  exercise: Exercise;
  /** Shown when there is no clip, while it loads, with Reduce Motion, and if it fails (the still / illustration). */
  fallback: ReactNode;
  width?: number | `${number}%`;
  height: number;
  /** Round the clip into a circle (the session player). */
  rounded?: number;
}

function Clip({ exercise, width, height, rounded, fallback }: Props) {
  const { t } = useT();
  const { colors } = useTheme();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const player = useVideoPlayer(exercise.media.uri as string, (p) => {
    p.loop = true;
    p.muted = true;
    // a clip that cannot start (offline, unsupported file) must fall back to the still, never throw
    try {
      const started = p.play() as unknown as Promise<void> | undefined;
      started?.catch?.(() => setFailed(true));
    } catch {
      setFailed(true);
    }
  });

  useEffect(() => {
    const a = player.addListener('statusChange', ({ status }) => {
      if (status === 'readyToPlay') setReady(true);
      if (status === 'error') setFailed(true);
    });
    const b = player.addListener('playingChange', ({ isPlaying }) => setPlaying(isPlaying));
    return () => {
      a.remove();
      b.remove();
    };
  }, [player]);

  // pause when the screen is not in front, resume when it comes back
  useFocusEffect(
    useCallback(() => {
      if (playing) player.play();
      return () => player.pause();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player])
  );

  if (failed) return <>{fallback}</>;
  const toggle = () => (playing ? player.pause() : player.play());
  return (
    <View style={{ width: width ?? '100%', height, borderRadius: rounded ?? 0, overflow: 'hidden' }}>
      {/* the still shows until the first frame is ready */}
      {ready ? null : (
        <View style={{ position: 'absolute', top: 0, start: 0, end: 0, bottom: 0 }}>{fallback}</View>
      )}
      <VideoView
        player={player}
        nativeControls={false}
        contentFit="cover"
        style={{ width: '100%', height: '100%' }}
        accessible
        accessibilityLabel={t('pose.videoLabel', { name: exercise.name, step: exercise.steps[0] ?? '' })}
      />
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={playing ? t('pose.pauseVideo') : t('pose.playVideo')}
        style={{
          position: 'absolute',
          top: 0,
          start: 0,
          end: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {playing ? null : (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.glassStrong,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon as={playing ? Pause : Play} size={26} weight="fill" color={colors.forest} />
          </View>
        )}
      </Pressable>
    </View>
  );
}

/**
 * The pose picture: a short looping clip when the pose has one, otherwise the still / illustration passed as
 * `fallback`. With Reduce Motion the clip is never played (the still is shown). Muted, looping, pauses off-screen.
 */
export function PoseMedia(props: Props) {
  const reduce = useReduceMotion();
  if (!hasPoseVideo(props.exercise) || reduce) return <>{props.fallback}</>;
  return <Clip {...props} />;
}
