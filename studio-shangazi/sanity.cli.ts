import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  project: {
    // Studio is publicly mounted at /studio by Vercel Services.
    basePath: '/studio',
  },
  api: {
    projectId: 'tj1gjp4u',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
    appId: 'e8jg16n1ysoiej2qk7gj248p',
  },
})
