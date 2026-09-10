import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "./env.js";
import { userCollection } from "./db.js";

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(null, false, { message: "No email returned from Google" });
          }

          let user = await userCollection.findOne({ email });

          if (!user) {
            const newUser = {
              name: profile.displayName || "Google User",
              email,
              profilePhoto: profile.photos?.[0]?.value || "",
              role: "user",
              authProvider: "google",
              createdAt: new Date(),
            };

            const result = await userCollection.insertOne(newUser);

            user = {
              _id: result.insertedId,
              ...newUser,
            };
          }

          return done(null, user);
        } catch (error) {
          console.error("Google authentication error:", error);
          return done(error, null);
        }
      },
    ),
  );
} else {
  console.warn("⚠️ Google OAuth client ID/Secret not set in environment. Google login disabled.");
}

export default passport;
