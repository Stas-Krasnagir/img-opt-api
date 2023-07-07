// const { Gallery } = require('../models/models');
const ApiError = require('../error/ApiError');
// const uuid = require('uuid');
// const path = require('path');
// const fs = require('fs');

class ImgController {
  // async create(req, res, next) {
  //   try {
  //     const { type } = req.body;
  //     const { img } = req.files;

  //     const fileExtension = img.name.split('.').pop().toLowerCase();
  //     const fileName = 'gallery_' + uuid.v4() + '.' + fileExtension;
  //     const link = process.env.REACT_APP_API_URL + 'gallery/' + fileName;
  //     await img.mv(
  //       path.resolve(__dirname, '..', 'static', 'gallery', fileName),
  //     );

  //     const imgGallery = await Gallery.create({
  //       type: type,
  //       src: link,
  //       fileName: fileName,
  //     });

  //     return res.json(imgGallery);
  //   } catch (e) {
  //     next(res.json(ApiError.badRequest(e.message)));
  //   }
  // }

  // async getAll(req, res, next) {
  //   try {
  //     // let imgs = await Gallery.findAll();
  //     // if (imgs.length) {
  //     //   const tmp = { items: imgs.reverse() };
  //     //   return res.json(tmp);
  //     // }
  //     let { type, limit, page } = req.query;
  //     page = page || 1;
  //     limit = limit || 6;
  //     let offset = page * limit - limit;
  //     let imgs;
  //     if (!type) {
  //       imgs = await Gallery.findAndCountAll({ limit, offset });
  //     }
  //     if (type) {
  //       imgs = await Gallery.findAndCountAll({
  //         where: { type },
  //         limit,
  //         offset,
  //       });
  //     }
  //     if (imgs.count) {
  //       let tmp = { count: imgs.count, items: imgs.rows.reverse() };
  //       return res.json(tmp);
  //     }
  //     next(res.json(ApiError.badRequest('Items not found')));
  //   } catch (e) {
  //     next(res.json(ApiError.badRequest(e.message)));
  //   }
  // }
  // async dropTable(req, res, next) {
  //   try {
  //     let imgs = await Gallery.findAll();
  //     if (imgs.length) {
  //       imgs.map((item) => {
  //         const imgPath = path.resolve(
  //           __dirname,
  //           '..',
  //           'static',
  //           'gallery',
  //           item.fileName,
  //         );
  //         fs.unlinkSync(imgPath);

  //         Gallery.destroy({
  //           where: {
  //             id: item.id,
  //           },
  //         });
  //       });
  //       return res
  //         .status(200)
  //         .json({ status: 200, message: 'Gallery table dropped!' });
  //     }
  //     next(res.json(ApiError.badRequest('Items not found')));
  //     return res.status(200).json(imgs);
  //   } catch (e) {
  //     next(res.json(ApiError.badRequest(e.message)));
  //   }
  // }

  // async getOne(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const img = await Gallery.findOne({
  //       where: {
  //         id,
  //       },
  //     });
  //     if (img) {
  //       return res.json(img);
  //     }
  //     next(res.json(ApiError.badRequest('Item not found')));
  //   } catch (e) {
  //     next(res.json(ApiError.badRequest(e.message)));
  //   }
  // }

  // async deleteOne(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const findImg = await Gallery.findOne({
  //       where: {
  //         id,
  //       },
  //     });
  //     if (findImg) {
  //       const imgPath = path.resolve(
  //         __dirname,
  //         '..',
  //         'static',
  //         'gallery',
  //         findImg.fileName,
  //       );
  //       fs.unlinkSync(imgPath);

  //       Gallery.destroy({
  //         where: {
  //           id: id,
  //         },
  //       });
  //       return res
  //         .status(200)
  //         .json({ status: 200, message: 'Deleted successfully' });
  //     }
  //     return next(res.json(ApiError.badRequest('Wrong id')));
  //   } catch (e) {
  //     next(res.json(ApiError.badRequest(e.message)));
  //   }
  // }

  async test(req, res, next) {
    try {
      res.send('test World!');
    } catch (e) {
      next(res.json(ApiError.badRequest(e.message)));
    }
  }
}

module.exports = new ImgController();
