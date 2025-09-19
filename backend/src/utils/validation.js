const REQUIRED_FIELDS = ['soil', 'ph', 'rainfall', 'temperature', 'state', 'budget'];

export function validateRecommendInput(body) {
  const errors = [];
  const value = {};

  // Required checks
  for (const key of REQUIRED_FIELDS) {
    if (body[key] === undefined || body[key] === null || body[key] === '') {
      errors.push(`${key} is required`);
    }
  }

  // Types & ranges
  if (body.soil && typeof body.soil !== 'string') errors.push('soil must be a string');
  if (body.state && typeof body.state !== 'string') errors.push('state must be a string');

  if (body.ph !== undefined && typeof body.ph !== 'number') errors.push('ph must be a number');
  if (body.rainfall !== undefined && typeof body.rainfall !== 'number') errors.push('rainfall must be a number');
  if (body.temperature !== undefined && typeof body.temperature !== 'number') errors.push('temperature must be a number');
  if (body.budget !== undefined && typeof body.budget !== 'number') errors.push('budget must be a number');

  if (body.lang !== undefined && typeof body.lang !== 'string') errors.push('lang must be a string');
  const allowedLangs = ['en','hi','mr','bn','gu','ta','te','kn','ml','pa','or'];
  if (typeof body.lang === 'string' && !allowedLangs.includes(body.lang)) errors.push('lang must be one of: ' + allowedLangs.join(', '));

  if (typeof body.ph === 'number' && (body.ph < 0 || body.ph > 14)) errors.push('ph must be between 0 and 14');
  if (typeof body.rainfall === 'number' && body.rainfall < 0) errors.push('rainfall must be >= 0');
  if (typeof body.temperature === 'number' && body.temperature < -10) errors.push('temperature is unrealistically low');
  if (typeof body.budget === 'number' && body.budget < 0) errors.push('budget must be >= 0');

  if (errors.length) {
    return { error: errors.join(', '), value: null };
  }

  value.soil = String(body.soil).trim();
  value.state = String(body.state).trim();
  value.ph = Number(body.ph);
  value.rainfall = Number(body.rainfall);
  value.temperature = Number(body.temperature);
  value.budget = Number(body.budget);
  value.lang = body.lang ? String(body.lang).trim() : 'en';

  return { value, error: null };
}


