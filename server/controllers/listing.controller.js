// /controllers/listing.controller.js

import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funkcja tworzenia nowego listingu (nieruchomości)
const createListing = async (req, res) => {
  console.log("req.body:", req.body);
  try {
    const {
      title,
      description,
      price,
      rooms,
      bathrooms,
      floor,
      size,
      locality,
      address,
      voivodeship,
      latitude,
      longitude,
      type,
      propertyType,
    } = req.body;

    // Użycie ID użytkownika z tokena
    const userRef = req.user._id; // Pobranie ID użytkownika z obiektu żądania (ustawionego przez middleware autoryzacyjny)

    const user = await User.findById(userRef); // Wyszukanie użytkownika w bazie danych po ID
    if (!user) {
      return res
        .status(400)
        .json({ errors: { userRef: "Użytkownik nie istnieje" } });
    }

    // Zapisanie ścieżek do plików graficznych
    console.log("req.files: ", req.files);
    const imageUrls = req.files.map((file) => `/img/listings/${file.filename}`);

    // Tworzenie nowego listingu
    const newListing = new Listing({
      title,
      description,
      price,
      rooms,
      bathrooms,
      floor,
      size,
      locality,
      address,
      voivodeship,
      latitude,
      longitude,
      type,
      propertyType,
      imageUrls,
      userRef,
    }); // Inicjalizacja nowego obiektu Listing z podanymi danymi

    const validationError = newListing.validateSync(); // Ręczne uruchomienie walidacji schematu
    if (validationError) {
      const errors = {};
      Object.keys(validationError.errors).forEach((key) => {
        errors[key] = validationError.errors[key].message; // Dodanie każdego błędu walidacji do obiektu errors
      });
      return res.status(400).json({ errors });
    }

    await newListing.save();

    user.listings.push(newListing._id); // Dodanie ID nowego listingu do tablicy listings użytkownika
    await user.save(); // Zapis zaktualizowanego użytkownika do bazy danych

    // Alternatywna metoda aktualizacji użytkownika za jednym wywołaniem:
    // await User.findByIdAndUpdate(userRef, { $push: { listings: newListing._id } });

    res.status(201).json(newListing); // Zwrócenie nowo utworzonego listingu z kodem 201 (utworzono)
  } catch (error) {
    console.log("błąd: ", error.message); // Logowanie błędu na serwerze
    res.status(500).json({ message: "Wystąpił błąd serwera" }); // Zwrócenie ogólnego błędu serwera z kodem 500
  }
};

// Funkcja usuwania obrazów listingu z systemu plików
const deleteListingImages = (imageUrls) => {
  imageUrls.forEach((url) => {
    const imagePath = path.join(__dirname, "..", "public", url); // Tworzenie pełnej ścieżki do obrazu
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Błąd podczas usuwania obrazu:", err); // Logowanie błędu, jeśli usuwanie się nie powiedzie
    });
  });
};

// Funkcja aktualizacji istniejącego listingu
const updateListing = async (req, res) => {
  try {
    const id = req.body._id;

    // Sprawdzenie, czy listing istnieje 
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Sprawdzenie, czy aktualizujący użytkownik jest właścicielem listingu lub ma odpowiednie uprawnienia (np. admin)
    if (
      req.user._id !== listing.userRef.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "You can't update that listing" }); // Zwrócenie błędu 401, jeśli użytkownik nie ma uprawnień
    }

    // Jeśli przesłane są nowe zdjęcia, usuń poprzednie
    let imageUrls = listing.imageUrls; // Pobranie obecnych URL-ów obrazów
    if (req.files && req.files.length > 0) {
      deleteListingImages(imageUrls); // Usunięcie starych obrazów z systemu plików
      imageUrls = req.files.map((file) => `/img/listings/${file.filename}`); // Ustawienie nowych URL-ów obrazów
    }

    // Aktualizacja danych listingu
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body, // Ustawienie nowych danych z ciała żądania
          imageUrls, // Aktualizacja URL-ów obrazów
        },
      },
      {
        new: true, // Opcja, aby zwrócić zaktualizowany dokument
        runValidators: true, // Uruchomienie walidacji podczas aktualizacji
      }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error.message);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

// Funkcja pobierania wszystkich listingów z paginacją
const getAllListings = async (req, res) => {
  try {
    // Odczytanie parametrów paginacji z zapytania
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalCount = await Listing.countDocuments({ finished: false });

    const listings = await Listing.find({ finished: false })
      .populate("userRef")
      .sort({ createdAt: -1 }) // Sortowanie od najnowszych do najstarszych
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      listings, // Lista listingów
      totalCount, // Całkowita liczba listingów
      page: page, // Aktualna strona
      limit, // Limit na stronę
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funkcja pobierania pojedynczego listingu
const getListing = async (req, res) => {
  try {
    const { id } = req.params; // Pobranie ID listingu z parametrów URL

    const listing = await Listing.findById(id).populate("userRef");

    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).json({ message: "Listing not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funkcja pobierania listingów użytkownika
const getUserListings = async (req, res) => {
  try {
    const { id } = req.params; // Pobranie ID użytkownika z parametrów URL

    const userListings = await Listing.find({ userRef: id });

    if (userListings.length > 0) {
      res.status(200).json(userListings);
    } else {
      res.status(404).json({ message: "Listings not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funkcja usuwania listingu
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const dbListing = await Listing.findById(id).populate("userRef");
    if (!dbListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (
      req.user._id !== dbListing.userRef._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "You can't delete that listing" });
    }

    deleteListingImages(dbListing.imageUrls);

    await Listing.findByIdAndDelete(id);
    res.status(200).json({ message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funkcja wyszukiwania listingów z różnymi filtrami
const searchListings = async (req, res) => {
  try {
    // Tworzenie dynamicznego zapytania na podstawie parametrów zapytania
    const query = {};

    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType.toLowerCase();
    }

    if (req.query.type) {
      query.type = req.query.type.toLowerCase();
    }

    if (req.query.locality) {
      query.locality = req.query.locality;
    }

    if (req.query.minSize) {
      query.size = query.size || {};
      query.size.$gte = parseInt(req.query.minSize);
    }

    if (req.query.maxSize) {
      query.size = query.size || {};
      query.size.$lte = parseInt(req.query.maxSize);
    }

    if (req.query.minPrice) {
      query.price = query.price || {};
      query.price.$gte = parseInt(req.query.minPrice);
    }

    if (req.query.maxPrice) {
      query.price = query.price || {};
      query.price.$lte = parseInt(req.query.maxPrice);
    }

    if (req.query.rooms) {
      query.rooms = { $gte: parseInt(req.query.rooms) };
    }

    // Paginacja
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    query.finished = false; // Tylko aktywne ogłoszenia

    const listings = await Listing.find(query)
      .populate("userRef")
      .populate("cityRef")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Listing.countDocuments(query);

    res.status(200).json({
      listings,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funkcja pobierania listingów w określonym obszarze geograficznym (bounding box)
const getFilteredListingsInBounds = async (req, res) => {
  try {
    const { southWest, northEast } = req.query; // Pobranie parametrów bounding box z zapytania

    // Parsowanie współrzędnych
    const sw = southWest.split(",").map((coord) => parseFloat(coord)); // Parsowanie współrzędnych południowo-zachodnich
    const ne = northEast.split(",").map((coord) => parseFloat(coord)); // Parsowanie współrzędnych północno-wschodnich

    // Tworzenie dynamicznego zapytania na podstawie parametrów zapytania
    const query = {
      latitude: { $gte: sw[0], $lte: ne[0] }, // Ustawienie zakresu szerokości geograficznej
      longitude: { $gte: sw[1], $lte: ne[1] }, // Ustawienie zakresu długości geograficznej
    };

    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType.toLowerCase();
    }

    if (req.query.type) {
      query.type = req.query.type.toLowerCase();
    }

    if (req.query.locality) {
      query.locality = req.query.locality;
    }

    if (req.query.minSize) {
      query.size = query.size || {};
      query.size.$gte = parseInt(req.query.minSize);
    }

    if (req.query.maxSize) {
      query.size = query.size || {};
      query.size.$lte = parseInt(req.query.maxSize);
    }

    if (req.query.minPrice) {
      query.price = query.price || {};
      query.price.$gte = parseInt(req.query.minPrice);
    }

    if (req.query.maxPrice) {
      query.price = query.price || {};
      query.price.$lte = parseInt(req.query.maxPrice);
    }

    if (req.query.rooms) {
      query.rooms = { $gte: parseInt(req.query.rooms) };
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching filtered listings in bounds:", error.message);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

const getListingsInBounds = async (req, res) => {
  try {
    const { southWest, northEast } = req.query;

    // Parsowanie współrzędnych
    const sw = southWest.split(",").map((coord) => parseFloat(coord));
    const ne = northEast.split(",").map((coord) => parseFloat(coord));

    const listings = await Listing.find({
      latitude: { $gte: sw[0], $lte: ne[0] },
      longitude: { $gte: sw[1], $lte: ne[1] },
    });

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings in bounds:", error.message);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

const getLatestListings = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 30) limit = 10;

    let type = req.query.type ? req.query.type.toLowerCase() : "stacjonarnie";

    const query = { finished: false };

    if (["stacjonarnie", "zdalnie"].includes(type)) {
      query.type = type;
    } else {
      return res
        .status(400)
        .json({ message: "Nieprawidłowy parametr typu" });
    }

    const listings = await Listing.find(query)
      .populate("userRef")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(listings);
  } catch (error) {
    console.error(
      "Błąd podczas pobierania najnowszych listingów:",
      error.message
    );
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

const finishListing = async (req, res) => {
  try {
    const { id } = req.body;

    const dbListing = await Listing.findById(id).populate("userRef");

    if (
      req.user._id !== dbListing.userRef._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "You can't update that listing" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { $set: { finished: true } },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Error finishing listing:", error.message);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

export {
  getAllListings,
  updateListing,
  getUserListings,
  searchListings,
  createListing,
  finishListing,
  getListing,
  deleteListing,
  getListingsInBounds,
  getFilteredListingsInBounds,
  getLatestListings,
};
