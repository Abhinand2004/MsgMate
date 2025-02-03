// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import dotenv from "dotenv";
// import User from "./models/User.js"; // Import User model

// dotenv.config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user exists in DB
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           // Create new user
//           user = new User({
//             username: profile.displayName,
//             email: profile.emails[0].value,
//             googleId: profile.id,
//             image: profile.photos[0].value,
//           });
//           await user.save();
//         }

//         return done(null, user);  
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);  // Store only user ID
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });
