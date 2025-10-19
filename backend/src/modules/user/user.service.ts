import bcrypt from "bcrypt";
import jwt, {
  JwtPayload,
  Secret,
  SignOptions,
  TokenExpiredError,
} from "jsonwebtoken";

import User, { UserRole } from "./user.model";
import { ERROR_MAP, handleCatch } from "../../middlewares/errorHandler";
import { EnvConfig } from "../../config/env";

const JWT_SECRET = EnvConfig.jwtSecret;
const JWT_REFRESH_SECRET = EnvConfig.jwtRefreshSecret;
const TOKEN_EXPIRATION = EnvConfig.jwtExpiration;
const REFRESH_TOKEN_EXPIRATION = EnvConfig.jwtRefreshExpiration;

export const registerUser = async (data: {
  password: string;
  username: string;
  fullname: string;
  avatar?: string;
  roles?: UserRole[];
}) => {
  try {
    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) throw ERROR_MAP.CONFLICT;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
      roles: data?.roles ?? ["creator"],
    });

    return user;
  } catch (err) {
    throw handleCatch(err);
  }
};

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  try {
    const user = await User.findOne({ username: data.username });
    if (!user)
      throw {
        ...ERROR_MAP.NOT_FOUND,
        message: `User '${data.username}' not found.`,
      };

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch)
      throw {
        ...ERROR_MAP.NOT_ACCEPTABLE,
        message: `Password mismatch.`,
      };

    const token = jwt.sign(
      { id: user._id, roles: user.roles, user },
      JWT_SECRET as Secret,
      {
        expiresIn: TOKEN_EXPIRATION,
      } as SignOptions
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      JWT_REFRESH_SECRET as Secret,
      {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      } as SignOptions
    );

    return { user, token, refreshToken };
  } catch (err) {
    throw handleCatch(err);
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    if (!refreshToken) throw ERROR_MAP.BAD_REQUEST;

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET as Secret
      ) as JwtPayload;
    } catch (err: any) {
      if (err instanceof TokenExpiredError) {
        throw ERROR_MAP.REFRESH_TOKEN_EXPIRED;
      }

      throw ERROR_MAP.INVALID_REFRESH_TOKEN;
    }

    const user = await User.findById(decoded.id);
    if (!user)
      throw {
        ...ERROR_MAP.NOT_FOUND,
        message: `User '${decoded.id}' not found.`,
      };

    // issue new tokens
    const newToken = jwt.sign(
      { id: user._id, roles: user.roles },
      JWT_SECRET as Secret,
      { expiresIn: TOKEN_EXPIRATION } as SignOptions
    );

    const newRefreshToken = jwt.sign(
      { id: user._id },
      JWT_REFRESH_SECRET as Secret,
      {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      } as SignOptions
    );

    return { token: newToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw handleCatch(err);
  }
};
