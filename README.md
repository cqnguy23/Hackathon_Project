# Jaguar Hackathon Covid App

Help people get & receive help. And also more stuff.

## Dependencies

## Models

- Users
- Petitions
- Participants

### Notes

```js
User.schema = {
  ...,
  petitions: [...],
  participations: [...],
}

Petition.schema = {
  items: [],
  userId: Number,
  participants: [],
  loanAmount: Number,
  status: ['pending', 'processing', 'complete'],
  type: ['receive', 'provide', 'deliver', 'borrow'],
  startLoc: {
    lat: Number,
    long: Number,
    address: String,
    city: String,
    country: String,
  },
  endLoc: {
    lat: Number,
    long: Number,
    address: String,
    city: String,
    country: String,
  },
}

Participant.schema = {
  userId: Number,
  payAmount: Number,
  petitionId: Number,
  type: ['receiver', 'provider', 'driver', 'loaner', 'borrower', 'payer',],
  endLoc: {
    lat: Number,
    long: Number,
    address: String,
    city: String,
    country: String,
  },
}

Item.schema = {
  name: '',
  type: [],
  kg: Number,
  userId: Number,
  quantity: Number,
  petitionId: Number,
}
```

### Getting Up
- .env needs
  MONGODB_URI=''
  PORT=''

- Seed data with http://localhost:5000/api/foos/seed
- Delete Data with http://localhost:5000/api/foos/delete