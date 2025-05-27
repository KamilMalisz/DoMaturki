import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Nazwa użytkownika jest wymagana"],
      unique: true,
      trim: true,
      minLength: [1, "Nazwa użytkownika musi mieć przynajmniej 1 znak"],
      maxLength: [128, "Nazwa użytkownika musi mieć nie więcej niż 128 znaków"],
    },
    password: {
      type: String,
      required: [true, "Hasło jest wymagane"],
      trim: true,
      minLength: [8, "Hasło musi mieć przynajmniej 8 znaków"],
      maxLength: [128, "Hasło musi mieć nie więcej niż 128 znaków"],
    },
    email: {
      type: String,
      required: [true, "Email jest wymagany"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return v.includes("@");
        },
        message: "Nieprawidłowy format adresu email",
      },
      minLength: [5, "Email musi mieć przynajmniej 5 znaków"],
      maxLength: [128, "Email musi mieć nie więcej niż 128 znaków"],
    },
    avatar: {
      type: String,
      default: "/img/avatars/default.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
    firstName: {
      type: String,
      //required: [true, "Imię jest wymagane"],
      trim: true,
      minLength: [1, "Imię musi mieć przynajmniej 1 znak"],
      maxLength: [128, "Imię musi mieć nie więcej niż 128 znaków"],
    },
    lastName: {
      type: String,
      //required: [true, "Nazwisko jest wymagane"],
      trim: true,
      minLength: [1, "Nazwisko musi mieć przynajmniej 1 znak"],
      maxLength: [128, "Nazwisko musi mieć nie więcej niż 128 znaków"],
    },
    companyName: {
      type: String,
      //required: [true, "Nazwa firmy jest wymagana"],
      trim: true,
      minLength: [1, "Nazwa firmy musi mieć przynajmniej 1 znak"],
      maxLength: [128, "Nazwa firmy musi mieć nie więcej niż 128 znaków"],
    },
    address: {
      type: String,
      //required: [true, "Adres jest wymagany"],
      trim: true,
      minLength: [1, "Adres musi mieć przynajmniej 1 znak"],
      maxLength: [256, "Adres musi mieć nie więcej niż 256 znaków"],
    },
    telephone: {
      type: String,
      //required: [true, "Telefon jest wymagany"],
      trim: true,
      minLength: [1, "Telefon musi mieć przynajmniej 1 znak"],
      maxLength: [64, "Telefon musi mieć nie więcej niż 64 znaków"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;
