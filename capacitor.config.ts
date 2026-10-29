import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glimmer.stars',
  appName: '微光',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  backgroundColor: '#04060d',
  plugins: {
    SystemBars: {
      // 使用 Capacitor 注入的 --safe-area-inset-*，让 WebView 内容避开状态栏和刘海。
      insetsHandling: 'css',
      style: 'DARK',
      hidden: false,
      initialViewportFitValueHint: 'cover',
    },
  },
};

export default config;
