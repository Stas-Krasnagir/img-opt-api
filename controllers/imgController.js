const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const archiver = require("archiver");
const os = require("os");
const { promisify } = require("util");
const mime = require("mime-types");

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
        return next(res.json(ApiError.badRequest("No image file provided")));
      }
      const { data: img } = req.files;
      const optimizedBuffer = await optimizeImage(img);
      res.set("Content-Type", "image/webp");
      res.send(optimizedBuffer);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async multipleImgConversion(req, res, next) {
    console.log(req.files);
    try {
      if (!req.files || !req.files.data) {
        return next(ApiError.badRequest("No image files provided"));
      }
      const { data: images } = req.files;
      const optimizedImages = await Promise.all(
        images.map((img) => optimizeImage(img))
      );

      if (req.body?.archive) {
        const archive = archiver("zip", {
          zlib: { level: 9 },
        });
        optimizedImages.forEach((image, index) => {
          archive.append(image, { name: `image${index}.webp` });
        });
        archive.finalize();
        res.attachment("images.zip");
        archive.pipe(res);
        return;
      }

      res.set("Content-Type", "image/webp");
      res.send(optimizedImages);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async localConversion(req, res, next) {
    try {
      const localPath = path.resolve(__dirname, "..", "static", "local");
      const tmpPath = path.resolve(__dirname, "..", "static", "tmp");

      const getFiles = async function (dir) {
        const files = await fs.promises.readdir(dir);
        const fileList = [];
        for (const file of files) {
          const name = path.join(dir, file);
          const stats = await fs.promises.stat(name);
          if (stats.isDirectory()) {
            const subFiles = await getFiles(name);
            fileList.push(...subFiles);
          } else {
            fileList.push(name);
          }
        }
        return fileList;
      };
      const list = await getFiles(localPath);

      for (const item of list) {
        const filename = path.basename(item);
        const mimeType = mime.lookup(filename);
        if (
          mimeType &&
          mimeType.startsWith("image/") &&
          filename !== "tpm.md"
        ) {
          try {
            const inputBuffer = await fs.promises.readFile(item);
            const outputBuffer = await sharp(inputBuffer).webp().toBuffer();
            const outputFilename =
              path.basename(item, path.extname(item)) + ".webp";
            const outputPath = path.join(tmpPath, outputFilename);
            await fs.promises.writeFile(outputPath, outputBuffer);
            await fs.promises.unlink(item);
          } catch (error) {
            console.error("Ошибка при обработке файла:", item);
          }
        }
      }

      res.send("ok");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}
module.exports = new ImgController();
