# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Supabase setup (letter form)

The letter form persists to [Supabase](https://supabase.com) (free tier).

1. Create a project at [supabase.com](https://supabase.com) and get **Project URL** and **anon public** key from **Project Settings → API**.
2. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL` = your project URL  
   - `VITE_SUPABASE_ANON_KEY` = your anon key
3. In the Supabase **SQL Editor**, run the migrations in order:
   - `supabase/migrations/001_letters.sql`
   - `supabase/migrations/002_storage_letter_attachments.sql`
   - `supabase/migrations/003_letter_image_urls.sql`
4. **Storage** (for image/audio attachments):
   - In Supabase go to **Storage** → **New bucket**.
   - Name: `letter-attachments`, enable **Public bucket** (so the wall can show images/audio).
   - After creating the bucket, go to **Policies** and add a policy so anonymous users can upload: **New policy** → “For full customization” → Policy name e.g. `Allow anon upload`, Operation **INSERT**, Target roles **anon**, WITH CHECK expression `true`. Add a SELECT policy with USING `true` if needed for public read.

Without `.env` configured, the app still runs: letters are kept in memory only and new submissions appear on the wall until refresh.

**Deploy pe GitHub Pages (workflow `.github/workflows/deploy-pages.yml`)**  
Dacă aplicația e embedded pe alt domeniu (ex. ideoideis.ro), adaugă în **Settings → Secrets and variables → Actions** un secret numit `VITE_SHARE_BASE_URL` cu URL-ul paginii unde e embedded (ex. `https://ideoideis.ro/elementor-9069`). Astfel, linkurile de share (Facebook, WhatsApp, copiere) vor pointa către acel site, nu către github.io.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
