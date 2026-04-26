import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {assist} from '@sanity/assist'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Shangazi',

  projectId: 'tj1gjp4u',
  dataset: 'production',

  plugins: [
    structureTool(), 
    visionTool(),
    assist()
  ],

  schema: {
    types: schemaTypes,
  },
})
