import { type Request, type Response } from 'express'
import { type Controller, type HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: req.body }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 400 && httpResponse.statusCode <= 599) {
      return res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message })
    }
    return res
      .status(httpResponse.statusCode)
      .json(httpResponse.body)
  }
}
