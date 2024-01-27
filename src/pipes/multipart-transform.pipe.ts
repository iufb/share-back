import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { BAD_JSON_ERROR } from 'src/pipes/constants';

@Injectable()
export class MultipartBodyTransformPipe implements PipeTransform {
  key: string;
  constructor(key: string) {
    this.key = key;
  }
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;
    if (metadata.type === 'body') {
      if (!value[this.key]) return value;
      try {
        return JSON.parse(value[this.key]);
      } catch (e) {
        throw new BadRequestException(BAD_JSON_ERROR);
      }
    } else {
      return value;
    }
  }
}
