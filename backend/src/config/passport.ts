import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
} from "passport-google-oauth20";
import { type Profile as GitHubProfile } from "passport-github2";
import { Strategy as GitHubStrategy } from "passport-github2";
import type { VerifyCallback } from "passport-oauth2";
import { prisma } from "../utils/prismaClient.js";
import { AppError } from "../errors/AppError.js";

const getCallbackUrl = (provider: string): string => {
  return `http://localhost:5173/auth/${provider}/callback`;
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

        // FIX: Use upsert to handle race conditions atomically
        // Note: This assumes your Prisma schema has a unique constraint on 'email'
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            googleId: profile.id, // Link account if it existed via email/password
            avatar: profile.photos?.[0].value, // Update avatar if provided
            // Only update avatar if you want to overwrite existing ones
          },
          create: {
            email,
            name: profile.displayName || "Google User",
            avatar: profile.photos?.[0].value,
            provider: "google",
            googleId: profile.id,
          },
        });

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
        // GitHub emails can be private/null. Fallback logic is essential.
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.com`;
        const githubId = String(profile.id);

        let user = await prisma.user.findUnique({
          where: { githubId },
        });

        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              email: email,
              avatar: profile.photos?.[0]?.value,
            },
          });
          return done(null, user);
        }

        user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              githubId: githubId,
              avatar: user.avatar || profile.photos?.[0]?.value,
            },
          });
          return done(null, user);
        }

        try {
          user = await prisma.user.create({
            data: {
              email,
              githubId,
              name: profile.displayName || profile.username,
              avatar: profile.photos?.[0]?.value || "",
              provider: "github",
            },
          });
        } catch (error: any) {
          if (error.code === "P2002") {
            user = await prisma.user.findUnique({
              where: { githubId },
            });
            if (!user) throw error;
          } else {
            throw error;
          }
        }

        return done(null, user);
      } catch (err) {
        console.error("Passport GitHub Strategy Error:", err);
        return done(err);
      }
    },
  ),
);

export const configuredPassport = passport;
