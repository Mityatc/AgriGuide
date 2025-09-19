import { getCropRecommendations } from '../services/gemini.service.js';
import { validateRecommendInput } from '../utils/validation.js';

export const recommendController = {
  async createRecommendation(req, res, next) {
    try {
      const { value, error } = validateRecommendInput(req.body);
      if (error) {
        return res.status(400).json({ error });
      }

      const crops = await getCropRecommendations(value);
      return res.status(200).json({ crops });
    } catch (err) {
      return next(err);
    }
  },
};


