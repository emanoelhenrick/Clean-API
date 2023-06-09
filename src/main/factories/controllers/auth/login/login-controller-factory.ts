import { LoginController } from '../../../../../presentation/controllers/auth/login/login-controller'
import { type Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../../usecases/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
