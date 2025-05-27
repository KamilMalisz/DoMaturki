import City from "../models/city.model.js";

const getAllCities = async (req, res) => {
  const { name, voivodeship, page = 1, limit = 10 } = req.query;
  const query = {};

  if (name) {
    query.name = { $regex: `^${name}`, $options: "i" };
  }

  if (voivodeship) {
    query.voivodeship = { $regex: `^${voivodeship}`, $options: "i" };
  }

  const citiesCount = await City.countDocuments(query);
  const totalPages = Math.ceil(citiesCount / limit);

  const cities = await City.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    cities,
    totalPages,
    currentPage: parseInt(page),
    totalCount: citiesCount,
  });
};

const searchCityByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      res.status(500).json({ message: "City name is required" });
    }

    const city = await City.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (city) {
      res.status(200).json(city);
    } else {
      res.status(404).json({ message: "City not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCityById = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findById(id);

    if (city) {
      res.status(200).json(city);
    } else {
      res.status(404).json({ message: "City not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCity = async (req, res) => {
  try {
    const {
      name,
      voivodeship,
      district,
      commune,
      type,
      description,
      latitude,
      longitude,
    } = req.body;

    const existingCity = await City.findOne({ name, voivodeship });
    if (existingCity) {
      return res.status(400).json({
        errors: { name: "Miasto o tej nazwie już istnieje w tym województwie" },
      });
    }

    const newCity = new City({
      name,
      voivodeship,
      district,
      commune,
      type,
      description,
      latitude,
      longitude,
    });

    const validationError = newCity.validateSync();
    if (validationError) {
      const errors = {};
      Object.keys(validationError.errors).forEach((key) => {
        errors[key] = validationError.errors[key].message;
      });
      console.log("bledy", errors);
      return res.status(400).json({ errors });
    }

    await newCity.save();
    res.status(201).json(newCity);
  } catch (error) {
    console.log("Błąd: ", error.message);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

const updateCity = async (req, res) => {
  try {
    const id = req.body._id;

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Aktualizacja danych miasta
    Object.assign(city, req.body);

    const validationError = city.validateSync();
    if (validationError) {
      const errors = {};
      Object.keys(validationError.errors).forEach((key) => {
        errors[key] = validationError.errors[key].message;
      });

      return res.status(400).json({ errors });
    }

    await city.save();

    res.status(200).json(city);
  } catch (error) {
    console.error("Error updating city:", error.message);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

export { getAllCities, searchCityByName, getCityById, createCity, updateCity };
