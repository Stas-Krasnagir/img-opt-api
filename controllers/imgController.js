const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

class ImgController {
  async oneToWebp(req, res, next) {
    try {
      if (!req.files || !req.files.img) {
        return next(res.json(ApiError.badRequest('No image file provided')));
      }
      const { img } = req.files;
      const fileExtension = path.extname(img.name).toLowerCase();
      const tempFileName = `${uuid.v4()}.${fileExtension}`;
      const tempFilePath = path.resolve(
        __dirname,
        '..',
        'static',
        'tmp',
        tempFileName,
      );
      img.mv(tempFilePath, (err) => {
        if (err) {
          console.error(err);
          return next(
            res.json(
              ApiError.badRequest('Error occurred during file upload', err),
            ),
          );
        }

        sharp(tempFilePath)
          .webp()
          .toBuffer((err, optimizedBuffer) => {
            if (err) {
              console.error(err);
              return next(
                res.json(
                  ApiError.badRequest(
                    'Error occurred during image processing',
                    err,
                  ),
                ),
              );
            }

            fs.unlinkSync(tempFilePath);

            res.set('Content-Type', 'image/webp');
            res.send(optimizedBuffer);
          });
      });
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }
}

module.exports = new ImgController();
