const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

class ImgController {
  async singleImgConversion(req, res, next) {
    try {
      if (!req.files || !req.files.data) {
        return next(res.json(ApiError.badRequest('No image file provided')));
      }
      const { data: img } = req.files;
      const fileExtension = path.extname(img.name).toLowerCase();
      const tempFileName = `${uuid.v4()}.${fileExtension}`;
      const tempFilePath = path.resolve(
        __dirname,
        '..',
        'static',
        'tmp',
        tempFileName,
      );
      await img.mv(tempFilePath);
      const optimizedBuffer = await sharp(tempFilePath).webp().toBuffer();
      await fs.unlink(tempFilePath);
      res.set('Content-Type', 'image/webp');
      res.send(optimizedBuffer);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async multipleImgConversion(req, res, next) {
    try {
      if (!req.files || !req.files.data) {
        return next(ApiError.badRequest('No image files provided'));
      }
      const { data: images } = req.files;
      const optimizedImages = await Promise.all(
        images.map(async (img) => {
          const fileExtension = path.extname(img.name).toLowerCase();
          const tempFileName = `${uuid.v4()}.${fileExtension}`;
          const tempFilePath = path.resolve(
            __dirname,
            '..',
            'static',
            'tmp',
            tempFileName,
          );
          await img.mv(tempFilePath);
          const optimizedBuffer = await sharp(tempFilePath).webp().toBuffer();
          await fs.unlink(tempFilePath);
          return optimizedBuffer;
        }),
      );
      console.log('optimizedImages', optimizedImages);
      res.set('Content-Type', 'image/webp');
      res.send(optimizedImages);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}
module.exports = new ImgController();
