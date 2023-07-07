const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const archiver = require('archiver');
const os = require('os');

async function optimizeImage(img) {
  const fileExtension = path.extname(img.name).toLowerCase();
  const tempFileName = `${uuid.v4()}.${fileExtension}`;
  const tempFilePath = path.join(os.tmpdir(), tempFileName);
  await img.mv(tempFilePath);
  const optimizedBuffer = await sharp(tempFilePath).webp().toBuffer();
  await fs.unlink(tempFilePath);
  return optimizedBuffer;
}

class ImgController {
  async singleImgConversion(req, res, next) {
    try {
      if (!req.files || !req.files.data) {
        return next(res.json(badRequest('No image file provided')));
      }
      const { data: img } = req.files;
      const optimizedBuffer = await optimizeImage(img);
      res.set('Content-Type', 'image/webp');
      res.send(optimizedBuffer);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async multipleImgConversion(req, res, next) {
    try {
      if (!req.files || !req.files.data) {
        return next(badRequest('No image files provided'));
      }
      const { data: images } = req.files;
      const optimizedImages = await Promise.all(
        images.map((img) => optimizeImage(img)),
      );

      if (req.body?.archive) {
        const archive = archiver('zip', {
          zlib: { level: 9 },
        });
        optimizedImages.forEach((image, index) => {
          archive.append(image, { name: `image${index}.webp` });
        });
        archive.finalize();
        res.attachment('images.zip');
        archive.pipe(res);
        return;
      }

      res.set('Content-Type', 'image/webp');
      res.send(optimizedImages);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}
module.exports = new ImgController();
