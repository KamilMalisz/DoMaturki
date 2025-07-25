import mongoose from "mongoose";
import User from "./user.model.js";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tytuł jest wymagany"],
      trim: true,
      minLength: [1, "Tytuł musi mieć przynajmniej 1 znak"],
      maxLength: [128, "Tytuł może mieć maksymalnie 128 znaków"],
    },
    description: {
      type: String,
      required: [true, "Opis jest wymagany"],
      trim: true,
      minLength: [10, "Opis musi mieć przynajmniej 10 znaków"],
      maxLength: [20000, "Opis może mieć maksymalnie 20k znaków"],
    },
    price: {
      type: Number,
      required: [true, "Cena jest wymagana"],
      min: [0, "Cena nie może być ujemna"],
    },
    // rooms: {
    //   type: Number,
    //   required: [true, "Liczba pokoi jest wymagana"],
    //   min: [1, "Liczba pokoi musi być większa niż 0"],
    // },
    // bathrooms: {
    //   type: Number,
    //   required: [true, "Liczba łazienek jest wymagana"],
    //   min: [0, "Liczba łazienek nie może być ujemna"],
    // },
    // floor: {
    //   type: Number,
    //   required: [true, "Piętro jest wymagane"],
    //   min: [0, "Piętro nie może być ujemne"],
    // },
    // size: {
    //   type: Number,
    //   required: [true, "Rozmiar nieruchomości jest wymagany"],
    //   min: [1, "Rozmiar nieruchomości musi być większy niż 1"],
    // },
    locality: {
      type: String,
      trim: true,
      required: [true, "Nazwa miejscowości jest wymagana"],
      minLength: [1, "Nazwa miejscowości musi mieć więcej niż 1 znak"],
      maxLength: [128, "Nazwa miejscowości musi mieć maksymalnie 128 znaków"],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Adres jest wymagany"],
      minLength: [1, "Adres musi mieć więcej niż 1 znak"],
      maxLength: [256, "Adres musi mieć maksymalnie 256 znaków"],
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    voivodeship: {
      type: String,
    },
    type: {
      type: String,
      required: [true, "Forma jest wymagana"],
      enum: ["Stacjonarnie", "Zdalnie"],
      default: "Stacjonarnie",
    },
    propertyType: {
      type: String,
      required: [true, "Przedmiot jest wymagany"],
      enum: [
        "matematyka",
        "Język polski",
        "Język angielski",
      ],
      default: "matematyka",
    },
    imageUrls: [
      {
        type: String,
      },
    ],
    finished: {
      type: Boolean,
      default: false,
    },
    privateOffer: {
      type: Boolean,
      default: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cityRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
