import { type Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)
  readdirSync(join(__dirname, '/../routes')).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
