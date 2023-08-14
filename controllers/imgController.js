const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const archiver = require("archiver");
const os = require("os");
const { promisify } = require("util");

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
      const localPath = path.resolve(__dirname, ".." + "/static" + "/local");
      const tmpPath = path.resolve(__dirname, ".." + "/static" + "/tmp");

      const getFiles = async function (dir, files_) {
        files_ = files_ || [];
        const files = fs.readdirSync(dir);
        for (let i in files) {
          const name = dir + "/" + files[i];

          if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
          } else {
            files_.push(name);
          }
        }
        return files_;
      };
      const list = await getFiles(localPath);

      // list.map(async (item) => {
      //   const inputBuffer = await promisify(fs.readFile)(item);
      //   const outputBuffer = await sharp(inputBuffer).webp().toBuffer();
      //   const filename = uuid.v4() + ".webp"; // Генерируем уникальное имя файла
      //   const outputPath = path.join(tmpPath, filename); // Полный путь до файла в tmpPath
      //   await promisify(fs.writeFile)(outputPath, outputBuffer);
      // });

      list.map(async (item) => {
        const inputBuffer = await promisify(fs.readFile)(item);
        const outputBuffer = await sharp(inputBuffer).webp().toBuffer();
        const filename = path.basename(item, path.extname(item)) + ".webp"; // Получаем исходное имя файла и заменяем расширение на .webp
        const outputPath = path.join(tmpPath, filename); // Полный путь до файла в tmpPath
        await promisify(fs.writeFile)(outputPath, outputBuffer);
      });

      res.send("ok");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}
module.exports = new ImgController();
