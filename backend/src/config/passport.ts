import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
} from "passport-google-oauth20";
import { type Profile as GitHubProfile } from "passport-github2";
import { Strategy as GitHubStrategy } from "passport-github2";
import type { VerifyCallback } from "passport-oauth2";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../errors/AppError.js";

const prisma = new PrismaClient();

const getCallbackUrl = (provider: string): string => {
  return `${process.env.API_BASE_URL}/auth/${provider}/callback`;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: getCallbackUrl("google"),
      passReqToCallback: true,
    },
    async (
      req,
      _,
      __,
      profile: Profile,
      done: (err: any, user?: any) => void,
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(
            new AppError({
              message: "Google account has no email",
              statusCode: 400,
              code: "GOOGLE_NO_EMAIL",
            }),
          );
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName,
              avatar: profile.photos?.[0].value,
              provider: "google",
              googleId: profile.id,
            },
          });
        } else if (!user.googleId) {
          user = await prisma.user.update({
            where: { email },
            data: {
              googleId: profile.id,
              avatar: user.avatar || profile.photos?.[0].value,
            },
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: getCallbackUrl("github"),
      passReqToCallback: true,
    },
    async (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback,
    ) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.com`;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Create new
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || profile.username,
              avatar: profile.photos?.[0]?.value || "",
              provider: "github",
              githubId: profile.id,
            },
          });
        } else if (!user.githubId) {
          //  Link Account if exists
          user = await prisma.user.update({
            where: { email },
            data: {
              githubId: profile.id,
              avatar: user.avatar || profile.photos?.[0]?.value,
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export const configuredPassport = passport;
