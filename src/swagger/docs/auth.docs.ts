import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthExamples } from '../examples';
import { LoginDto } from '../../auth/dto/login.dto';
import { RegisterDto } from '../../auth/dto/register.dto';
import { applyDocs } from './apply-docs';

export const AuthControllerDocs = () => applyDocs(ApiTags('Auth'));

export const AuthRegisterDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Register a new car owner account' }),
    ApiBody({
      type: RegisterDto,
      examples: { default: AuthExamples.registerRequest },
    }),
    ApiCreatedResponse({
      description: 'Account created; returns JWT and user profile',
      schema: { example: AuthExamples.sessionResponse.value },
    }),
  );

export const AuthLoginDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Login with email and password' }),
    ApiBody({
      type: LoginDto,
      examples: { default: AuthExamples.loginRequest },
    }),
    ApiOkResponse({
      description: 'Authenticated session',
      schema: { example: AuthExamples.sessionResponse.value },
    }),
  );
