import { Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { path } from 'app-root-path';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File> {
  async transform(values: any): Promise<string[] | Record<string, string>> {
    if (!values) return;

    const uploadPath = `${path}/uploads`;
    const isUploadFolderExists = fs.existsSync(uploadPath);
    if (!isUploadFolderExists) {
      fs.mkdir(uploadPath, (err) => {
        if (err) {
          console.error('Error creating directory:', err);
        } else {
          console.log('Directory created successfully.');
        }
      });
    }
    if (Array.isArray(values)) {
      const filenames = Promise.all(
        (values as Express.Multer.File[]).map(convertImage),
      );
      return filenames;
    }
    if (typeof values === 'object') {
      const result = {};
      await Promise.all(
        Object.keys(values).map(async (key) => {
          result[key] = await convertImage(values[key][0]);
        }),
      );
      return result;
    }
    return values;
  }
}
const convertImage = async (image: Express.Multer.File) => {
  const originalName = image.originalname.split('.')[0];
  const filename = Date.now() + '-' + originalName + '.webp';

  const pathToFile = `${path}/uploads/${filename}`;
  try {
    await sharp(image.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toFile(pathToFile);
  } catch (e) {
    console.log(e);
  }
  return filename;
};
