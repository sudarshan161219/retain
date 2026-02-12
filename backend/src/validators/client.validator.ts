import { body, param } from "express-validator";
import { ClientStatus } from "@prisma/client";

export const createClientValidators = [
  body("name").trim().notEmpty().withMessage("Client name is required"),

  body("totalHours")
    .isFloat({ min: 0.1 })
    .withMessage("Total hours must be a positive number"),

  body("hourlyRate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),

  body("currency")
    .optional()
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code (e.g. USD)"),

  body("refillLink")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Must be a valid URL"),
];

export const updateDetailsValidators = [
  param("id").isUUID().withMessage("Invalid Client ID"),

  body("name")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),

  body("hours")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Hours must be a number"),

  body("rate")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Rate must be a number"),

  body("currency")
    .optional()
    .isLength({ min: 3, max: 3 })
    .toUpperCase()
    .withMessage("Currency must be a 3-letter code"),

  body("refillLink")
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage("Refill link must be a valid URL"),
];

export const updateStatusValidators = [
  param("id").isUUID().withMessage("Invalid Client ID"),
  body("status")
    .isIn(Object.values(ClientStatus))
    .withMessage(
      `Status must be one of: ${Object.values(ClientStatus).join(", ")}`,
    ),
];

export const addLogValidators = [
  param("id").isUUID().withMessage("Invalid Client ID"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("hours").isFloat({ min: 0.1 }).withMessage("Hours must be > 0"),
  body("date").optional().isISO8601().withMessage("Invalid date format"),
];

export const refillValidators = [
  param("id").isUUID().withMessage("Invalid Client ID"),
  body("hours").isFloat({ min: 0.1 }).withMessage("Refill amount must be > 0"),
];

export const idParamValidator = [
  param("id").isUUID().withMessage("Invalid Client ID"),
];

export const logIdParamValidator = [
  param("logId").isUUID().withMessage("Invalid Log ID"),
];

export const slugParamValidator = [
  param("slug").trim().notEmpty().withMessage("Slug is required"),
];
