import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nazwa miasta jest wymagana"],
      trim: true,
      minLength: [1, "Nazwa miasta musi mieć przynajmniej 1 znak"],
      maxLength: [128, "Nazwa miasta może mieć maksymalnie 128 znaków"],
    },
    voivodeship: {
      type: String,
      required: [true, "Województwo miasta jest wymagana"],
      trim: true,
      minLength: [1, "Nazwa województwa musi mieć przynajmniej 1 znak"],
      maxLength: [128, "Nazwa województwa może mieć maksymalnie 128 znaków"],
    },
    district: {
      type: String,
      trim: true,
      minLength: [1, "Powiat musi mieć przynajmniej 1 znak"],
      maxLength: [128, "Nazwa powiatu może mieć maksymalnie 128 znaków"],
    },
    commune: {
      type: String,
      trim: true,
      minLength: [1, "Gmina musi mieć przynajmniej 1 znak"],
      maxLength: [128, "Nazwa gminy może mieć maksymalnie 128 znaków"],
    },
    type: {
      type: String,
      enum: ["miasto", "miasteczko", "wieś", "kurort"],
      required: [true, "Typ miejscowości jest wymagany"],
      default: "miasto",
    },
    description: {
      type: String,
      trim: true,
      maxLength: [1024, "Opis miasta może mieć maksymalnie 1024 znaków"],
    },
    latitude: {
      type: Number,
      min: [-90, "Szerokośc geograficzna musi być większa niż -90"],
      max: [90, "Szerokośc geograficzna musi być nie większa niż 90"],
    },
    longitude: {
      type: Number,
      min: [-180, "Długość geograficzna musi być większa niż -180"],
      max: [180, "Długość geograficzna musi być nie większa niż 180"],
    },
  },
  {
    timestamps: true,
  }
);

citySchema.index({ name: 1 });
citySchema.index({ voivodeship: 1 });

const City = mongoose.model("City", citySchema);

export default City;
