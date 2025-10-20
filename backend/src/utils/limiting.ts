import rateLimit from "express-rate-limit";

export const modificationRateLimit = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    error: "Too many modification requests, slow down.",
  },
});

export const commentReplyRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "Too many modification requests, slow down.",
  },
});

export const fetchingRateLimit = rateLimit({
  windowMs: 1000,
  max: 500,
  message: {
    success: false,
    error: "Too many fetch requests, slow down.",
  },
});

export const loginRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: "Too many authentication requests, slow down.",
  },
});

export const registerRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: "Too many authentication requests, slow down.",
  },
});
