import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CarsExamples, EXAMPLE_IDS } from '../examples';
import { CreateCarDto } from '../../cars/dto/create-car.dto';
import { UpdateCarDto } from '../../cars/dto/update-car.dto';
import { applyDocs } from './apply-docs';

export const CarsControllerDocs = () =>
  applyDocs(ApiTags('Cars'), ApiBearerAuth('jwt'));

export const CarsListDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'List cars owned by the authenticated user' }),
    ApiOkResponse({
      description: 'Owner cars',
      schema: { example: CarsExamples.listResponse.value },
    }),
  );

export const CarsCreateDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Register a new car with a scanned QR sticker' }),
    ApiBody({
      type: CreateCarDto,
      examples: { default: CarsExamples.createRequest },
    }),
    ApiOkResponse({
      description: 'Created car',
      schema: { example: CarsExamples.carResponse.value },
    }),
  );

export const CarsFindOneDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Get one owned car by ID' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.carId }),
    ApiOkResponse({
      description: 'Car details',
      schema: { example: CarsExamples.carResponse.value },
    }),
  );

export const CarsUpdateDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Update an owned car' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.carId }),
    ApiBody({
      type: UpdateCarDto,
      examples: { default: CarsExamples.updateRequest },
    }),
    ApiOkResponse({
      description: 'Updated car',
      schema: { example: CarsExamples.carResponse.value },
    }),
  );

export const CarsRemoveDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Delete an owned car' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.carId }),
    ApiOkResponse({
      description: 'Deletion acknowledged',
      schema: { example: CarsExamples.deleteResponse.value },
    }),
  );

export const CarsQrDocs = () =>
  applyDocs(
    ApiOperation({ summary: 'Generate QR deep link and image for a car' }),
    ApiParam({ name: 'id', example: EXAMPLE_IDS.carId }),
    ApiOkResponse({
      description: 'QR payload',
      schema: { example: CarsExamples.qrResponse.value },
    }),
  );
