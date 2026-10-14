import { MotiView } from 'moti';
import { cssInterop } from 'nativewind';

/**
 * NativeWind only styles components it knows about. Moti's views are third-party, so without this
 * `className` on <MotiView> is silently ignored on iOS/Android (it only appears to work on web).
 * Import once at the root (see src/app/_layout.tsx).
 */
cssInterop(MotiView, { className: 'style' });
