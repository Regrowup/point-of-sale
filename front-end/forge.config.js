module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'pos_kom',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin',
      ],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
