import Listing from "../models/listing.model.js";

// http:localhost:3000/api/v1/listings/latest?limit=10&type=wynajem
const getLatestListings = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 30) limit = 30;

    let type = req.query.type ? req.query.type.toLowerCase() : "sprzedaż";

    const query = { finished: false };

    if (["sprzedaż", "wynajem"].includes(type)) {
      query.type = type;
    } else {
      return res
        .status(400)
        .message({ message: "Nieprawidłowy parametr typu transakcji" });
    }

    const listings = await Listing.find(query)
      // .populate("userRef")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.ststus(200).json(listings);
  } catch (error) {
    console.erroe("Błąd podczas pobierania najnowszych listingów: " + error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

export { getLatestListings };
