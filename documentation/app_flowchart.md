flowchart TD
  A[Sign In Page] --> B[Middleware]
  B --> C{Authenticated?}
  C -->|No| A
  C -->|Yes| D[Dashboard]
  D --> E[Announcements]
  D --> F[Classes]
  D --> G[Students]
  D --> H[Teachers]
  D --> I[Overview]
  E --> E1[List Announcements]
  E --> E2[Create Announcement]
  E1 --> E3[Edit Announcement]
  E1 --> E4[Delete Announcement]
  E2 --> E5[POST api slash announcements]
  E3 --> E6[PUT api slash announcements slash id]
  E4 --> E7[DELETE api slash announcements slash id]
  E1 --> E8[GET api slash announcements]
  F --> F1[List Classes]
  F --> F2[Create Class]
  F1 --> F3[Edit Class]
  F1 --> F4[Delete Class]
  F2 --> F5[POST api slash classes]
  F3 --> F6[PUT api slash classes slash id]
  F4 --> F7[DELETE api slash classes slash id]
  F1 --> F8[GET api slash classes]
  G --> G1[List Students]
  G --> G2[Create Student]
  G1 --> G3[Edit Student]
  G1 --> G4[Delete Student]
  G2 --> G5[POST api slash students]
  G3 --> G6[PUT api slash students slash id]
  G4 --> G7[DELETE api slash students slash id]
  G1 --> G8[GET api slash students]
  H --> H1[List Teachers]
  H --> H2[Create Teacher]
  H1 --> H3[Edit Teacher]
  H1 --> H4[Delete Teacher]
  H2 --> H5[POST api slash teachers]
  H3 --> H6[PUT api slash teachers slash id]
  H4 --> H7[DELETE api slash teachers slash id]
  H1 --> H8[GET api slash teachers]
  E5 --> DB[Supabase DB]
  E6 --> DB
  E7 --> DB
  E8 --> DB
  F5 --> DB
  F6 --> DB
  F7 --> DB
  F8 --> DB
  G5 --> DB
  G6 --> DB
  G7 --> DB
  G8 --> DB
  H5 --> DB
  H6 --> DB
  H7 --> DB
  H8 --> DB