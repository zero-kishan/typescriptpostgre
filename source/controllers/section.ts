import { NextFunction, Request, Response } from 'express';
import Joi from 'joi'
import moment from 'moment'

import { client } from '../config/postgresql'
import { formatJoiValErrors } from '../lib/errorhandling'

const getAllSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let bookArr = []
    let query = `SELECT 
    *
    FROM sections`;

    const queryRes = await client.query(query);
    // assign values in qeuryRes to bookArr here...
    bookArr = queryRes.rows

    return res.json({ data: bookArr, success: true, msg: "Sections Loaded" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const addSection = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const joiSchema = Joi.object().keys({
      catid: Joi.number().integer().required(),
      sectionname: Joi.string().required().min(2).max(100),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Adding cby manually for now.
    // Todo: Later get the data from sessions
    const userid = 1

    let query = `INSERT INTO sections
    (category_id, section_name, ct, cby)
    VALUES (${dataObj.catid}, '${dataObj.catname}', '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', ${userid})`;

    await client.query(query);

    return res.json({ success: true, msg: "Category added" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const updateSection = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const joiSchema = Joi.object().keys({
      sectionid: Joi.number().integer().required(),
      catid: Joi.number().integer().required(),
      sectionname: Joi.string().required().min(2).max(100),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    // Adding cby manually for now.
    // Todo: Later get the data from sessions
    const userid = 1

    let query = `UPDATE sections
    SET category_id = ${dataObj.catid}, section_name = '${dataObj.sectionname}', mt = '${moment.utc().format('YYYY-MM-DD HH:mm:ss')}', mby = ${userid}
    WHERE id = ${dataObj.sectionid}`;

    await client.query(query);

    return res.json({ success: true, msg: "Section Updated" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};

const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const joiSchema = Joi.object().keys({
      sectionid: Joi.number().integer().required(),
    });

    const { error: joiError, value: dataObj } = joiSchema.validate(req.body);

    if (joiError) {
      return res.json({ errors: formatJoiValErrors(joiError), success: false, msg: 'Check Parameters' });
    }

    let query = `DELETE FROM sections
    WHERE id = ${dataObj.sectionid}`;

    await client.query(query);

    return res.json({ success: true, msg: "Sections Deleted" });

  } catch (error) {
    return res.json({ success: false, message: error });
  }

};


export default { getAllSections, addSection, updateSection, deleteSection };