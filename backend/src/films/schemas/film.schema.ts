import { Schema } from 'mongoose';

const ScheduleSchema = new Schema({
  daytime: Date,
  hall: Number,
  rows: Number,
  seats: Number,
  price: Number,
  taken: [String],
});

export const FilmSchema = new Schema({
  id: { type: String, required: true, unique: true },
  rating: Number,
  director: String,
  tags: [String],
  title: String,
  about: String,
  description: String,
  image: String,
  cover: String,
  schedule: { type: [ScheduleSchema], default: [] },
});
