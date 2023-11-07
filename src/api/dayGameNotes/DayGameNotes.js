const { Schema, model } = require("mongoose");

const DayGameNotesSchema = new Schema({
     notes: [{ type: String }] 
},
{ timestamps: true }
);

module.exports = model("DayGameNotes", DayGameNotesSchema);