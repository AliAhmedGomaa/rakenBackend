import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersExamples } from '../examples';
import { UpdateProfileDto } from '../../users/dto/update-profile.dto';
import { applyDocs } from './apply-docs';

export const UsersControllerDocs = () =>
  applyDocs(ApiTags('Users'), ApiBearerAuth('jwt'));

export const UsersMeDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Get the authenticated user profile' }),
    ApiOkResponse({
      description: 'Current user',
      schema: { example: UsersExamples.profileResponse.value },
    }),
  );

export const UsersUpdateMeDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Update the authenticated user profile' }),
    ApiBody({
      type: UpdateProfileDto,
      examples: { default: UsersExamples.updateProfileRequest },
    }),
    ApiOkResponse({
      description: 'Updated profile',
      schema: { example: UsersExamples.profileResponse.value },
    }),
  );
