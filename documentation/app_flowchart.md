flowchart TD
  A[Open Dev Container] --> B[Install Dependencies]
  B --> C[Start Next JS Server]
  C --> D[User Opens Dashboard Page]
  D --> E[Render Dashboard UI]
  E --> F[Load Static Assets]
  D --> G[Open Chat Interface]
  G --> H[User Sends Message]
  H --> I[POST Request to API Chat]
  I --> J[Chat Route Handler]
  J --> K[Process Chat Logic]
  K --> L[Return Chat Response]
  L --> G