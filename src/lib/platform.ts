type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
};

export function isNativeShell(): boolean {
  if (typeof window === 'undefined') return false;
  return (window as Window & { Capacitor?: CapacitorGlobal }).Capacitor?.isNativePlatform?.() === true;
}
