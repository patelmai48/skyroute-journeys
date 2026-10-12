const express = require('express');
const { getFlights } = require('../data/flights');

function flightRoutes() {
  const router = express.Router();

  router.get('/', (req, res) => {
    const {
      origin,
      destination,
      cabin = 'Economy',
      passengers = 1,
      stops,
      price,
      priceFilter,
      airline,
      departureTime,
      baggage,
      refundable,
      sortBy = 'best'
    } = req.query;

    let list = getFlights({ origin, destination, cabin });

    // 1. Filter by Stops
    if (stops === 'non-stop' || stops === '0') {
      list = list.filter((f) => f.stops === 0);
    } else if (stops === '1-stop' || stops === '1') {
      list = list.filter((f) => f.stops === 1);
    }

    // 2. Filter by Price
    const pFilter = priceFilter || (typeof price === 'string' && isNaN(Number(price)) ? price : null);
    if (pFilter === 'under-5000') {
      list = list.filter((f) => f.price < 5000);
    } else if (pFilter === '5000-10000') {
      list = list.filter((f) => f.price >= 5000 && f.price <= 10000);
    } else if (pFilter === 'above-10000') {
      list = list.filter((f) => f.price > 10000);
    } else if (price && !isNaN(Number(price))) {
      const maxPrice = Number(price);
      list = list.filter((f) => f.price <= maxPrice);
    }

    // 3. Filter by Airline
    if (airline && airline !== 'all') {
      list = list.filter((f) => f.airline.toLowerCase() === airline.toLowerCase());
    }

    // 4. Filter by Departure Time
    if (departureTime === 'morning') {
      list = list.filter((f) => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        return hour >= 6 && hour < 12;
      });
    } else if (departureTime === 'afternoon') {
      list = list.filter((f) => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        return hour >= 12 && hour < 18;
      });
    } else if (departureTime === 'evening') {
      list = list.filter((f) => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        return hour >= 18 || hour < 6;
      });
    }

    // 5. Filter by Baggage
    if (baggage === 'checkin-included') {
      list = list.filter((f) => f.baggage && (f.baggage.includes('Check-in') || f.baggage.includes('15kg') || f.baggage.includes('20kg') || f.baggage.includes('25kg')));
    }

    // 6. Filter by Refundability
    if (refundable === 'true' || refundable === true) {
      list = list.filter((f) => f.refundable === true);
    }

    // 7. Sorting
    if (sortBy === 'cheapest') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'fastest') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === 'earliest') {
      list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (sortBy === 'best') {
      list.sort((a, b) => (b.recommendedScore || 0) - (a.recommendedScore || 0));
    }

    res.json({ flights: list, total: list.length });
  });

  return router;
}

module.exports = flightRoutes;
