const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const package = require('./package.json');

module.exports = {
  packagerConfig: {
    asar: true,
    appBundleId: "com.ds1nc.anidesk",
    name: "AniDesk",
    appCopyright: "DesConnet, hack1exe",
    icon: "icon/icon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'AniDesk',
        iconUrl: "https://anidesk.ds1nc.ru/anidesk-icon.ico",
        setupExe: `${package.name}-${package.version}-win32.exe`,
        setupIcon: 'icon/icon.ico',
        loadingGif: 'icon/install-anim.gif'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          name: "anidesk",
          productName: "AniDesk",
          icon: "icon/icon.ico",
          maintainer: 'DesConnet, hack1exe',
          homepage: "https://anidesk.ds1nc.ru",
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        options: {
          id: 'com.ds1nc.anidesk',
          productName: 'AniDesk',
          genericName: 'Anime Client',
          description: 'Unofficial desktop client of Anixart',
          categories: ['Video', 'AudioVideo', 'Network'],
          mimeType: [],
          icon: 'public/assets/icons/anidesk-icon.png',
          homepage: 'https://anidesk.ds1nc.ru',
          license: 'GPL-2.0',
          branch: 'stable',
          runtimeVersion: '23.08',
          baseVersion: '23.08',
          finishArgs: [
            '--share=ipc',
            '--socket=x11',
            '--socket=wayland',
            '--socket=pulseaudio',
            '--share=network',
            '--device=dri',
            '--talk-name=org.freedesktop.Notifications',
            '--talk-name=org.kde.StatusNotifierWatcher',
            '--filesystem=xdg-videos:ro',
          ],
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
